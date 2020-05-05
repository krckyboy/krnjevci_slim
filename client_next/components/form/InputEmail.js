import styled from 'styled-components'
import ParentInput from './ParentInput'

const EmailFormEl = styled.div``

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
		<EmailFormEl>
			<label htmlFor='email'>Email</label>
            <InputContainer>
                <img src="/images/svg/email.svg" alt="Email"/>
				<StyledInput
					type='email'
					name='email'
					id='email'
					placeholder='Unesite vaš e-mail'
				/>
			</InputContainer>
		</EmailFormEl>
	)
}
