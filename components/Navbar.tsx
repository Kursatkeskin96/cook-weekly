import React from 'react'
import Link from 'next/link'
import { getSession } from '@/app/actions'

const Navbar = async () => {
    const session = await getSession()

  return (
    <nav className='bg-[#212227] text-white w-96 rounded-[20px] mt-4 mx-auto h-[50px] flex items-center justify-center'>
        <ul className='flex justify-center items-center gap-10 cursor-pointer'>
           <Link href='/'><li className='w-16 hover:bg-[#32333b] text-center rounded-[20px]'>Home</li></Link>
            <Link href='/login'><li className='bg-[#33C136] text-white rounded-[20px] w-16 text-center hover:bg-[#29a02b]'>Login</li></Link>
          
           {session.isLoggedIn &&
           <Link href='/'><li className='bg-[#33C136] text-white rounded-[20px] w-16 text-center hover:bg-[#29a02b]'>Logout</li></Link>
        } 
        </ul>
    </nav>
  )
}
export default Navbar;