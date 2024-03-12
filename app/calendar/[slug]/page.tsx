'use client'
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import calendar from '@/utils/images/calendar.png'
import calendarfood from '@/utils/images/calendarfood.png'

// Asynchronous function to get user data
const getData = async (slug: any) => {
    let domain;
    let protocol = 'http://'; // Default protocol for local development
    
    if (typeof window !== 'undefined') {
      const currentURL = window.location.href;
      const urlParts = currentURL.split("/");
      domain = urlParts[2]; // Gets the domain part of the URL
      protocol = urlParts[0]; // Gets the protocol (http: or https:)
    } else {
      domain = 'defaultDomainHere'; 

    }
    const api = `${protocol}//${domain}`; 
    const res = await fetch(`${api}/api/recipe/by-username/${slug}`);
    if (!res.ok) {
      throw new Error("Failed to fetch recipe data");
    }
  
    return res.json();
  };
  
export default function MyKitchen({ params, searchParams }) { 
    
    const { slug } = params;
    const {data: session} = useSession()
    const router = useRouter()  
    const [recipe, setRecipe] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

      useEffect(() => {
        // Fetch user data and referredBy count
        getData(slug)
        .then(data => {
            setRecipe(data.meal);
            setLoading(false);
          })
          .catch(error => {
            setError(error.message);
            setLoading(false);
            console.error("Error fetching user data:", error);
          });
    }, [slug]);
    if (loading) {
        return <div>Loading</div>;
      }

  return (
    <div className='lg:max-w-[90%] max-w-[90%]  mx-auto'>
        <div className='flex justify-center items-center gap-5 mt-10 '>
            <hr className="w-[80%] h-[1px] mx-auto my-4 bg-[#FFC107] border-0 rounded"></hr>
            <div className='text-4xl text-[#610000] lg:w-96 cookie-regular text-center'>My Calendar</div>
            <hr className="w-[80%] h-[1px] mx-auto my-4 bg-[#FFC107] border-0 rounded"></hr>
        </div>
<div className='flex justify-between items-center mx-14 flex-wrap'>
<div className='mt-10 mb-10 lg:mb-0 mx-auto flex justify-center items-center'>
            <Image src={calendar} width={300} height={300} alt='pic'/>
        </div>
        <div className='lg:max-w-[55%] text-center'>
            <h2 className='text-2xl font-bold'>Welcome To Your Calendar!</h2>
            <p className='text-lg text-[#4f4d4d] my-5'>
In the calendar, you can easily organize your weekly meals by dragging and dropping your meals onto specific days.</p>
        </div>
</div>

<div>
    <div className='flex mt-10 justify-center items-center flex-wrap gap-4 bg-[#e6eafe]  rounded-[16px] py-10'>
    {recipe.map((recipe: any) => (
                    <div key={recipe.id} className='w-fit text-xs cursor-pointer bg-[#f7761e] text-white p-1 rounded-lg'>
                        {recipe.name} 
                    </div>
                ))}
    </div>
    <div className='flex mt-10 justify-center items-center mb-10 flex-wrap gap-10'>
        <div className=' h-72 w-60 bg-[#3C4F76] rounded-lg'>
            <p className='text-white font-bold text-xl text-center mt-3'>Monday</p>
            <hr className="w-[80%] h-[1px] mx-auto my-4 bg-[#FFC107] border-0 rounded"></hr>
            <div className='w-fit mt-20 text-center mx-auto text-xs cursor-pointer bg-[#f7761e] text-white p-1 rounded-lg'>Mercimek Corbasi</div>
        </div>
        <div className=' h-72 w-60 bg-[#3C4F76] rounded-lg'>
            <p className='text-white font-bold text-xl text-center mt-3'>Tuesday</p>
            <hr className="w-[80%] h-[1px] mx-auto my-4 bg-[#FFC107] border-0 rounded"></hr>
            <div className='w-fit mt-20 text-center mx-auto text-xs cursor-pointer bg-[#f7761e] text-white p-1 rounded-lg'>Mercimek Corbasi</div>
        </div>
        <div className=' h-72 w-60 bg-[#3C4F76] rounded-lg'>
            <p className='text-white font-bold text-xl text-center mt-3'>Thursday</p>
            <hr className="w-[80%] h-[1px] mx-auto my-4 bg-[#FFC107] border-0 rounded"></hr>
            <div className='w-fit mt-20 text-center mx-auto text-xs cursor-pointer bg-[#f7761e] text-white p-1 rounded-lg'>Mercimek Corbasi</div>
        </div>
        <div className=' h-72 w-60 bg-[#3C4F76] rounded-lg'>
            <p className='text-white font-bold text-xl text-center mt-3'>Friday</p>
            <hr className="w-[80%] h-[1px] mx-auto my-4 bg-[#FFC107] border-0 rounded"></hr>
            <div className='w-fit mt-20 text-center mx-auto text-xs cursor-pointer bg-[#f7761e] text-white p-1 rounded-lg'>Mercimek Corbasi</div>
        </div>
        <div className=' h-72 w-60 bg-[#3C4F76] rounded-lg'>
            <p className='text-white font-bold text-xl text-center mt-3'>Monday</p>
            <hr className="w-[80%] h-[1px] mx-auto my-4 bg-[#FFC107] border-0 rounded"></hr>
            <div className='w-fit mt-20 text-center mx-auto text-xs cursor-pointer bg-[#f7761e] text-white p-1 rounded-lg'>Mercimek Corbasi</div>
        </div>
        <div className=' h-72 w-60 bg-[#3C4F76] rounded-lg'>
            <p className='text-white font-bold text-xl text-center mt-3'>Saturday</p>
            <hr className="w-[80%] h-[1px] mx-auto my-4 bg-[#FFC107] border-0 rounded"></hr>
            <div className='w-fit mt-20 text-center mx-auto text-xs cursor-pointer bg-[#f7761e] text-white p-1 rounded-lg'>Mercimek Corbasi</div>
        </div>
        <div className=' h-72 w-60 bg-[#3C4F76] rounded-lg'>
            <p className='text-white font-bold text-xl text-center mt-3'>Sunday</p>
            <hr className="w-[80%] h-[1px] mx-auto my-4 bg-[#FFC107] border-0 rounded"></hr>
            <div className='w-fit mt-20 text-center mx-auto text-xs cursor-pointer bg-[#f7761e] text-white p-1 rounded-lg'>Mercimek Corbasi</div>
        </div>
    </div>
</div>
    </div>
  )
}
