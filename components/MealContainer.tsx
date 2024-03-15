'use client'
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import calendar from '@/utils/images/calendar.png'
import Board from '@/components/Board';
import { SortableContext } from '@dnd-kit/sortable';
import FoodCard from './FoodCard';
import { Column, Id, Task } from '@/tyoes';

interface Recipe {
    id: number;
    name: string;
    // Add other properties as needed
  }


  interface Props {
    column: Column;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;
    createTask: (columnId: Id) => void;
    tasks: Task[];
    updateTask: (id: Id, content: string) => void
    deleteTask: (id: Id) => void;
  }
  
  

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


  export default function MealContainer({ params}, props: Props) {
    
    const {
        column,
        deleteColumn,
        updateColumn,
        createTask,
        tasks,
        deleteTask,
        updateTask,
      } = props;

    const { slug } = params;
    const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (slug) {
      getData(slug)
        .then(data => {
          setRecipes(data.meal);
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
          console.error("Error fetching recipe data:", error);
        });
    }
  }, [slug]);

  function generateId() {
    return Math.floor(Math.random() * 10001);
  }

const initialTtasks = recipes.map(recipe => ({
    id: recipe.id.toString(), // Convert id to string, assuming your Board component expects string ids
    content: recipe.name,
    columnId: generateId()
    // Add more properties as needed by your Board component
}));

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
            <div className='flex mt-10 justify-center items-center flex-wrap gap-4 bg-[#e6eafe]  rounded-[16px] py-10'>
    {recipes.map((recipe: any) => (
               <div className='flex mt-10 justify-center items-center flex-wrap gap-4 bg-[#e6eafe] rounded-[16px] py-10'>
               <SortableContext items={recipes.map(recipe => recipe.id.toString())}>
                 {recipes.map((recipe) => (
                   <FoodCard key={recipe.id} deleteTask={deleteTask} updateTask={updateTask}  task={{ id: recipe.id.toString(), columnId: generateId(), content: recipe.name }} />
                 ))}
               </SortableContext>
             </div>
                ))}
    </div>
    </div>
  )
}
