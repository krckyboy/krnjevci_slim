import styled from 'styled-components'

const StyledInput = styled.input`
	background-color: #d2dfe7;
	padding: 1rem 1.6rem;
	border-radius: 0.4rem;
	outline: none;
    border: transparent 2px solid;
    color: #406798 !important;

	:focus {
        border: 2px solid #406798;
        outline: none;
	}

	::placeholder {
		color: #8aabd4;
		font-size: 1.3rem;
		letter-spacing: 162%;
	}
`

export default (props) => {
	return <StyledInput {...props} />
}
