import styled from 'styled-components'
import Button3 from '../components/buttons/Button3'
import Heading4 from '../components/Heading4'
import ParentInput from '../components/form/ParentInput'

const Main = styled.main`
	padding-top: 4.8rem;
	padding-bottom: 6.4rem;

	/* .bodyPadding fallback */
	padding-left: 2.4rem;
	padding-right: 2.4rem;
`

const StyledButton = styled(Button3)`
	margin: 0 auto;
	margin-top: 3.2rem;
	display: block;
`

const FormEl = styled.div`
	&:not(:last-of-type) {
		margin-bottom: 1.6rem;
	}
`

const StyledParentInput = styled(ParentInput)`
	display: block;
	width: 100%;
	margin-top: 1.2rem;
`

export default () => {
	return (
		<Main className='content'>
			<Heading4 isCenter={true}>Resetuj lozinku</Heading4>
			<form>
				<FormEl>
					<label htmlFor='email'>Email</label>
					<StyledParentInput type='email' name='email' />
				</FormEl>
				<StyledButton>Pošalji instrukcije</StyledButton>
			</form>
		</Main>
	)
}
