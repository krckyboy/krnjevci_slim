import React from 'react'
import styled from 'styled-components'
import Button2 from '../buttons/Button2'
import Heading2 from '../Heading2'
import Vimeo from '@u-wave/react-vimeo'

const Section = styled.section`
	padding-top: 8.8rem;
	padding-bottom: 6.4rem;
`

const P = styled.p`
	font-size: 1.4rem;
	line-height: 162.7%;
	/* padding-bottom: 1.6rem; */
	color: #333333;
	line-height: 162.7%;
	margin-bottom: 3.2rem;
`

const Video = styled.iframe`
	max-width: 100%;
	border: none;
`

const Button = styled(Button2)`
	margin-top: 3.2rem;
`

const BodyPadding = styled.div`
	/* .bodyPadding fallback */
	padding-left: 2.4rem;
	padding-right: 2.4rem;
`

const Img = styled.img`
	max-width: 100%;
	margin-bottom: 3.2rem;
`

// These styles are necessary because of Vimeo blank space bug in mobile viewport.
const StyledVideo = styled(Vimeo)`
	position: relative;
	display: block;
	/* width: 300px; */ /* This was initially from SO*/
	width: 100%;
	overflow: hidden;
	margin-top: ${(props) => props.displayingPreview && '3.2rem'};

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

export default () => {
	return (
		<Section>
			<Heading2>O nama</Heading2>
			{ /*
				<Img src={'/images/index_register_background.jpg'} />
			*/ }
			<BodyPadding>
				<P>
					Škola harmonike “Krnjevac”, odnosno “Krnjevci”, je izvorište vrhunskih
					instrumentalista na harmonici sa najdužom tradicijom na našim
					prostorima. Krnjevci su škola harmonike koja traje preko 100 godina, a
					započeo ju je Aleksandar Todorović Krnjevac (1905-1942) i ta tradicija
					i dalje traje, prenosi se sa kolena na koleno.{' '}
				</P>
				<P>
					Najupečatljiviji trag iz muzičke dinastije “Krnjevac”, osim
					izvanrednih učenika poput Milana Jovanovića Jabučanca, Siniše
					Tufegdžića i drugih jeste uvođenje šestog reda na dugmetarskoj
					harmonici po kojoj gotovo svi harmonikaši narodne muzike ovih prostora
					sviraju, kao i jasno utemeljen prstored, odnosno način sviranja,
					harmonikašima poznat kao <strong>“krnjevački prstored”</strong>.
				</P>
				<P>
					Kako smo odavno ušli u tehnološka doba, tako se i mi prilagođavamo
					kroz ovu platformu gde je sve dostupno kroz video tutorijale. Na ovoj
					platformi su video uputstva za sve vrste kompozicija i naša baza istih
					se svakodnevno dopunjuje. Prilagođeno je kako početnicima, tako i
					iskusnijim harmonikašima. Primer jednog video tutorijala možete
					pogledati ispod.
				</P>
				{/*
					<Video
						width='560'
						height='215'
						src='https://www.youtube.com/embed/ANEjSXGZ5A4'
						frameborder='0'
						allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
						allowfullscreen
					></Video>
				*/}
				<StyledVideo video={'https://vimeo.com/408197065'} />
				<Button>Detaljnije</Button>
			</BodyPadding>
		</Section>
	)
}
