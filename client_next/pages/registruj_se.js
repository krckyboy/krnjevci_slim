import styled from 'styled-components'
import Heading4 from '../components/Heading4'
import FacebookButton from '../components/buttons/Facebook'
import InputEmail from '../components/form/InputEmail'
import InputPassword from '../components/form/InputPassword'
import InputRepeatPassword from '../components/form/InputRepeatPassword'
import Link from '../components/ActiveLink'
import Button3 from '../components/buttons/Button3'

const Main = styled.main`
	padding-top: 4.8rem;
	padding-bottom: 6.4rem;

	/* .bodyPadding fallback */
	padding-left: 2.4rem;
	padding-right: 2.4rem;
`

const Hr = styled.hr`
	border: 1px solid #b1c9e8;
	max-width: 100%;
	margin-top: 2.4rem;
`

const Ili = styled.p`
	font-weight: 600;
	font-size: 1.4rem;
	line-height: 146.28%;
	text-align: center;
	margin-top: 1.6rem;
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

const StyledLink = styled.a`
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
	return (
		<Main className='content'>
			<Heading4 isCenter={true}>Registruj se</Heading4>
			{ /*
				<FacebookButton />
				<Hr />
				<Ili>ili unesite svoje podatke</Ili>
			*/ }
			<Form>
				<InputEmail />
				<InputPassword />
				<InputRepeatPassword />
				<LinkContainer>
					<Link href='/'>
						<StyledLink>Odredbe i uslovi koriščenja</StyledLink>
					</Link>
				</LinkContainer>
				<StyledButton>Registruj se</StyledButton>
				<RegisterP>
					Već imate nalog?{' '}
					<Link href='/uloguj_se'>
						<StyledLink>Ulogujte se</StyledLink>
					</Link>
				</RegisterP>
			</Form>
		</Main>
	)
}
