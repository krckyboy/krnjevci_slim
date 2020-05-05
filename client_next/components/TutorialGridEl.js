import React from 'react'
import styled from 'styled-components'

const StyledTutorialElContainer = styled.div`
	color: color;
	display: block;
	font-size: 1.8rem;
	margin-bottom: 3.2rem;
	box-shadow: 0px 4px 4px rgba(64, 103, 152, 0.2);
	border-radius: 1.2rem;
`

const TopPartThumbnailBackground = styled.div`
    background-image: url('${(props) => props.imgUrl}');
    height: 20rem;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    border-top-left-radius: 1.2rem;
    border-top-right-radius: 1.2rem;

    span {
        font-size: 1.3rem;
        right: .8rem;
        top: .8rem;
        border-radius: 1.2rem;
        position: absolute;
        padding: .8rem 1.6rem;
        color: white;
        background-color: ${(props) => (props.price ? '#2F80ED' : '#78B893')}
    }
`

const BottomPartContainer = styled.div`
	background-color: #586474;
	padding: 1.2rem 1.6rem;
	border-bottom-left-radius: 1.2rem;
	border-bottom-right-radius: 1.2rem;

	h4 {
		color: white;
		font-size: 1.4rem;
	}
`

const TutorialEl = (props) => {
	const { imgUrl, title, price, hidePrice } = props
	return (
		<StyledTutorialElContainer>
			<TopPartThumbnailBackground imgUrl={imgUrl} price={price}>
				{!hidePrice && <span>{price ? price : 'besplatno'}</span>}
			</TopPartThumbnailBackground>
			<BottomPartContainer>
				<h4>{title}</h4>
			</BottomPartContainer>
		</StyledTutorialElContainer>
	)
}

export default TutorialEl
