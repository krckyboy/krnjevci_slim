import styled from 'styled-components'
import React from 'react'

const SearchBarContainer = styled.div`
	margin-bottom: 3.2rem;
	background-color: white;
	padding: 1.6rem;
	/* display: flex; */
	font-size: 1.4rem;
	border-radius: 1.2rem;
`

const SearchIcon = styled.img`
	margin-right: 0.8rem;
`

const InputElementsContainer = styled.div`
	display: flex;
	max-width: 100%;
`

const Input = styled.input`
	height: 100%;
	width: 100%;
	outline: none;
	border: none;

	&:focus {
		outline: none;
	}
`

const FiltersContainer = styled.div`
	margin-bottom: 1.2rem;
	display: flex;

	span {
		font-weight: bold;
		font-size: 1.4rem;
		line-height: 1.9rem;
		margin-right: 0.4rem;
	}
`

/*
<FiltersContainer>
    <span>Najnovije</span>
    <img src={'/images/svg/arrowDown.svg'} alt='Sort by' />
</FiltersContainer>
*/

export default () => (
	<SearchBarContainer>
		<InputElementsContainer>
			<SearchIcon src={'/images/svg/searchIcon.svg'} alt='Search' />
			<Input type='text' placeholder='Pretraži tutorijale' />
		</InputElementsContainer>
	</SearchBarContainer>
)
