import React from 'react'
import styled from 'styled-components'

// O nama article heading (Aleksandar Todorovic Krnjevac)

const StyledHeading = styled.h1`
	color: #406798;
	text-align: left;
	display: block;
	font-size: 2rem;
	font-weight: 700;
	letter-spacing: 0.1rem;
	margin-bottom: 2.4rem;
	margin-top: 2.4rem;
`

const Heading4 = ({ children }) => {
	return <StyledHeading>{children}</StyledHeading>
}

export default Heading4
