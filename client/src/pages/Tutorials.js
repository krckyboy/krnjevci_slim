import React from 'react'
import styled from 'styled-components'
import { tutorials } from '../fakeData'
import TutorialGridEl from '../components/TutorialGridEl'
import Pagination from '../components/Pagination'
import Heading4 from '../components/Heading4'
import SearchBar from '../components/SearchBar'
import Layout from '../components/Layout/Layout'

const Main = styled.main`
	padding-top: 4.8rem;
	padding-bottom: 6.4rem;

	/* .bodyPadding fallback */
	padding-left: 2.4rem;
	padding-right: 2.4rem;
`

export default () => {
	return (
		<Layout>
			<Main>
				<Heading4>Tutorijali</Heading4>
				<SearchBar />
				<div>
					{tutorials.map((t) => (
						<TutorialGridEl
							key={t.id}
							title={t.title}
							price={t.price}
							imgUrl={t.imgUrl}
						/>
					))}
				</div>
				<Pagination />
			</Main>
		</Layout>
	)
}
