import React from 'react'
import styled from 'styled-components'
import MainButton from '../buttons/MainButton'

const StyledTopSection = styled.section`
	min-height: 100vh;
	color: white;
	display: flex;
	justify-content: center;
	position: relative;

	background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
		url('/images/index_image_top.jpg');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
`

const StyledH1Top = styled.h1`
	top: 30%;
	position: absolute;
	text-align: center;
	letter-spacing: 0.15rem;
	font-weight: 600;
	width: 100%;

	span {
		text-transform: uppercase;
		font-size: 6rem;
	}

	p {
		margin-top: 1.6rem;
		font-size: 1.6rem;
	}

	button {
		margin-top: 2.4rem;
	}
`

export default () => {
	return (
		<StyledTopSection>
			<StyledH1Top className='bodyPadding'>
				<span>Krnjevci</span>
				<p>Izvorište profesionalnih video tutorijala za harmoniku</p>
				<MainButton>Tutorijali</MainButton>
			</StyledH1Top>
		</StyledTopSection>
	)
}
