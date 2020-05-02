import React from 'react'
import styled from 'styled-components'

const StyledElement = styled.div`
	border-radius: 1.2rem;
	display: inline-block;
	padding: 1rem 1.6rem;
	background-color: #406798;
`

const StyledNumber = styled(StyledElement)`
	background-color: ${(props) => (props.isActive ? '#406798' : '#E0E0E0')};
	color: ${(props) => (props.isActive ? 'white' : '#828282')};
	font-size: 1.4rem;
`

const PaginationNumElement = ({ num, isActive }) => {
	return <StyledNumber isActive={isActive}>{num}</StyledNumber>
}

const PaginationContainer = styled.div`
	text-align: center;
	display: flex;
	justify-content: center;

	& > *:not(:last-child) {
		margin-right: 0.8rem;
	}

	span {
		color: #828282;
		font-weight: bold;
		font-size: 1.8rem;
	}
`

export default () => {
	return (
		<PaginationContainer>
			<PaginationNumElement num={1} isActive={true} />
			<PaginationNumElement num={2} />
			<span>...</span>
			<PaginationNumElement num={10} />
			<StyledElement>
				<img src={'/images/svg/arrowRight.svg'} alt='Next' />
			</StyledElement>
		</PaginationContainer>
	)
}
