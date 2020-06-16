import React from 'react'
import Heading4 from '../Heading4'
import Bought from './Bought'
import PremiumSign from './PremiumOrNot'
import PreviewSign from './PreviewSign'
import Vimeo from '@u-wave/react-vimeo'
import styled from 'styled-components'
import Button3 from '../buttons/Button3'
import { useState } from 'react'

const MetaContainer = styled.div`
	margin-bottom: 2.4rem;

	span {
		font-weight: bold;
		font-size: 1.2rem;
		line-height: 1.6rem;
		margin-right: 1.6rem;
	}
`

const TopMeta = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 1.6rem;
`

const Price = styled.span`
	color: #586474;
`

// These styles are necessary because of Vimeo blank space bug in mobile viewport.
const StyledVideo = styled(Vimeo)`
	position: relative;
	display: block;
	/* width: 300px; */ /* This was initially from SO*/
	width: 100%;
	overflow: hidden;
	margin-top: ${(props) => props.marginTop && '3.2rem'};

	iframe {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}

	&::before {
		display: block;
		content: '';
		padding-top: 56.25%;
	}
`

const VideoContainer = styled.div`
	position: relative;
`

const Description = styled.p`
	font-size: 1.4rem;
	line-height: 1.9rem;
	color: #406798;
	font-weight: 600;
	font-style: italic;

	/* margin-top: 2.4rem; */
`

const StyledButton = styled(Button3)`
	margin: 0 auto;
	display: block;
	margin-top: 2.4rem;
`

const PreviewTutorialSwitcherContainer = styled.div`
	border-bottom: 1px solid #e0e0e0;
	width: 100%;

	::after {
		height: 1px;
		display: block;
		width: 100%;
		background: #e0e0e0;
		border-right: 4px white;
		content: '';
		/* margin-top: 8px; */
	}

	li {
		font-weight: bold;
		font-size: 1.2rem;
		margin-right: 1.6rem;
		color: #828282;
		padding: 0 1.2rem;

		&.active {
			color: #406798;
			padding-bottom: 8px;
			border-bottom: 4px solid #406798;
		}
	}
`

// isAdmin is just mimicking
export default ({
	price,
	bought,
	previewUrl,
	videoUrl,
	description,
	admin,
}) => {
	const isAdmin = admin // Mimicking
	const displayingPreview = previewUrl && !bought && !isAdmin

	const [watchPreview, togglePreview] = useState(true)
	const addToCart = !bought && !isAdmin

	return (
		<div>
			<MetaContainer>
				<TopMeta>
					<PremiumSign price={price} />
					{price > 0 && <Price>{price} RSD</Price>}
					{bought && !isAdmin && <Bought />}
				</TopMeta>
				<Heading4 style={{ marginBottom: '1.2rem', fontSize: '2.4rem' }}>
					Kalemegdansko kolo
				</Heading4>
				{<Description>{description}</Description>}
			</MetaContainer>
			{isAdmin && (
				<PreviewTutorialSwitcherContainer>
					<ul>
						<li
							className={watchPreview ? 'active' : ''}
							onClick={() => togglePreview(true)}
						>
							Pregled
						</li>
						<li
							className={!watchPreview ? 'active' : ''}
							onClick={() => togglePreview(false)}
						>
							Tutorijal
						</li>
					</ul>
				</PreviewTutorialSwitcherContainer>
			)}
			<VideoContainer>
				{!isAdmin ? (
					displayingPreview ? (
						<>
							<PreviewSign />
							<StyledVideo video={previewUrl} marginTop={true} />
						</>
					) : (
						<StyledVideo video={videoUrl} />
					)
				) : watchPreview ? (
					<>
						<PreviewSign />
						<StyledVideo video={previewUrl} marginTop={true} />
					</>
				) : (
					<StyledVideo video={videoUrl} marginTop={true} />
				)}
			</VideoContainer>
			{addToCart && <StyledButton>Dodaj u korpu</StyledButton>}
			{isAdmin && <StyledButton>Izmeni</StyledButton>}
		</div>
	)
}
