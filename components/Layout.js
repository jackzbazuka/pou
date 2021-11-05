import NextHead from 'next/head'

export default function Layout({ children }) {
	return (
		<div className='w-full flex flex-col items-center'>
			<NextHead>
				<link rel='icon' type='image/png' href='/favicon.png' />
				<title>Pou.</title>
			</NextHead>
			<header className='w-full'>
				<div className='mt-10 w-full flex flex-col items-center'>
					<h1 className='m-1 p-1 text-4xl font-bold text-green-400'>
						Pou.
					</h1>
					<p className='m-1 p-1 text-sm text-gray-400'>
						Web app for OCR in images
					</p>
				</div>
			</header>
			{children}
			<footer className='mt-5 mb-10 text-gray-400 text-sm'>
				<span className='flex flex-row items-center'>
					{'Made with'}
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5 mx-1 inline text-red-700'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<path
							fillRule='evenodd'
							d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
							clipRule='evenodd'
						/>
					</svg>
					{'in India by'}
					<a
						className='mx-1 inline text-current lg:hover:text-green-400 transition-all duration-300'
						href='https://www.milindsathe.io'
						target='_blank'
					>
						Milind Sathe
					</a>
				</span>
			</footer>
		</div>
	)
}
