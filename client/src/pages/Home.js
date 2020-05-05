import React from 'react'
import styled from 'styled-components'
import Tutorials from '../components/Home/Tutorials'
import TopSection from '../components/Home/TopSection'
import { tutorials } from '../fakeData'
import RegisterSection from '../components/Home/RegisterSection'
import AboutUs from '../components/Home/AboutUs'
import Layout from '../components/Layout/Layout'

const Content = styled.main`
	width: 100%;
`

export default () => {
	return (
		<Layout>
			<Content className='content'>
				<TopSection />
				<Tutorials tutorials={[tutorials[0], tutorials[1], tutorials[2]]} />
				<RegisterSection />
				<AboutUs />
			</Content>
		</Layout>
	)
}
