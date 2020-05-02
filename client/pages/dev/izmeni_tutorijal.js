import styled from 'styled-components'
import Button3 from '../../components/buttons/Button3'
import Heading4 from '../../components/Heading4'
import ParentInput from '../../components/form/ParentInput'
import TextArea from '../../components/form/TextArea'

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

export default () => {
	return (
		<Main className='content'>
			<Heading4 isCenter={true}>Izmeni tutorijal</Heading4>
			<form>
				<FormEl>
					<label htmlFor='name'>Naziv</label>
					<StyledParentInput
						type='text'
						name='name'
						value='Kalemegdansko kolo'
					/>
				</FormEl>
				<FormEl>
					<label htmlFor='url'>URL</label>
					<StyledParentInput
						type='text'
						name='url'
						value='www.vimeo.com/video/6153156443'
					/>
				</FormEl>
				<FormEl>
					<label htmlFor='urlPreview'>URL za preview</label>
					<StyledParentInput
						type='text'
						name='urlPreview'
						value='www.vimeo.com/video/6633412163'
					/>
				</FormEl>
				<FormEl>
					<label htmlFor='price'>Cena</label>
					<StyledParentInput type='number' name='price' value={1000} />
				</FormEl>
				<FormEl>
					<label htmlFor='description'>Opis</label>
					<StyledTextArea
						name='description'
						cols='30'
						rows='8'
						value='At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt.'
					></StyledTextArea>
				</FormEl>
				<StyledButton>Sačuvaj</StyledButton>
			</form>
		</Main>
	)
}
