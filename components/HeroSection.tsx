import Image from 'next/image'
import React from 'react'
import heroimg from '@/utils/images/heroimg.jpg'

export default function HeroSection() {
  return (
    <div className='max-w-[85%] mx-auto flex flex-col'>
        <div className='mt-7'><h1 className='text-6xl'>Plan, Shop, Cook.</h1></div>
        <div><h3 className='text-4xl text-[#818181]'>Best tool for organising your dinners.</h3></div>
        <div className='w-full mt-5 h-[250px] rotate-180'>  <Image
    src={heroimg}
    alt="hero section img"
    layout="fill" // This makes the image fill the parent container
    objectFit="cover" // Adjusts how the image fits within its box, similar to the CSS property. Use "contain" to fit within without cropping.
    className="" // Apply rotation
  /></div>
    </div>
  )
}
