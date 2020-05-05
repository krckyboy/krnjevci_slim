import React from 'react'
import styled from 'styled-components'

const StyledHeading = styled.h2`
	color: #406798;
	text-align: left;
	display: block;
	font-size: 1.8rem;
	font-weight: 700;
	letter-spacing: 0.1rem;
	margin-top: 3.2rem;
	margin-bottom: 2.4rem;

	&::after {
		height: 5px;
		display: block;
		width: 7.2rem;
		background: #406798;
		border-right: 4px white;
		content: '';
		margin-top: 0.4rem;
		border-radius: 4rem;
	}
`

const Heading2 = ({ children, style }) => {
	return <StyledHeading style={style}>{children}</StyledHeading>
}

export default Heading2
