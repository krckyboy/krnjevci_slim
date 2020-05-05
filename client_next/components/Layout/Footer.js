import styled from 'styled-components'

const StyledFooter = styled.footer`
	background-color: white;
	padding: 2.4rem;
	text-align: center;
	font-size: 1.2rem;
`

const P = styled.p`
	margin-top: .8rem;
`

const SocialIconsContainer = styled.div`
	margin-top: 1.6rem;
	margin-bottom: .8rem;
	display: flex;
	justify-content: center;

	img {
		margin-left: .8rem;
		margin-right: .8rem;
		height: 3rem;
	}
`

export default () => {
	return (
		<StyledFooter className='footer'>
			<p>
				© 2020{' '}
				<a href='https://krcky.dev/' target='_blank'>
					<strong>Dušan Todorović Krnjevac (Krcky)</strong>
				</a>{' '}
			</p>
			<P>Sva prava zadržana</P>
			<SocialIconsContainer>
				<img src="/images/svg/facebook.svg" alt="Facebook"/>
				<img src="/images/svg/instagram.svg" alt="Instagram"/>
				<img src="/images/svg/youtube.svg" alt="youtube"/>
			</SocialIconsContainer>
		</StyledFooter>
	)
}
