import Link from '../ActiveLink'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { withRouter } from 'next/router'

const StyledHeader = styled.header`
	min-height: 5.6rem;
	display: flex;
	align-content: end;
	position: ${(props) => (props.isIndex ? 'fixed' : 'sticky')};
	top: 0;
	width: 100%;
	z-index: 99999;

	background-color: ${(props) =>
		props.isIndex ? 'rgba(0,0,0, 0.7)' : 'white'};
	background-color: ${(props) => props.isOpen && 'white'};
`

const ToggleHamburger = styled.img`
	display: block;
	align-self: center;
	justify-self: end;
	margin-left: auto;
	height: 3.2rem;
	/* @media only screen and ${device.mobileL} and (orientation: landscape) {
		display: none;
	}
	@media ${device.tablet} {
		display: none;
	} */
`

const StyledNav = styled.nav`
	position: absolute;
	top: 99%;
	left: 0;
	display: flex;
	width: 100%;
	padding-bottom: 2.4rem;

	color: ${(props) => props.isIndex && '#66A6F6'};
	background-color: ${(props) =>
		props.isIndex ? 'rgba(0,0,0, 0.7)' : 'white'};
	background-color: ${(props) => props.isOpen && 'white'};
	box-shadow: 0px 4px 4px rgba(64, 103, 152, 0.2);
`

const StyledNavUl = styled.ul`
	display: flex;
	flex-direction: column;
	margin: 0 auto;
`

const StyledLink = styled.a`
	font-weight: 600;
	margin: 0.5rem;
	text-decoration: none;
	cursor: pointer;
	font-size: 1.5rem;
	z-index: 99999;
`

const StyledLi = styled.li`
	&:not(:first-child) {
		margin-top: 1.3rem;
	}
`

const Header = ({ router }) => {
	const [isOpen, toggleOpen] = useState(false)

	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : 'initial'
	}, [isOpen])

	function handleClick() {
		toggleOpen(!isOpen)
	}

	return (
		<StyledHeader
			className='bodyPadding'
			isIndex={router.pathname === '/'}
			isOpen={isOpen}
		>
			{isOpen && (
				<StyledNav isIndex={router.pathname === '/'} isOpen={isOpen}>
					<StyledNavUl>
						<StyledLi>
							<Link href='/'>
								<StyledLink onClick={handleClick}>Početna</StyledLink>
							</Link>
						</StyledLi>
						<StyledLi>
							<Link href='/o_nama'>
								<StyledLink onClick={handleClick}>O nama</StyledLink>
							</Link>
						</StyledLi>
						<StyledLi>
							<Link href='/tutorijali'>
								<StyledLink onClick={handleClick}>Tutorijali</StyledLink>
							</Link> 
						</StyledLi>
						<StyledLi>
							<Link href='/uloguj_se'>
								<StyledLink onClick={handleClick}>Ulogujte se</StyledLink>
							</Link>
						</StyledLi>
						<StyledLi>
							<Link href='/registruj_se'>
								<StyledLink onClick={handleClick}>Registracija</StyledLink>
							</Link>
						</StyledLi>
						<StyledLi>
							<Link href='/korpa'>
								<StyledLink onClick={handleClick}>Korpa</StyledLink>
							</Link>
						</StyledLi>
						<StyledLi>
							<Link href='/moji_tutorijali'>
								<StyledLink onClick={handleClick}>Moji tutorijali</StyledLink>
							</Link>
						</StyledLi>
						<StyledLi>
							<Link href='/dev_shortcut_routes'>
								<StyledLink onClick={handleClick}>[Dev] Routes</StyledLink>
							</Link>
						</StyledLi>
					</StyledNavUl>
				</StyledNav>
			)}

			{!isOpen && (
				<ToggleHamburger
					src={'/images/svg/hamburger.svg'}
					onClick={handleClick}
					alt='Open navigation'
				/>
			)}

			{isOpen && (
				<ToggleHamburger
					src={'/images/svg/x.svg'}
					onClick={handleClick}
					alt='Close navigation'
				/>
			)}
		</StyledHeader>
	)
}

export default withRouter(Header)
