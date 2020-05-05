import React from 'react'
import styled from 'styled-components'
import Button3 from '../components/buttons/Button3'
import Heading4 from '../components/Heading4'
import Heading3 from '../components/Heading3'
import { demoTutorials } from '../fakeData'
import { loadStripe } from '@stripe/stripe-js'
import {
	Elements,
	CardElement,
	useStripe,
	useElements,
} from '@stripe/react-stripe-js'
import axios from 'axios'
import {Link} from 'react-router-dom'

const Main = styled.main`
	padding-top: 4.8rem;
	padding-bottom: 6.4rem;

	/* .bodyPadding fallback */
	padding-left: 2.4rem;
	padding-right: 2.4rem;
`

const StyledButton = styled(Button3)`
	margin: 0 auto;
	margin-top: 3.2rem;
	display: block;
`

const ArticleContainer = styled.div`
	color: #333333;

	max-height: 18rem;
	overflow: auto;
	padding-right: 0.8rem;

	.item {
		.top {
			display: flex;
			justify-content: space-between;
			align-items: baseline;

			div {
				display: flex;
				align-items: center;

				img {
					margin-left: 4px;
				}
			}
		}

		a,
		span {
			font-size: 1.4rem;
			line-height: 162.7%;
		}

		a {
			text-decoration: none;
			padding-right: 2rem;
			font-weight: 600;
			color: #406798;
		}

		.description {
			margin-top: 0.8rem;
			font-style: italic;
			font-weight: normal;
			font-size: 1.2rem;
			line-height: 18px;
			color: #848484;
		}

		:not(:last-of-type)::after {
			height: 1px;
			display: block;
			width: 100%;
			background: #d5d5d5;
			border-right: 4px white;
			content: '';
			margin-top: 1.6rem;
		}

		&:not(:first-of-type) {
			margin-top: 1.6rem;
		}
	}
`

const ResetCart = styled.a`
	display: block;
	margin-top: 1.6rem;
	font-weight: 600;
	font-size: 1.4rem;
	font-weight: normal;
	text-decoration: underline;
	color: #333333;
	font-style: italic;
`

const ClearTotalContainer = styled.div`
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	font-weight: 600;
	font-size: 1.4rem;
	font-weight: normal;
	color: #333333;
`

const StripeForm = styled.form`
	/* max-width: 400px; */
	margin: 0 auto;
`

const CheckoutForm = () => {
	const stripe = useStripe()
	const elements = useElements()

	const handleSubmit = async (e) => {
		e.preventDefault()

		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: 'card',
			card: elements.getElement(CardElement),
		})

		if (!error) {
			// Fetch the ID of payment to send to BE
			const { id } = paymentMethod

			try {
				const { data } = await axios.post('/api/test_charge', {
					id,
					amount: 1099, // You will fetch that in BE, not here
				})
				console.log(data)
			} catch (error) {
				console.error(error)
			}
		}
	}

	return (
		<StripeForm onSubmit={handleSubmit}>
			<CardElement />
			<button type='submit' disabled={!stripe}>
				Pay
			</button>
		</StripeForm>
	)
}

const stripePromise = loadStripe('pk_test_E6KdYE9qvGgpWhUVSO4QhsJ000EIKyzjGe')

const StripeEl = () => {
	return (
		<Elements stripe={stripePromise}>
			<CheckoutForm />
		</Elements>
	)
}

export default () => {
	return (
		<Main className='content'>
			<Heading4 isCenter={true}>Korpa</Heading4>
			<Heading3 style={{ marginBottom: '3.2rem' }}>Pregled artikala</Heading3>
			<ArticleContainer>
				{demoTutorials.map((t) => (
					<div className='item' key={t.id}>
						<div className='top'>
							<Link>{t.title}</Link>
							<div>
								<span>{t.price}RSD</span>
								<img src='/images/svg/delete.svg' alt='Delete' />
							</div>
						</div>
						{t.description && <p className='description'>{t.description}</p>}
					</div>
				))}
			</ArticleContainer>
			<ClearTotalContainer>
				<ResetCart href='#' className='resetCart'>
					Isprazni korpu
				</ResetCart>
				<div>
					<span>Ukupno: 3500RSD</span>
				</div>
			</ClearTotalContainer>
			<StyledButton>Plati</StyledButton>
			<StripeEl />
		</Main>
	)
}
