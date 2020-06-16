import React, { useEffect } from 'react'
import styled from 'styled-components'
import Heading4 from '../components/Heading4'
import InputEmail from '../components/form/InputEmail'
import InputPassword from '../components/form/InputPassword'
import { Link } from 'react-router-dom'
import Button3 from '../components/buttons/Button3'
import Layout from '../components/Layout/Layout'

const Main = styled.main`
	padding-top: 4.8rem;
	padding-bottom: 6.4rem;

	/* .bodyPadding fallback */
	padding-left: 2.4rem;
	padding-right: 2.4rem;
`

const Form = styled.form`
	label {
		margin-top: 1.6rem;
		display: flex;
		margin-bottom: 1.2rem;
	}

	p {
		font-size: 1.4rem;
	}
`

const StyledLink = styled(Link)`
	font-weight: 600;
	text-decoration: underline;
	cursor: pointer;
	font-size: 1.4rem;
`

const LinkContainer = styled.div`
	margin-top: 2.4rem;
	margin-bottom: 3.2rem;
`

const StyledButton = styled(Button3)`
	display: block;
	margin: 0 auto;
	margin-bottom: 2.4rem;
`

const RegisterP = styled.p`
	text-align: center;
`

export default () => {
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])
	return (
		<Layout>
			<Main className='content'>
				<Heading4 isCenter={true}>Uloguj se</Heading4>
				{/*
			<FacebookButton />
			<Hr />
			<Ili>ili unesite svoje podatke</Ili>
		*/}
				<Form>
					<InputEmail />
					<InputPassword />
					<LinkContainer>
						<StyledLink to='/'>Zaboravljena lozinka?</StyledLink>
					</LinkContainer>
					<StyledButton>Uloguj se</StyledButton>
					<RegisterP>
						Nemate nalog?{' '}
						<StyledLink to='/registruj_se'>Registrujte se</StyledLink>
					</RegisterP>
				</Form>
			</Main>
		</Layout>
	)
}
