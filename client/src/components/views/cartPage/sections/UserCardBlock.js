import React from 'react'
import "./UserCardBlock.css"
function UserCardBlock(props) {

	const renderCartImage = (images) => {
		if(images.length > 0) {
			let image = images[0];
			return `http://localhost:5000/${image}`
		}
	}


	// products
	const renderItem = ()=> (
		props.products && props.products.map(product => (
			<tr>
				<td>
					<img style={{width: '70px'}} alt='product' src={renderCartImage(product.images)}></img>
				</td>
				<td>
					{product.quantity}
				</td>
				<td>
					{product.price}
				</td>
				<td>
					<button>Remove</button>
				</td>

			</tr>
		))
	)

  return (
		<div>
			<table>
				<thead>
					<tr>
						<th>Product Image</th>
						<th>Product Quantity</th>
						<th>Product Price</th>
						<th>Remove From Cart</th>
					</tr>
				</thead>
				<tbody>
				
			</tbody>
			</table>
		</div>
  )
}

export default UserCardBlock