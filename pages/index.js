import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/react'
import XHRUpload from '@uppy/xhr-upload'

export default function Home() {
	const [text, setText] = useState()
	const [confidence, setConfidence] = useState()
	const [isCopied, setIsCopied] = useState(false)
	const router = useRouter()
	const uppy = useMemo(() => {
		return new Uppy({
			restrictions: {
				maxNumberOfFiles: 1,
				maxFileSize: 2000000,
				maxTotalFileSize: 2000000,
				allowedFileTypes: ['.jpg', '.jpeg', '.png'],
			},
		}).use(XHRUpload, {
			endpoint: '/api/upload',
			fieldName: 'image',
			formData: true,
			method: 'POST',
			timeout: 60 * 1000,
		})
	})

	uppy.on('upload-success', (file, res) => {
		setText(res.body.text.trim())
		setConfidence(res.body.confidence)
	})

	useEffect(() => {
		return () => uppy.close()
	}, [text])

	const handleClipboard = (e) => {
		e.preventDefault()
		navigator.clipboard.writeText(text)
		setIsCopied(true)
		setInterval(() => {
			setIsCopied(false)
		}, 2000)
	}

	const handleSearch = (e) => {
		e.preventDefault()
		window.open(`https://www.google.com/search?q=${text}`, '_blank')
	}

	const handleRefresh = (e) => {
		e.preventDefault()
		router.reload()
	}

	return (
		<div className='my-24 h-full w-full flex flex-row justify-center'>
			{text ? (
				<div className='w-10/12 md:9/12 lg:w-7/12 flex flex-col items-center gap-3'>
					<div className='h-sul w-full p-3 text-current bg-gray-800 rounded-lg overflow-y-auto'>
						{text}
					</div>
					<div className='w-full flex flex-col items-center lg:flex-row lg:justify-center gap-3 text-xs font-semibold select-none'>
						{isCopied ? (
							<button className='w-32 py-2 text-green-400 bg-transparent border border-green-400 rounded-lg transition-all duration-300'>
								Copied!
							</button>
						) : (
							<button
								onClick={handleClipboard}
								className='w-32 py-2 text-yellow-500 lg:hover:text-yellow-600 border border-yellow-500 lg:hover:border-yellow-600 rounded-lg transition-all duration-300'>
								Copy to clipboard
							</button>
						)}
						<button
							onClick={handleSearch}
							className='w-32 py-2 text-yellow-500 lg:hover:text-yellow-600 border border-yellow-500 lg:hover:border-yellow-600 rounded-lg transition-all duration-300'>
							Search Google
						</button>
						<button
							onClick={handleRefresh}
							className='w-9 py-2 text-yellow-500 lg:hover:text-yellow-600 border border-yellow-500 lg:hover:border-yellow-600 rounded-lg transition-all duration-300'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-4 w-4 mx-auto'
								viewBox='0 0 20 20'
								fill='currentColor'>
								<path
									fillRule='evenodd'
									d='M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z'
									clipRule='evenodd'
								/>
							</svg>
						</button>
						<span className='px-3 py-2 text-yellow-500'>{`Confidence ~ ${confidence}%`}</span>
					</div>
				</div>
			) : (
				<div className='w-10/12 md:9/12 lg:w-7/12 relative'>
					<Dashboard
						uppy={uppy}
						width='100%'
						height={350}
						theme='dark'
					/>
				</div>
			)}
		</div>
	)
}
