import styled from 'styled-components'

const StyledPremium = styled.div`
	color: white;
	font-weight: 600;
	font-size: 1.2rem;
	line-height: 1.6rem;
	padding: 0.8rem 1.2rem;
	display: inline-block;
	margin-right: 1.6rem;
	box-shadow: 0px 4px 20px rgba(64, 103, 152, 0.2);
	background-color: ${(props) => (props.price > 0 ? '#406798' : '#47AF6A')};
`

export default ({ price }) => (
	<StyledPremium price={price}>
		{price > 0 ? 'Premijum' : 'Besplatno'}
	</StyledPremium>
)