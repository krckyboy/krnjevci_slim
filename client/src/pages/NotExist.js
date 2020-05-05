import React from 'react'
import styled from 'styled-components'
import Button3 from '../components/buttons/Button3'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout/Layout'

const Main = styled.main`
	padding-top: 8rem;
	padding-bottom: 6.4rem;

	/* .bodyPadding fallback */
	padding-left: 2.4rem;
	padding-right: 2.4rem;
`

const H1 = styled.h1`
	font-weight: bold;
	font-size: 2.4rem;
	line-height: 3.3rem;
	text-align: center;
`

const StyledButton = styled(Button3)`
	margin: 0 auto;
	display: block;
	margin-top: 2.4rem;

	span {
		color: white;
	}
`

export default () => {
	return (
		<Layout>
			<Main className='content'>
				<H1>Adresa kojoj pristupate ne postoji!</H1>
				<StyledButton>
					<Link to='/'>
						<span>Početna strana</span>
					</Link>
				</StyledButton>
			</Main>
		</Layout>
	)
}
