"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import calendar from "@/utils/images/calendar.png";
import calendarfood from "@/utils/images/calendarfood.png";
import Board from "@/components/Board";
import { motion } from "framer-motion";

// Asynchronous function to get user data
const getData = async (slug: any) => {
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
  const res = await fetch(`${api}/api/recipe/by-username/${slug}`);
  if (!res.ok) {
    throw new Error("Failed to fetch recipe data");
  }

  return res.json();
};

export default function MyKitchen({ params, searchParams }) {
  const { slug } = params;
  const { data: session } = useSession();
  const router = useRouter();
  const [recipe, setRecipe] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user data and referredBy count
    getData(slug)
      .then((data) => {
        setRecipe(data.meal);
      })
      .catch((error) => {
        setError(error.message);
        console.error("Error fetching user data:", error);
      });
  }, [slug]);

  return (
    <div className="lg:max-w-[90%] max-w-[90%]  mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
        <div className="flex justify-center items-center gap-5 mt-10 ">
          <hr className="w-[80%] h-[1px] mx-auto my-4 bg-[#FFC107] border-0 rounded"></hr>
          <div className="text-4xl text-[#610000] lg:w-96 cookie-regular text-center">
            My Calendar
          </div>
          <hr className="w-[80%] h-[1px] mx-auto my-4 bg-[#FFC107] border-0 rounded"></hr>
        </div>

        <div className="flex justify-between items-center mx-14 flex-wrap">
          <div className="mt-10 mb-10 lg:mb-0 mx-auto flex justify-center items-center">
            <Image src={calendar} width={300} height={300} alt="pic" />
          </div>
          <div className="lg:max-w-[55%] text-center">
            <h2 className="text-2xl font-bold">Welcome To Your Calendar!</h2>
            <p className="text-lg text-[#4f4d4d] my-5">
              In the calendar, you can easily organize your weekly meals by
              dragging and dropping your meals onto specific days.
            </p>
          </div>
        </div>
      </motion.div>
      <div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          <div className=" bg-[#1d2a2d] rounded-[16px] mt-20 mb-5 py-5">
            <h3 className="text-center text-3xl text-[#ee8434] pb-5">
              Your Meals
            </h3>
            <div className="flex flex-wrap justify-center items-center">
              {recipe.map((recipe: any) => (
                <div
                  key={recipe.id}
                  className="m-2 text-xs text-[#eff3f7] border-b-2 border-black p-1 rounded-lg"
                >
                  {recipe.name}
                </div>
              ))}
            </div>
          </div>
          <Board params={params} recipes={recipe} />
        </motion.div>
      </div>
    </div>
  );
}
