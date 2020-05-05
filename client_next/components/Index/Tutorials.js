import React from 'react'
import styled from 'styled-components'
import Button2 from '../buttons/Button2'
import Heading2 from '../Heading2'
import Heading3 from '../Heading3'
import TutorialGridEl from '../TutorialGridEl'

const Section = styled.section`
	padding-top: 8.8rem;
    padding-bottom: 8.8rem;
    
    /* .bodyPadding fallback */
    padding-left: 2.4rem;
    padding-right: 2.4rem; 
` 

export default ({ tutorials }) => {
	return (
		<Section>
			<Heading2>Tutorijali</Heading2>
			<Heading3>Najnoviji tutorijali!</Heading3>
			<div>
				{tutorials.map((t) => (
					<TutorialGridEl
						key={t.id}
						title={t.title}
						price={t.price}
						imgUrl={t.imgUrl}
					/>
				))}
				<Button2>Svi tutorijali</Button2>
			</div>
		</Section>
	)
}
