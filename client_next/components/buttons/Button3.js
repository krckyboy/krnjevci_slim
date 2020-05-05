import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
	background-color: #406798;
	color: white;
	border: none;
	padding: 1.6rem 3.2rem;
	text-align: center;
	text-decoration: none;
	font-size: 1.2rem;
	border-radius: 10rem;
	font-weight: 600;
	letter-spacing: 0.1rem;
	display: inline-block;
	box-shadow: 0px 4px 4px rgba(64, 103, 152, 0.2);
`

const Button = (props) => {
	return <StyledButton {...props}>{props.children}</StyledButton>
}

export default Button
