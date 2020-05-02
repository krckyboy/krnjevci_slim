import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
	background-color: transparent;
	color: #406798;
	border: 2px solid #406798;
	padding: 1.6rem 3.2rem;
	text-align: center;
	text-decoration: none;
	font-size: 1.2rem;
	border-radius: 10rem;
	font-weight: 600;
	letter-spacing: 0.1rem;
	display: block;
	margin: 0 auto;
	box-shadow: 0px 4px 4px rgba(64, 103, 152, 0.2);
`

const Button = (props) => {
	return <StyledButton {...props}>{props.children}</StyledButton>
}

export default Button
