import React from 'react'
import styled from 'styled-components'

const StyledTextArea = styled.textarea`
	background-color: #d2dfe7;
	padding: 1.2rem 1.6rem;
	border-radius: 0.4rem;
	outline: none;
	border: transparent 2px solid;
	color: #406798 !important;
	resize: none;

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
	return <StyledTextArea {...props} />
}
