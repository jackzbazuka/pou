import nextConnect from 'next-connect'
import multer from 'multer'
import path from 'path'
import { createWorker } from 'tesseract.js'
import { unlinkSync } from 'fs'

let fileName

const uploadImage = multer({
	storage: multer.diskStorage({
		destination: `./public/uploads`,
		filename: (req, file, cb) => {
			fileName = `${Date.now()}${path.extname(file.originalname)}`
			cb(null, fileName)
		},
	}),
}).single('image')

const apiRoute = nextConnect({
	onError(error, req, res) {
		res.status(501).json({
			error: `Sorry something Happened! ${error.message}`,
		})
	},
	onNoMatch(req, res) {
		res.status(405).json({ error: `Method '${req.method}' Not Allowed` })
	},
})

apiRoute.use(uploadImage)

apiRoute.post(async (req, res) => {
	if (req.file) {
		const worker = createWorker({
			logger: (m) => console.log(m),
		})

		await worker.load()
		await worker.loadLanguage('eng')
		await worker.initialize('eng')

		const {
			data: { text, confidence },
		} = await worker.recognize(`./public/uploads/${fileName}`)

		await worker.terminate()

		unlinkSync(`./public/uploads/${fileName}`)

		res.json({ text, confidence })
	} else {
		res.json({ message: 'Image upload failed' })
	}
})

export default apiRoute

export const config = {
	api: {
		bodyParser: false, // Disallow body parsing, consume as stream
	},
}
