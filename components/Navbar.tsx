import React from 'react'
import Link from 'next/link'
import Image from 'next/image';
import logo from '@/utils/images/logo.png'

const Navbar = async () => {
  return (
    <nav className=' w-full mx-auto h-[64px] shadow-lg flex justify-between items-center px-10'>

          <Link href='/'><div className='flex justify-center items-center gap-2'><Image src={logo} alt='logo' width={50} height={50}></Image> <span className='text-[#610000] cookie-regular font-bold text-xl'>Cook Weekly</span></div></Link>
          <div className='flex justify-center items-center gap-10'>
            <Link className='w-14 text-center py-1 relative after:bg-[#D34C26] after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer' href='/login'>Login</Link>
            <Link className='bg-[#D34C26] text-white rounded-lg w-20 text-center py-1' href='/register'>Register</Link>
          </div>
    </nav>
  )
}
export default Navbar;