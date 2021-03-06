import nextConnect from 'next-connect'
import multer from 'multer'
import path from 'path'
import { createWorker } from 'tesseract.js'
import { unlinkSync } from 'fs'

const apiRoute = nextConnect({
	onError(error, req, res) {
		console.log(error)
		res.status(501).json({
			error: `Sorry something Happened! ${error.message}`,
		})
	},
	onNoMatch(req, res) {
		res.status(405).json({ error: `Method '${req.method}' Not Allowed` })
	},
})

apiRoute.use(
	multer({
		storage: multer.diskStorage({
			destination: `./public/uploads`,
			filename: (req, file, cb) => {
				cb(null, `${Date.now()}${path.extname(file.originalname)}`)
			},
		}),
	}).single('image')
)

apiRoute.post(async (req, res) => {
	if (req.file) {
		const worker = createWorker()

		await worker.load()
		await worker.loadLanguage('eng')
		await worker.initialize('eng')

		const {
			data: { text, confidence },
		} = await worker.recognize(`./public/uploads/${req.file.filename}`)

		await worker.terminate()

		unlinkSync(`./public/uploads/${req.file.filename}`)

		res.json({ text, confidence })
	} else {
		res.json({ message: 'Image upload failed' })
	}
})

export default apiRoute

export const config = {
	api: {
		bodyParser: false,
	},
}
