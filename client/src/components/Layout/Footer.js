import React from 'react'
import styled from 'styled-components'

const StyledFooter = styled.footer`
	background-color: white;
	padding: 2.4rem;
	text-align: center;
	font-size: 1.2rem;
`

const P = styled.p`
	margin-top: 0.8rem;
`

const SocialIconsContainer = styled.div`
	margin-top: 1.6rem;
	margin-bottom: 0.8rem;
	display: flex;
	justify-content: center;

	img {
		margin-left: 0.8rem;
		margin-right: 0.8rem;
		height: 3rem;
	}
`

export default () => {
	return (
		<StyledFooter className='footer'>
			<p>
				© 2020{' '}
				<a href='https://krcky.dev/' target='_blank' rel='noopener noreferrer'>
					<strong>Dušan Todorović Krnjevac</strong>
				</a>{' '}
			</p>
			<P>Sva prava zadržana</P>
			<SocialIconsContainer>
				<img src='/images/svg/facebook.svg' alt='Facebook' />
				<img src='/images/svg/instagram.svg' alt='Instagram' />
				<img src='/images/svg/youtube.svg' alt='youtube' />
			</SocialIconsContainer>
		</StyledFooter>
	)
}
