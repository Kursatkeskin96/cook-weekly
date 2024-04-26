'use client'
import React, { useState } from "react";
import Link from 'next/link'
import Image from 'next/image';
import logo from '@/utils/images/logo.png'
import { signOut, useSession } from 'next-auth/react';
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Wave from '@/utils/images/wave.png'

const Navbar = () => {
  const { data: session } = useSession();
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <>
    <nav className='w-full mx-auto h-[64px] border-b-[1px] border-gray-100 flex justify-between items-center px-10'>
      <Link href='/'>
        <div className='flex items-center gap-2 cursor-pointer'>
          <Image src={logo} alt='logo' width={50} height={50} />
          <span className='text-[#610000] cookie-regular font-bold text-xl'>Cook Weekly</span>
        </div>
      </Link>

      <div className='hidden md:flex justify-end items-center gap-10'>
        {session?.user ? (
          <>
           <Link href='/'>
           <div className='w-fit text-center py-1 relative after:bg-[#D34C26] after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer'>Home</div>
         </Link>
         <Link href={`/my-kitchen/${session.user.username}`}>
           <div className='w-fit text-center py-1 relative after:bg-[#D34C26] after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer'>My Kitchen</div>
         </Link>
         <Link href={`/calendar/${session.user.username}`}>
           <div className='w-fit text-center py-1 relative after:bg-[#D34C26] after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer'>Calendar</div>
         </Link>
         
          <div onClick={() => signOut()} className='bg-[#D34C26] text-white rounded-lg w-20 text-center py-1 cursor-pointer'>Logout</div>
          </>
        ) : (
          <>
            <Link href='/login'>
              <div className='w-14 text-center py-1 relative after:bg-[#D34C26] after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer'>Login</div>
            </Link>
            <Link href='/register'>
              <div className='bg-[#D34C26] text-white rounded-lg w-20 text-center py-1 cursor-pointer'>Register</div>
            </Link>
          </>
        )}
      </div>

      <div onClick={handleNav} className='md:hidden cursor-pointer'>
        <AiOutlineMenu className='text-black' size={25} />
      </div>

      <div className={`${nav ? ' z-50 fixed left-0 top-0 w-full h-screen bg-black/70' : 'hidden'}`}>
        <div className={`${nav ? 'fixed left-0 top-0 w-[100%] sm:w-[100%] h-screen bg-white p-10 ease-in duration-500' : 'hidden  ease-in duration-500 ' }`}>
          <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2 cursor-pointer'>
          <Image src={logo} alt='logo' width={50} height={50} />
          <span className='text-[#610000] cookie-regular font-bold text-xl'>Cook Weekly</span>
        </div>        
        <div onClick={handleNav} className='rounded-full shadow-lg bg-[#610000] text-white shadow-gray-400 p-3 cursor-pointer'>
              <AiOutlineClose />
            </div>
          </div>
          <hr className="h-[1px] mx-auto my-12 bg-[#610000] border-0 rounded"></hr>
          <div className="flex flex-col text-2xl mt-10 jusitfy-center item-center text-center gap-8">
          {session?.user ? (
            <>  <Link onClick={() => setNav(false)} className="" href='/'>Home</Link>
            <Link onClick={() => setNav(false)} href={`/my-kitchen/${session.user.username}`}>My Kitchen</Link>
            <Link onClick={() => setNav(false)} href={`/calendar/${session.user.username}`}>Calendar</Link>
            <div onClick={() => { setNav(false); signOut(); }} className='bg-[#D34C26] text-white rounded-lg mx-auto w-32 text-center py-1 cursor-pointer'>Logout</div></>
              ) : (
             <>   <Link onClick={() => setNav(false)} className="w-20 mx-auto text-center py-1 relative after:bg-[#D34C26] after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer" href='/'>Home</Link>
                         <Link onClick={() => setNav(false)} href='/login'>
              <div className='w-20 mx-auto text-center py-1 relative after:bg-[#D34C26] after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer'>Login</div>
            </Link>
            <Link onClick={() => setNav(false)} href='/register'>
              <div className='bg-[#D34C26] mx-auto text-white rounded-lg w-32 text-center py-1 cursor-pointer'>Register</div>
            </Link>
</>
                ) }
              </div>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;
