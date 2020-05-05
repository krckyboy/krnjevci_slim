import React, { Fragment as F } from 'react'
import Header from './Header'
import Footer from './Footer'

export default function Layout(props) {
	return (
		<F>
			<Header />
			{props.children}
			<Footer />
		</F>
	)
}
