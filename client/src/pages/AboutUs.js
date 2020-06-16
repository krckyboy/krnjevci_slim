import React, { useEffect } from 'react'
import styled from 'styled-components'
import Heading4 from '../components/Heading4'
import Heading5 from '../components/Heading5'
import Layout from '../components/Layout/Layout'

const Main = styled.main`
	padding-top: 4.8rem;
	padding-bottom: 6.4rem;

	/* .bodyPadding fallback */
	padding-left: 2.4rem;
	padding-right: 2.4rem;
`

const Img = styled.img`
	max-width: 100%;
`

const P = styled.p`
	font-size: 1.4rem;
	line-height: 162.7%;
	color: #333333;

	&:not(:last-of-type)::after {
		height: 1px;
		display: block;
		width: 7.2rem;
		background: #406798;
		border-right: 4px white;
		content: '';
		margin-top: 3.2rem;
	}
`

const Article = styled.article`
	&:not(:last-of-type) {
		margin-bottom: 6.4rem;
	}
`

const ONamaArticle = ({ src, alt, h, p }) => (
	<Article>
		<Img src={src} alt={alt} />
		<Heading5>{h}</Heading5>
		<P>{p}</P>
	</Article>
)

export default () => {
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])
	return (
		<Layout>
			<Main className='content'>
				<Heading4>O nama</Heading4>
				<ONamaArticle
					src='/images/mijaKrnjevac.jpg'
					alt='Aleksandar Todorović Krnjevac (1905-1942)'
					h='Aleksandar Todorović Krnjevac (1905-1942)'
					p='Škola harmonike “Krnjevac”, odnosno “Krnjevci”, je izvorište vrhunskih instrumentalista na harmonici sa najdužom tradicijom na našim prostorima. Krnjevci su škola harmonike koja traje preko 100 godina, a započeo ju je Aleksandar Todorović Krnjevac (1905-1942) i ta tradicija i dalje traje, prenosi se sa kolena na koleno.'
				/>
				<ONamaArticle
					src='/images/mijaKrnjevac.jpg'
					alt='Miodrag Todorović Krnjevac'
					h='Miodrag Todorović Krnjevac (1924—1991)'
					p='Škola harmonike “Krnjevac”, odnosno “Krnjevci”, je izvorište vrhunskih instrumentalista na harmonici sa najdužom tradicijom na našim prostorima. Krnjevci su škola harmonike koja traje preko 100 godina, a započeo ju je Aleksandar Todorović Krnjevac (1905-1942) i ta tradicija i dalje traje, prenosi se sa kolena na koleno.'
				/>
				<ONamaArticle
					src='/images/acaKrnjevacCale.jpg'
					alt='Aleksandar Todorović Krnjevac (1946-2017)'
					h='Aleksandar Todorović Krnjevac (1946-2017)'
					p='Škola harmonike “Krnjevac”, odnosno “Krnjevci”, je izvorište vrhunskih instrumentalista na harmonici sa najdužom tradicijom na našim prostorima. Krnjevci su škola harmonike koja traje preko 100 godina, a započeo ju je Aleksandar Todorović Krnjevac (1905-1942) i ta tradicija i dalje traje, prenosi se sa kolena na koleno.'
				/>
				<ONamaArticle
					src='/images/dusanKrnjevac.jpg'
					alt='Dušan Todorović Krnjevac (1991)'
					h='Dušan Todorović Krnjevac (1991)'
					p='Škola harmonike “Krnjevac”, odnosno “Krnjevci”, je izvorište vrhunskih instrumentalista na harmonici sa najdužom tradicijom na našim prostorima. Krnjevci su škola harmonike koja traje preko 100 godina, a započeo ju je Aleksandar Todorović Krnjevac (1905-1942) i ta tradicija i dalje traje, prenosi se sa kolena na koleno.'
				/>
			</Main>
		</Layout>
	)
}
