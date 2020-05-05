import styled from 'styled-components'
import Tutorials from '../components/Index/Tutorials'
import TopSection from '../components/Index/TopSection'
import { tutorials } from '../fakeData'
import RegisterSection from '../components/Index/RegisterSection'
import AboutUs from '../components/Index/AboutUs'

const Content = styled.main`
	width: 100%;
`

export default ({ tutorials }) => {
	return (
		<Content className='content'>
			<TopSection />
			<Tutorials tutorials={[tutorials[0], tutorials[1], tutorials[2]]} />
			<RegisterSection />
			<AboutUs />
		</Content>
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
