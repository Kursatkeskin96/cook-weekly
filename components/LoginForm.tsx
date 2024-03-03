"use client";

import Image from "next/image";
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import logo from "@/utils/images/logo.png";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useState } from "react";

const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(4, 'Password must have than 4 characters'),
});

const LoginForm = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  }
  );

  const [loginError, setLoginError] = useState('');

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    })
    if(signInData?.error){
      setLoginError('Username or password is wrong.');
      console.log(loginError)
    } else {
      router.push('/')
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-start md:items-center lg:pt-0 md:pt-0 lg:items-center pt-20">
      <form
       onSubmit={form.handleSubmit(onSubmit)} 
        className="bg-white h-fit lg:my-10 md:my-10 pb-5 w-[90%] md:w-[70%] lg:w-[400px] rounded-[16px]"
      >
        <div className="flex-col">
          <div className="flex justify-center items-center mt-5">
            {" "}
            <Image src={logo} alt="logo" width={80} height={80} />
          </div>
          <h3 className="text-center font-bold text-xl mt-2">Welcome Back</h3>
          <p className="text-[#646464] text-center">
          Please enter your details to login
          </p>

          <hr className="w-[90%] h-[1px] mx-auto my-4 bg-[#610000] border-0 rounded"></hr>
          
          {loginError && <p className="text-white mt-5 w-[89%] mx-auto py-1 bg-red-700 text-center">{loginError}</p>}
          <div className="flex flex-col px-5 my-4">
            <label htmlFor="email" className="pl-3">E-mail</label>
            <input
              id="email"
              type="text"
              {...form.register('email')} // Bind the input field
              placeholder="Type your e-mail.."
              className="caret-[#818181] border border-[#818181]text-sm rounded-[16px] h-8 pl-3 focus:border-[#610000] focus:ring-0 focus:outline-none "
            />
          </div>

          <div className="flex flex-col px-5 pb-4">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...form.register('password')} // Bind the input field
              className="caret-[#818181] border border-[#818181]text-sm rounded-[16px] h-8 pl-3 focus:border-[#610000] focus:ring-0 focus:outline-none"
              required
              placeholder="********"
            />
          </div>
          <div className="flex justify-center items-center mt-5"><button
            className="hover:bg-[#be4422] w-60 text-center rounded-[16px] text-lg bg-[#D34C26] text-white h-[50px]"
            type="submit"
          >
            Login
          </button></div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
