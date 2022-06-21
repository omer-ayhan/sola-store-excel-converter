import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Excel Converter</title>
				<link rel="shortcut icon" href="/placeholder.jpg" />
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
