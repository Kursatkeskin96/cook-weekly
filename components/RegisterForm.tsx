"use client";

import Image from "next/image";
import logo from "@/utils/images/logo.png";
import { useState, FormEvent } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";

const RegisterForm = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the form from reloading the page
    setIsLoading(true)

    // Send the username and password to your API endpoint
    const response = await fetch("/api/user", {
      // Make sure the endpoint matches your API route
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();

    // Display a message based on the response
    setMessage(data.message);
    setIsLoading(false)
    
    if (response.ok) {
      // Reset form or redirect user as needed
      setUsername("");
      setEmail("");
      setPassword("");
      router.push('/')
      // Redirect or further actions after successful registration
    }
  };

    const Spinner = () => (
        <div className="loader mx-auto text-center flex justify-center items-center ease-linear rounded-full border-4 border-t-4 border-white h-6 w-6"></div>
      );

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-start md:items-center lg:pt-0 md:pt-0 lg:items-center pt-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white fo9r h-fit lg:my-10 md:my-10 pb-5 w-[90%] md:w-[70%] lg:w-[400px] rounded-[16px]"
      >
        <div className="flex-col">
          <Link href='/'>
          <div className="flex justify-center items-center mt-5">
            <Image src={logo} alt="logo" width={80} height={80} />
          </div>
          </Link>
          <h3 className="text-center font-bold text-xl mt-2">Welcome Chef</h3>
          <p className="text-[#646464] text-center">
            Please enter your details to register
          </p>
          
   <hr className="w-[90%] h-[1px] mx-auto my-4 bg-[#610000] border-0 rounded"></hr>

          <div className="flex flex-col px-5">
            <label htmlFor="email" className="pl-3">E-mail</label>
            <input
              id="email"
              type="text"
              value={email}
              placeholder="Type your e-mail.."
              onChange={(e) => setEmail(e.target.value)}
              className="caret-[#818181] border border-[#818181]text-sm rounded-[16px] h-8 pl-3 focus:border-[#610000] focus:ring-0 focus:outline-none "
            />
          </div>

          <div className="flex flex-col px-5 my-3">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="caret-[#818181] border border-[#818181]text-sm rounded-[16px] h-8 pl-3 focus:border-[#610000] focus:ring-0 focus:outline-none"
              required
              placeholder="Type your username.."
            />
          </div>

          <div className="flex flex-col px-5">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="caret-[#818181] border border-[#818181]text-sm rounded-[16px] h-8 pl-3 focus:border-[#610000] focus:ring-0 focus:outline-none"
              required
              placeholder="********"
            />
          </div>
          <div className="flex justify-center items-center mt-5"><button
            className="hover:bg-[#be4422] w-60 text-center rounded-[16px] text-lg bg-[#D34C26] text-white h-[50px]"
            type="submit"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? <Spinner /> : 'Register'} {/* Show spinner when loading */}
          </button></div>
          {message && <p>{message}</p>}
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
