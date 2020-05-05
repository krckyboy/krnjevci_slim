import React from 'react'
import styled from 'styled-components'
import Button3 from '../buttons/Button3'
// import heading for register section

const Section = styled.section`
	padding-top: 8.8rem;
    padding-bottom: 8.8rem;

    /* .bodyPadding fallback */
    padding-left: 2.4rem;
    padding-right: 2.4rem; 

	background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
		url('/images/index_register_background.jpg');
	background-size: cover;
	background-position: left;
    background-repeat: no-repeat;
`

const Heading = styled.h3`
	font-weight: 600;
	font-size: 2.4rem;
	line-height: 3.3rem;

	margin-bottom: 3.2rem;
`

const P = styled.p`
	font-size: 1.4rem;
    line-height: 162.7%;
    padding-bottom: 1.6rem;
    color: #333333;
    line-height: 162.7%;

    &::after {
		height: 1px;
		display: block;
		width: 7.2rem;
		background: #406798;
		border-right: 4px white;
		content: '';
		margin-top: 3.2rem;
	}
`

const ContentContainer = styled.div`
	background-color: white;
    padding: 5.6rem 3.2rem;
    border-radius: 1.2rem;
`

export default () => {
	return (
		<Section>
			<ContentContainer>
				<Heading>Bogat sadržaj</Heading>
				<P>
					Na raspolaganju Vam je širok asortiman video tutorijala nakon što se
					registrujete a pristojan broj istih je besplatne prirode, tako da
					nemate šta da izgubite. Uverite se u naš kvalitet!
                </P>
                <Button3>Registruj se</Button3>
			</ContentContainer>
		</Section>
	)
}
