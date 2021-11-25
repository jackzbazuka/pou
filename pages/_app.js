import 'tailwindcss/tailwind.css'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import Script from 'next/script'
import Layout from '@/components/Layout'
import { initialize } from '@/lib/clientApp'
import * as gtag from '@/lib/gTag'

export default function App({ Component, pageProps }) {
	// Initialize the firebase SDK
	initialize()

	return (
		<>
			<Script
				strategy='afterInteractive'
				src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
			/>
			<Script
				id='gtag-init'
				strategy='afterInteractive'
				dangerouslySetInnerHTML={{
					__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
				}}
			/>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</>
	)
}
