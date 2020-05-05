import React from 'react'
import styled from 'styled-components'

// Page title (tutorijali, about us, tutorial title, etc.)

const StyledHeading = styled.h1`
	color: #132741;
	text-align: ${(props) => (props.isCenter ? 'center' : 'left')};
	display: block;
	font-size: 3.2rem;
	font-weight: 700;
	letter-spacing: 0.1rem;
	margin-bottom: 4.8rem;
`

const Heading4 = ({ children, isCenter, style }) => {
	return (
		<StyledHeading style={style} isCenter={isCenter}>
			{children}
		</StyledHeading>
	)
}

export default Heading4
