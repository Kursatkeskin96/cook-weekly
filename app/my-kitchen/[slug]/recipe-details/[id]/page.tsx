"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactTimeAgo from "react-time-ago";
import en from "javascript-time-ago/locale/en";
import TimeAgo from "javascript-time-ago";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';

TimeAgo.addDefaultLocale(en);

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  amount: string;
}

interface Meal {
  id: number;
  name: string;
  createdAt: string;
  ingredients: Ingredient[];
}

const getMealData = async (id: string) => {
  let domain;
  let protocol = "http://"; // Default protocol for local development

  if (typeof window !== "undefined") {
    const currentURL = window.location.href;
    const urlParts = currentURL.split("/");
    domain = urlParts[2]; // Gets the domain part of the URL
    protocol = urlParts[0]; // Gets the protocol (http: or https:)
  } else {
    domain = "defaultDomainHere";
  }
  const api = `${protocol}//${domain}`;
  const res = await fetch(`${api}/api/recipe/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch recipe data");
  }

  return res.json();
};

export default function MyKitchen({ params, searchParams }) {
  const { id } = params;
  const { data: session } = useSession();
  const router = useRouter();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMealData(id)
      .then((info) => {
        setMeal(info.meal);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        console.error("Error fetching user data:", error);
      });
  }, [id]);

  const deleteMeal = async (mealId: number) => {
    try {
      const response = await fetch(`/api/recipe/${mealId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the meal");
      }

      if (meal) {
        // Remove the deleted meal from the state to update the UI
        const updatedMeals = meal.ingredients.filter((m) => m.id !== mealId);
        setMeal({...meal, ingredients: updatedMeals});
      }
      router.push(`/my-kitchen/${session?.user?.username}`)
      toast.success('Meal created successfully!')
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!meal) {
    return <div>No meal data available</div>;
  }

  return (
    <div className="lg:max-w-[80%] max-w-[90%] mx-auto">
         <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <div className="flex justify-center items-center gap-5 mt-10">
        <hr className="w-[80%] h-[1px] mx-auto my-4 bg-[#FFC107] border-0 rounded"></hr>
        <div className="text-4xl text-[#610000] lg:w-96 cookie-regular text-center">
          {meal.name}&apos;s Details
        </div>
        <hr className="w-[80%] h-[1px] mx-auto my-4 bg-[#FFC107] border-0 rounded"></hr>
      </div>
      <div className="flex justify-center items-center flex-wrap">
        <div className="lg:max-w-[55%] text-center mt-10 bg-[#1D2A2D] border-[1px] text-white border-[#3C4F76] w-[350px] h-fit py-2 rounded-[16px]">
          <h2 className="text-2xl text-[#FFC107] font-bold mb-5">{meal.name}</h2>
          {meal.ingredients.length > 0 ? (
            <ul className="flex justify-center items-center gap-2 flex-col">
              {meal.ingredients.map((ingredient) => (
                <li key={ingredient.id}>
                  {ingredient.name}{" "}
                  <span className="ml-3 text-sm text-gray-300">{ingredient.amount}</span>{" "}
                  <span className="text-xs text-gray-400">{ingredient.unit}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No ingredients listed.</p>
          )}
          <p className="text-xs mt-5">Created: 
            <span className="text-gray-300 ml-2">
              <ReactTimeAgo date={new Date(meal.createdAt)} locale="en-US" />
            </span>
          </p>
          <div className="flex justify-center mt-5 text-sm gap-4 text-center items-center ">
            <Link href={`/edit-recipe/${meal.id}`}>
              <button  className="bg-[#D34C26] text-white p-1 w-20 rounded-lg cursor-pointer">Edit</button>
            </Link>
            <button
              className="bg-red-700 text-white p-1 w-20 rounded-lg cursor-pointer"
              onClick={() => deleteMeal(meal.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
