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
               className="bg-white h-fit py-10 w-[90%] md:w-[70%] lg:w-[450px] rounded-[16px]"
      >
        <div className="flex-col">
          <Link href='/'>
          <div className="flex justify-center items-center">
            <Image src={logo} alt="logo" width={80} height={80} />
          </div>
          </Link>
          <h3 className="text-center font-bold text-xl mt-2">Welcome Chef</h3>
          <p className="text-[#787878] text-center text-sm">
            Please enter your details to register
          </p>
          
          <div className="px-8">

          <hr className="w-[100%] h-[1px] mx-auto my-6 bg-[#cecece] border-0 rounded"></hr>
          </div>


          <div className="flex flex-col px-8 my-4">
          <label htmlFor="email" className="text-[#787878]">E-mail</label>
            <input
              id="email"
              type="text"
              value={email}
              placeholder="Type your e-mail.."
              onChange={(e) => setEmail(e.target.value)}
                 className="caret-[#818181] border border-[#cecece] text-sm rounded-[8px] h-10 pl-3 focus:border-[#610000] focus:ring-0 focus:outline-none "
            />
          </div>

          <div className="flex flex-col px-8 my-3">
            <label htmlFor="username"  className="text-[#787878]">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
   className="caret-[#818181] border border-[#cecece] text-sm rounded-[8px] h-10 pl-3 focus:border-[#610000] focus:ring-0 focus:outline-none "
              required
              placeholder="Type your username.."
            />
          </div>

          <div className="flex flex-col px-8 pb-4">
            <label htmlFor="password"  className="text-[#787878]">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
                 className="caret-[#818181] border border-[#cecece] text-sm rounded-[8px] h-10 pl-3 focus:border-[#610000] focus:ring-0 focus:outline-none "
              required
              placeholder="********"
            />
          </div>
          <div className="flex justify-center items-center mt-5 px-8"><button
             className="hover:bg-[#be4422] tracking-wide w-full text-center rounded-[8px] bg-[#D34C26] text-white h-10"
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
