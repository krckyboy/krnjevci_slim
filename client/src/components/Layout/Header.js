import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useState, useEffect } from 'react'

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

const StyledLink = styled(NavLink)`
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

export default () => {
	const [isOpen, toggleOpen] = useState(false)

	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : 'initial'
	}, [isOpen])

	function handleClick() {
		toggleOpen(!isOpen)
	}

	const location = useLocation()

	return (
		<StyledHeader
			className='bodyPadding'
			isIndex={location.pathname === '/'}
			isOpen={isOpen}
		>
			{isOpen && (
				<StyledNav isIndex={location.pathname === '/'} isOpen={isOpen}>
					<StyledNavUl>
						<StyledLi>
							<StyledLink to='/' activeClassName='active' onClick={handleClick} exact>
								Početna
							</StyledLink>
						</StyledLi>
						<StyledLi>
							<StyledLink to='/o_nama' activeClassName='active' exact>
								O nama
							</StyledLink>
						</StyledLi>
						<StyledLi>
							<StyledLink to='/tutorijali' activeClassName='active' exact>
								Tutorijali
							</StyledLink>
						</StyledLi>
						<StyledLi>
							<StyledLink to='/uloguj_se' activeClassName='active' exact>
								Ulogujte se
							</StyledLink>
						</StyledLi>
						<StyledLi>
							<StyledLink to='/registruj_se' activeClassName='active' exact>
								Registracija
							</StyledLink>
						</StyledLi>
						<StyledLi>
							<StyledLink to='/korpa' activeClassName='active' exact>
								Korpa
							</StyledLink>
						</StyledLi>
						<StyledLi>
							<StyledLink to='/moji_tutorijali' activeClassName='active' exact>
								Moji tutorijali
							</StyledLink>
						</StyledLi>
						<StyledLi>
							<StyledLink to='/dev_shortcut_routes' activeClassName='active' exact>
								[Dev] Routes
							</StyledLink>
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
