import styled from 'styled-components'
import { tutorials } from '../fakeData'
import TutorialGridEl from '../components/TutorialGridEl'
import Pagination from '../components/Pagination'
import Heading4 from '../components/Heading4'
import SearchBar from '../components/SearchBar'

const Main = styled.main`
	padding-top: 4.8rem;
	padding-bottom: 6.4rem;

	/* .bodyPadding fallback */
	padding-left: 2.4rem;
	padding-right: 2.4rem;
`

export default ({ tutorials }) => {
	return (
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
						hidePrice={true}
					/>
				))}
			</div>
			<Pagination />
		</Main>
	)
}

// This is basically the method where you'd fetch data.
export async function getStaticProps(context) {
	// Fetch latest 3 tutorials

	return {
		props: {
			tutorials,
		}, // will be passed to the page component as props
	}
}
