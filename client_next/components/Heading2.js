import React from 'react'
import styled from 'styled-components'

const StyledHeading = styled.h2`
	color: #406798; 
	text-align: center;
	display: block;
	font-size: 3.2rem;
    font-weight: 700;
	letter-spacing: .3rem;
	margin-bottom: 2.4rem;
	text-transform: uppercase;
`

const Heading2 = ({children}) => {
	return <StyledHeading>{children}</StyledHeading>
}

export default Heading2
