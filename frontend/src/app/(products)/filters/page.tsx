'use client'
import AllProducts, { Products } from '@/app/(admin)/all-products/page'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function FilterProducts() {
    const [filterData, setFilterData] = useState<String | null>(null)
    const [sizeData, setSizeData] = useState<String | null>(null)
    const [searchData, setSearchData] = useState<String | null>(null)
    const [products, setProducts] = useState<Products[] | []>([])
    async function handleSearch() {
        try {
            const res = await axios.get(`http://localhost:8000/api/product/search?search=${searchData}`)
            setProducts(res.data.payload)
            console.log(res.data)

        } catch (error) {
            console.log('failed to search', error)
        }
    }

    async function handleFilterSearch() {
      try {
        const res = await axios.get(`http://localhost:8000/api/product/search?price=${filterData}`)
        setProducts(res.data.payload)
        console.log(res.data)

    } catch (error) {
        console.log('failed to search', error)
    }
    
}

async function handleSizeAnPriceFilter() {
    
    try {
      const res = await axios.get(`http://localhost:8000/api/product/search?size=${sizeData}&price=${filterData}`)
      setProducts(res.data.payload)
      console.log(res.data)
    
    } catch (error) {
      console.log('failed to search', error)
    }
}

    

    return (
        <div className='flex flex-col h-svh '>
            <div className=' min-h-20 flex items-center bg-black/10 border-b border-black justify-center'>
                <div className=' flex gap-2  w-fit p-2 ' >
                    <Input className='w-96' type='text' placeholder={ 'search' } onChange={(e)=> {setSearchData(e.target.value)}} />
                    <Button onClick={handleSearch}>Search</Button>
                </div>
            </div>
            <div className='grid grid-cols-12 h-svh bg-black/15 '>
                <div className='col-span-2  p-2 border-black border-r'>
                    <div className=' flex flex-col items-center justify-center gap-4 py-4 px-2 '>
                        <h2 className='font-bold'>Filter product based on values</h2>
                        <RadioGroup 
                        onValueChange={(data) => {setFilterData(data)}}
                        className='w-full flex flex-col gap-4 px-4 py-1 '>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="500" id="500" />
                                <Label className='hover:cursor-pointer' htmlFor="500">{"< 500"} </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1000" id="1000" />
                                <Label className='hover:cursor-pointer' htmlFor="1000">{"< 1000"}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1500" id="1500" />
                                <Label className='hover:cursor-pointer' htmlFor="1500">{"< 1500"}</Label>
                            </div>
                        </RadioGroup>

                    </div>
                    <div className=' flex flex-col items-center justify-center gap-4 py-4 px-2 '>
                        <h2 className='font-bold'>Filter product based on Size</h2>
                        <RadioGroup 
                        onValueChange={(data) => {setSizeData(data)}}
                        className='w-full flex flex-col gap-4 px-4 py-1 '>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="S" id="small" />
                                <Label className='hover:cursor-pointer' htmlFor="small">{"Small"} </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="M" id="medium" />
                                <Label className='hover:cursor-pointer' htmlFor="medium">{"Medium"}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="L" id="large" />
                                <Label className='hover:cursor-pointer' htmlFor="large">{"Large"}</Label>
                            </div>
                        </RadioGroup>

                    </div>
        <Button className='w-full' onClick={handleSizeAnPriceFilter}>Filter</Button>
                </div>
                <div className='col-span-10 overflow-y-auto bg-black/5 '>
                <div className='   w-full  '>
            <div className='grid md:grid-cols-12 w-full items-center  justify-center sm:items-center sm:justify-center  gap-4 p-4'>
                {
                    products && products.length > 0 ?  products.map((product) => (
                        <Card key={ product.id } className='md:h-full md:max-w-sm lg:col-span-4 md:col-span-6    shadow-md col-span-1 '>

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
                      <div className='col-span-12'>
                        <AllProducts admin={false} />
                      </div>
                }
            </div>

        </div>
                </div>
            </div>
        </div>
    )
}
