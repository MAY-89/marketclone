import React, { useEffect } from 'react'
import axios from 'axios'

function DetailProductPage(props) {

    const productId = props.match.params.productId;

    useEffect(() => {
      axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
      .then(response => {
        if(response.data.success){
            console.log(response.data);
        }else{

        }
      })
    }, [])
    




  return (
    <div>DetailProductPage</div>
  )
}

export default DetailProductPage