import React from 'react'
import styled from 'styled-components'
import Heading4 from '../components/Heading4'
import Pagination from '../components/Pagination'
import Layout from '../components/Layout/Layout'

const Main = styled.main`
	padding-top: 4.8rem;
	padding-bottom: 6.4rem;

	/* .bodyPadding fallback */
	padding-left: 2.4rem;
	padding-right: 2.4rem;
`

const purchases = [
	{
		article: 'Kalemegdansko kolo aaaaaaaaa',
		date: '11.10.2020',
		price: 1000,
		id: '0',
	},
	{ article: 'Kalemegdansko kolo', date: '11.10.2020', price: 1000, id: '1' },
	{ article: 'Kalemegdansko kolo', date: '11.10.2020', price: 1000, id: '2' },
	{ article: 'Kalemegdansko kolo', date: '11.10.2020', price: 1000, id: '3' },
	{ article: 'Kalemegdansko kolo', date: '11.10.2020', price: 1000, id: '4' },
	{ article: 'Kalemegdansko kolo', date: '11.10.2020', price: 1000, id: '5' },
	{ article: 'Kalemegdansko kolo', date: '11.10.2020', price: 1000, id: '6' },
	{ article: 'Kalemegdansko kolo', date: '11.10.2020', price: 1000, id: '7' },
	{ article: 'Kalemegdansko kolo', date: '11.10.2020', price: 1000, id: '8' },
]

const Table = styled.table`
	margin: 0 auto;
	margin-bottom: 3.2rem;

	th {
		font-size: 1.4rem;
		border: 1px solid #406798;
		background-color: #406798;
		color: white;
	}

	td {
		font-size: 1.4rem;
		border: 1px solid #d0e2f9;
	}

	td,
	th {
		/* border: 1px solid #dddddd; */
		text-align: left;
		padding: 8px;
	}
`

export default () => {
	return (
		<Layout>
			<Main className='content'>
				<Heading4 isCenter={true}>Istorija kupovine</Heading4>
				<Table>
					<thead>
						<tr>
							<th>Artikl</th>
							<th>Datum</th>
							<th>Cena</th>
						</tr>
					</thead>
					<tbody>
						{purchases.map((p) => (
							<tr key={p.id}>
								<td>{p.article}</td>
								<td>{p.date}</td>
								<td>{p.price}</td>
							</tr>
						))}
					</tbody>
				</Table>
				<Pagination />
			</Main>
		</Layout>
	)
}
