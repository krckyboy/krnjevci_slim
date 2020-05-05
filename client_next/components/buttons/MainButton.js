import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
	background-color: #219653; /* Green */
	border: none;
	color: white;
	padding: 1.5rem 6.4rem;
	text-align: center;
	text-decoration: none;
	display: inline-block;
	font-size: 1.8rem;
	border-radius: 10rem;
	font-weight: 600;
	letter-spacing: 0.15rem;
	box-shadow: 0px 4px 4px rgba(64, 103, 152, 0.2);
`

const Button = (props) => {
	return <StyledButton {...props}>{props.children}</StyledButton>
}

export default Button
