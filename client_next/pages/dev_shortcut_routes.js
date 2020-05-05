import styled from 'styled-components'
import Link from 'next/link'

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

const StyledLink = styled.a`
	font-weight: 600;
	margin: 0.5rem;
	cursor: pointer;
	font-size: 1.8rem;
`

export default () => {
	return (
		<Main className='content'>
			<Ul>
				<Link href='/asd'>
					<StyledLink>404</StyledLink>
				</Link>
				<Link href='/moj_nalog'>
					<StyledLink>Moj nalog</StyledLink>
				</Link>
				<Link href='/istorija_kupovine'>
					<StyledLink>Istorija kupovine</StyledLink>
				</Link>
				<Link href='dev/dodaj_tutorijal'>
					<StyledLink>Dodaj tutorijal</StyledLink>
				</Link>
				<Link href='dev/napravi_paket_tutorijala'>
					<StyledLink>Napravi paket tutorijala</StyledLink>
				</Link>
				<Link href='dev/izmeni_tutorijal'>
					<StyledLink>Izmeni tutorijal</StyledLink>
				</Link>
				<Link href='/tutorijal'>
					<StyledLink>Tutorijal</StyledLink>
				</Link>
				<Link href='/resetuj_lozinku'>
					<StyledLink>Resetuj lozinku</StyledLink> 
				</Link>
			</Ul>
		</Main>
	)
}
