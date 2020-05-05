import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import Layout from '../components/Layout/Layout'

const Main = styled.main`
	padding-top: 4.8rem;
	padding-bottom: 6.4rem;

	/* .bodyPadding fallback */
	padding-left: 2.4rem;
	padding-right: 2.4rem;
`

const Ul = styled.ul`
	display: flex;
	flex-direction: column;
`

const StyledLink = styled(NavLink)`
	font-weight: 600;
	margin: 0.5rem;
	cursor: pointer;
	font-size: 1.8rem;
`

export default () => {
	return (
		<Layout>
			<Main className='content'>
				<Ul>
					<StyledLink to='/asd'>404</StyledLink>
					<StyledLink to='/moj_nalog'>Moj nalog</StyledLink>
					<StyledLink to='/istorija_kupovine'>Istorija kupovine</StyledLink>
					<StyledLink to='dev/dodaj_tutorijal'>Dodaj tutorijal</StyledLink>
					<StyledLink to='dev/izmeni_tutorijal'>Izmeni tutorijal</StyledLink>
					<StyledLink to='/tutorijal'>Tutorijal</StyledLink>
					<StyledLink to='/resetuj_lozinku'>Resetuj lozinku</StyledLink>
				</Ul>
			</Main>
		</Layout>
	)
}
