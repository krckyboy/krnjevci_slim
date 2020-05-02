import styled from 'styled-components'
import ParentInput from './ParentInput'

const PasswordFormEl = styled.div``

const StyledInput = styled(ParentInput)`
	width: 100%;
	padding-left: 4.8rem;
`

const InputContainer = styled.div`
	position: relative;

	img {
		position: absolute;
		top: 50%;
		left: 1.8rem;
		transform: translateY(-50%);
	}
`

export default () => {
	return (
		<PasswordFormEl>
			<label htmlFor='password'>Lozinka</label>
			<InputContainer>
				<img src='/images/svg/lock.svg' alt='Email' />
				<StyledInput
					type='password'
					name='password'
					id='password'
					placeholder='Unesite vašu lozinku'
				/>
			</InputContainer>
		</PasswordFormEl>
	)
}
