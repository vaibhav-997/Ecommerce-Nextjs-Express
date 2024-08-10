import AllProducts from '@/app/(admin)/all-products/page'
import React from 'react'

function AllProductsForUser() {
  return (
    <AllProducts admin={false} />
  )
}

export default AllProductsForUser