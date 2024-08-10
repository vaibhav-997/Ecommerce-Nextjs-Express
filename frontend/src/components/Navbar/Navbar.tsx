'use client'
import React from 'react'
import { Button } from '../ui/button'
import { navbarMenu } from '@/constants/navConsts'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from 'next/navigation'

function Navbar() {
  const { data } = useSession()
  const router = useRouter()
  const path = usePathname()
  
  return (
    <nav className='w-full sm:p-6 p-4 bg-white shadow-md  flex items-center justify-center'>
      <div className='w-full grid  sm:grid-cols-12 grid-cols-2  sm:items-center sm:justify-between items-center justify-evenly  '>
        <div className=' sm:col-span-3   col-span-1  flex items-center justify-between  '>
          <img width={70} src="/logomain.jpg" alt="Logo" />
        </div>

        <div className='sm:col-span-6 sm:block  hidden  items-center justify-center  '>
          <ul className='flex items-center justify-center  w-full gap-10'>
            {

              navbarMenu.map((navItems) => (
               <div key={ navItems.name } className='flex flex-col'>
                <Link className={`text-lg font-semibold ${path === navItems.to ? "text-orange-500" : 'text-black'}`}  href={ navItems.to }>{ navItems.name }</Link>
                {
                  path === navItems.to ? <div className=' bg-orange-500 py-0.5'></div> : null
                }
               </div>
              ))


            }
          </ul>
        </div>

        <div className='sm:col-span-3  col-span-1  w-full  flex items-center justify-end'>
          {
            data?.user ?
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={ data.user.image as string } />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Profile</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  {
                    data.user.role === 'ADMIN' ? 
                    <>
                    <DropdownMenuItem onClick={() => router.push('/add-product')}>Add Product</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/all-products')}>All Products</DropdownMenuItem>
                    </> : null
                  }
                  <DropdownMenuItem onClick={ () => signOut() }>Logout</DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>


              :
              <Button onClick={ () => router.push('/signin') } className='px-4 text-lg'>Login</Button>
          }
        </div>
        <div className='col-span-2 flex w-full my-4 p-2 sm:hidden shadow  items-center justify-center  '>
          <ul className='flex items-center justify-center  w-full gap-10'>
            {

              navbarMenu.map((navItems) => (
               <div key={ navItems.name } className='flex flex-col'>
                <Link className={`text-lg font-semibold ${path === navItems.to ? "text-orange-500" : 'text-black'}`}  href={ navItems.to }>{ navItems.name }</Link>
                {
                  path === navItems.to ? <div className=' bg-orange-500 py-0.5'></div> : null
                }
               </div>
              ))


            }
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar