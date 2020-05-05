import React from 'react'
import styled from 'styled-components'
import Tutorial from '../components/tutorial/Tutorial'
import Layout from '../components/Layout/Layout'

const Main = styled.main`
	padding-top: 4.8rem;
	padding-bottom: 6.4rem;

	/* .bodyPadding fallback */
	padding-left: 2.4rem;
	padding-right: 2.4rem;
`

export default ({
	price = 1000,
	previewUrl = 'https://vimeo.com/3155182',
	videoUrl = 'https://vimeo.com/408197065',
	bought = true,
	duration = '30',
	description = 'Autor ove kompozicije je Aleksandar Todorović Krnjevac.',
}) => {
	return (
		<Layout>
			<Main className='content'>
				{/* Premium / Bought */}
				{/*
				<Tutorial
					price={price}
					bought={bought}
					description={description}
					previewUrl={previewUrl}
					videoUrl={videoUrl}
				/>
			*/}

				{/* Premium / not bought */}
				{/*
				<Tutorial
					price={2000}
					bought={false}
					description={description}
					previewUrl={previewUrl}
					videoUrl={videoUrl}
				/>
			*/}

				{/* Free / not bought */}
				{/*
			<Tutorial
				price={0}
				bought={false}
				description={description}
				previewUrl={previewUrl}
				videoUrl={videoUrl}
			/>
			*/}

				{/* Free / bought */}
				{/*
				<Tutorial
					price={0}
					bought={true}
					description={description}
					previewUrl={previewUrl}
					videoUrl={videoUrl}
				/>
			*/}

				{/* Tutorial as admin */}
				{
					<Tutorial
						price={0}
						bought={true}
						description={description}
						previewUrl={previewUrl}
						videoUrl={videoUrl}
						admin={true} // Mimic auth
					/>
				}
			</Main>
		</Layout>
	)
}
