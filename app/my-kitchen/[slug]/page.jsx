'use client'
import React, { useState, useEffect } from 'react';
import { useSession, status } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import mykitchen from '@/utils/images/mykitchen.png'

// Asynchronous function to get user data
const getData = async (slug) => {
    if (typeof window !== 'undefined') {
      var currentURL = window.location.href;
      var urlParts = currentURL.split("/");
      var domain = urlParts[1];
    }
  
    const api = domain;
    const res = await fetch(`${api}/api/user/${slug}`);
    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }
  
    return res.json();
  };

  const getMealData = async (slug) => {
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
    const [user, setUser] = useState(null);
    const [meal, setMeal] = useState([])
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

      useEffect(() => {
        // Fetch user data and referredBy count
        getData(slug)
          .then(data => {
            setUser(data.username);
            setLoading(false);
          })
          .catch(error => {
            setError(error.message);
            setLoading(false);
            console.error("Error fetching user data:", error);
          });
    }, [slug]);

    useEffect(() => {
        // Fetch user data and referredBy count
        getMealData(slug)
        .then(info => {
            setMeal(info.meal);
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
    <div className='lg:max-w-[80%] max-w-[90%]  mx-auto'>
        <div className='flex justify-center items-center gap-5 mt-10 '>
            <hr className="w-[80%] h-[1px] mx-auto my-4 bg-[#FFC107] border-0 rounded"></hr>
            <div className='text-4xl text-[#610000] lg:w-96 cookie-regular text-center'>&apos;s Kitchen</div>
            <hr className="w-[80%] h-[1px] mx-auto my-4 bg-[#FFC107] border-0 rounded"></hr>
        </div>
<div className='flex justify-between items-center mx-14 flex-wrap'>
<div className=' w-60 h-60 mt-10 mb-10 lg:mb-0 mx-auto rounded-[50%] bg-[#EDE9D0] flex justify-center items-center'>
            <Image src={mykitchen} width={200} height={200} alt='pic'/>
        </div>
        <div className='lg:max-w-[55%] text-center'>
            <h2 className='text-2xl font-bold'>Welcome Chef!</h2>
            <p className='text-lg text-[#4f4d4d] my-5'>In your Kitchen, you can review your recipes and edit if you want or even delete them. And you can also add your one of delicious recipes. </p>
        <Link href='/add-recipe'>    <button className="hover:bg-[#610000db] mt-2 w-52 text-center rounded-[16px] text-lg bg-[#610000] text-white h-[42px]">Add Recipe</button></Link>
        </div>
</div>
<hr className="w-[100%] mt-20 h-[1px] mx-auto my-4 bg-[#610000] border-0 rounded"></hr>

<div>
<form className="max-w-md mx-auto mt-16">   
    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
    <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input type="search" id="default-search" className="block focus:outline-none w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-[#610000] focus:border-[#610000]" placeholder="Search your recipes.." required />
        <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-[#D34C26] hover:bg-[#e7532a] focus:ring-4 focus:outline-none focus:ring-[#610000] font-medium rounded-lg text-sm px-4 py-2 ">Search</button>
    </div>
</form>
</div>
<div className='flex justify-center items-center gap-5 flex-wrap my-20'>
  
    {meal.map((meal) => (
            <div>
                        <div  key={meal.id} className='flex flex-col justify-between items-center bg-[#3C4F76] border-[1px] border-[#3C4F76] w-[150px] h-[105px] py-2 rounded-[16px]'>
                        <h3 className='text-white font-bold'>    {meal.name} </h3>
                        <p className='text-xs text-[#EDE9D0]'>{meal.createdAt}</p>
                    </div>
                    </div>
                ))}

</div>
    </div>
  )
}
