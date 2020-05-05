// import App from 'next/app'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import '../styles.css'

// _app.js is used like this for structuring layout, for example.
function MyApp({ Component, pageProps }) {
	return (
		<>
			<Header />
			<Component className='content' {...pageProps} />
			<Footer />
		</>
	)
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp
