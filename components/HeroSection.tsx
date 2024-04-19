"use client";
import Image from "next/image";
import React from "react";
import heroimg from "@/utils/images/heroimg.jpg";
import arrow from "@/utils/images/arrow.png";
import CountUp from "react-countup";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <div className="max-w-[85%] mx-auto mb-10 flex flex-col">
      <motion.div
        initial={{ opacity: 0, z: 100 }}
        animate={{ opacity: 1, z: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="mt-7">
          <h1 className="text-6xl lg:mt-0 mt-4">Plan, Shop, Cook.</h1>
        </div>
        <div>
          <h3 className="text-4xl lg:mt-0 my-5 text-[#818181]">
            Best tool for organising your dinners.
          </h3>
        </div>

        <div className="w-full mt-5 h-[250px] rotate-180 relative">
          <Image
            src={heroimg}
            alt="hero section img"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
        {" "}
        <div className="flex lg:justify-between justify-center gap-5 lg:gap-0 items-center md:justify-center md:gap-5 flex-wrap">
            <div className="flex justify-center items-center gap-10">
            <div className="w-32 h-32 mt-10 rounded-[16px] bg-[hsl(0,50%,19%)] flex flex-col justify-center items-center text-[#EDE9D0] shadow-lg font-bold text-lg">
              <span>
                +<CountUp duration={10} end={90000} />
              </span>
              <span className="text-sm text-white">Users</span>
            </div>
          <div>
            <div className="  w-32 h-32 mt-10 lg:mr-40 rounded-[16px] bg-[hsl(0,50%,19%)] flex flex-col justify-center items-center text-[#EDE9D0] shadow-lg font-bold text-lg">
              Unlimited
              <span className="text-sm text-white">Database</span>
            </div>
          </div>
            </div>
          <div className="md:w-[50%] ">
            <div className="mt-8 flex flex-col justify-center   items-center">
              <p className="text-lg lg:max-w-[70%] text-center">
                If you bored to think what to cook everyday, register and solve
                your problem!
              </p>
            </div>
            <div className="flex justify-center mt-4 md:ml-[30%] lg:mr-40 items-center gap-5">
              <Image src={arrow} width={150} height={150} alt="arrow" />
              <Link href="/register">
                <div className="bg-[#D34C26] text-white rounded-[16px] w-44 mt-3 text-center py-1 cursor-pointer">
                  Register
                </div>
              </Link>
            </div>
          </div>
        </div>{" "}
      </motion.div>
    </div>
  );
}
