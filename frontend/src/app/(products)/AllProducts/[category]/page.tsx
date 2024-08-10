'use client'
import AllProducts, { Products } from '@/app/(admin)/all-products/page'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function ProductsByCategory() {
    
    const params = useParams()
    const [products, setProducts] = useState<Products[] | []>([])

    useEffect(()=>{
        try {
            ;(
                async() => {
                    const res = await axios.get(`http://localhost:8000/api/product/category?category=${params.category}`)
                    setProducts(res.data.payload)
                }
            )();
        } catch (error) {
            console.log(error)
        }
    },[params])

    return (
        <div className=' py-4 bg-black/10  '>
            <div className='grid md:grid-cols-12 w-full items-center  justify-center sm:items-center sm:justify-center p-4 gap-4 '>
                {
                    products && products.length > 0 ?  products.map((product) => (
                        <Card key={ product.id } className='md:h-full md:max-w-sm lg:col-span-4 md:col-span-6    shadow-md col-span-1  '>

                            <CardHeader>
                                <CardTitle>{ product.name }</CardTitle>
                                <CardDescription>{ product.description }</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <img className='w-72 h-72' src={ `/uploads/${product.image.split('\\')[4]}` } alt={ product.name } />
                            </CardContent>
                            <CardFooter className='flex flex-col gap-4 w-full'>
                                <Button className='w-full bg-green-700'>Explore</Button>
                                

                            </CardFooter>
                        </Card>


                    )) :
                      <h1 className='font-bold text-4xl text-center w-full text-black'>Loading..... </h1>
                }
            </div>

        </div>
    )
}


export default ProductsByCategory