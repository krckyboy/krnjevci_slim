import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
	background-color: #475993;
	color: white;
	border: none;
	padding: 1.2rem 2.4rem;
	text-align: center;
	text-decoration: none;
	font-size: 1.6rem;
	border-radius: 10rem;
	font-weight: 600;
	letter-spacing: 0.15rem;
	display: inline-block;
    box-shadow: 0px 4px 4px rgba(64, 103, 152, 0.2);
    display: flex;
    align-items: center;
    margin: 0 auto;

    img {
        margin-right: .8rem;
    }
`

const Button = (props) => {
	return (
		<StyledButton {...props}>
			<img src='/images/svg/facebookButtonIcon.svg' alt='Facebook' />
            <span>Facebook</span>
		</StyledButton>
	)
}

export default Button
