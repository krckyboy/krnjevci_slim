import styled from 'styled-components'

const StyledPreview = styled.div`
	color: white;
	font-weight: 600;
	font-size: 1.2rem;
	line-height: 1.6rem;
	padding: 0.8rem 1.2rem;
	display: inline-block;
	margin-right: 1.6rem;
	box-shadow: 0px 4px 20px rgba(64, 103, 152, 0.2);
	background-color: #406798;
	position: absolute;
	z-index: 999;
	top: 0;
	transform: translate(-10%, -50%);
	opacity: .7;
`

export default () => <StyledPreview>Pregled</StyledPreview>
