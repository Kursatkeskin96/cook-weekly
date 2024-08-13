"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "@/utils/images/logo.png";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ClipLoader } from "react-spinners";

const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(4, "Password must have than 4 characters"),
});

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loginError, setLoginError] = useState("");

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (signInData?.error) {
      setIsLoading(false);
      setLoginError("Username or password is wrong.");
      console.log(loginError);
    } else {
      setIsLoading(false);
      router.push("/");
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-start md:items-center lg:pt-0 md:pt-0 lg:items-center pt-20">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white h-fit py-10 w-[90%] md:w-[70%] lg:w-[450px] rounded-[16px]"
      >
        <div className="flex-col">
          <Link href="/">
            <div className="flex justify-center items-center">
              <Image src={logo} alt="logo" width={80} height={80} />
            </div>
          </Link>
          <h3 className="text-center font-bold text-xl mt-">Welcome Back</h3>
          <p className="text-[#787878] text-center text-sm">
            Please enter your details to login
          </p>
          <div className="px-8">
            <hr className="w-[100%] h-[1px] mx-auto my-6 bg-[#cecece] border-0 rounded"></hr>
          </div>

          {loginError && (
            <div className="px-8">
               <p className="text-red-700 mt-5 w-full mx-auto h-10 flex justify-center text-sm items-center rounded-[8px] bg-red-50 border-red-700 border-[0.8px] text-center">
              {loginError}
            </p>
            </div>
          )}
          <div className="flex flex-col px-8 my-4">
            <label htmlFor="email" className="text-[#787878]">
              E-mail
            </label>
            <input
              id="email"
              type="text"
              {...form.register("email")} // Bind the input field
              placeholder="Type your e-mail.."
              className="caret-[#818181] border border-[#cecece] text-sm rounded-[8px] h-10 pl-3 focus:border-[#610000] focus:ring-0 focus:outline-none "
            />
          </div>

          <div className="flex flex-col px-8 pb-4">
            <label htmlFor="email" className=" text-[#787878]">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...form.register("password")} // Bind the input field
              className="caret-[#818181] border border-[#cecece] text-sm rounded-[8px] h-10 pl-3 focus:border-[#610000] focus:ring-0 focus:outline-none "
              required
              placeholder="********"
            />
          </div>
          <div className="flex justify-center items-center mt-5 px-8">
            {isLoading ? (
              <button
                className=" tracking-wide w-full text-center rounded-[8px] bg-gray-400 flex justify-center items-center gap-2 text-white h-10"
                type="submit"
                disabled
              >
              <ClipLoader size={20} color={"#fff"} /> 
              </button>
            ) : (
              <button
                className="hover:bg-[#be4422] tracking-wide w-full text-center rounded-[8px] bg-[#D34C26] text-white h-10"
                type="submit"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
