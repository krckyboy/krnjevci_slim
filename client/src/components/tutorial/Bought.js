import React from 'react'
import styled from 'styled-components'

const BoughtContainer = styled.div`
	display: inline-flex;
	align-items: center;

	span {
		margin-left: 0.4rem;
		color: #47af6a;
	}
`

export default () => (
	<BoughtContainer>
		<img src='/images/svg/boughtIcon.svg' alt='Bought' />
		<span>kupljeno</span>
	</BoughtContainer>
)
