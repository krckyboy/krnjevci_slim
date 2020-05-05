import styled from 'styled-components'
import Button3 from '../../components/buttons/Button3'
import Heading4 from '../../components/Heading4'
import Heading3 from '../../components/Heading3'
import ParentInput from '../../components/form/ParentInput'
import TextArea from '../../components/form/TextArea'
import SearchBar from '../../components/SearchBar'
import { demoTutorials } from '../../fakeData'

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

const FormEl = styled.div`
	&:not(:last-of-type) {
		margin-bottom: 1.6rem;
	}

	/* &:not(:last-of-type)::after {
		height: 1px;
		display: block;
		width: 100%;
		background: #406798;
		border-right: 4px white;
		content: '';
		margin-top: 1.6rem;
	} */
`

const StyledParentInput = styled(ParentInput)`
	display: block;
	width: 100%;
	margin-top: 1.2rem;
`

const StyledTextArea = styled(TextArea)`
	display: block;
	width: 100%;
	margin-top: 1.2rem;
`

const ArticleContainer = styled.div`
	color: #333333;
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

export default () => {
	return (
		<Main className='content'>
			<Heading4 isCenter={true}>Napravi paket tutorijala</Heading4>
			<form>
				<Heading3 style={{ marginBottom: '3.2rem' }}>Unos podataka</Heading3>
				<FormEl>
					<label htmlFor='name'>Naziv</label>
					<StyledParentInput type='text' name='name' />
				</FormEl>
				<FormEl>
					<label htmlFor='urlPreview'>URL za preview</label>
					<StyledParentInput type='text' name='urlPreview' />
				</FormEl>
				<FormEl>
					<label htmlFor='price'>Cena</label>
					<StyledParentInput type='number' name='price' />
				</FormEl>
				<FormEl>
					<label htmlFor='description'>Opis</label>
					<StyledTextArea
						name='description'
						cols='30'
						rows='4'
					></StyledTextArea>
				</FormEl>
				<Heading3 style={{ marginBottom: '3.2rem' }}>
					Tutorijali za paket
				</Heading3>
				<SearchBar />
				<ArticleContainer>
					{demoTutorials.map((t) => (
						<div className='item' key={t.id}>
							<div className='top'>
								<a>{t.title}</a>
								<div>
									<span>{t.price}RSD</span>
									<img src='/images/svg/delete.svg' alt='Delete' />
								</div>
							</div>
							{t.description && <p className='description'>{t.description}</p>}
						</div>
					))}
				</ArticleContainer>
				<StyledButton>Napravi</StyledButton>
			</form>
		</Main>
	)
}
