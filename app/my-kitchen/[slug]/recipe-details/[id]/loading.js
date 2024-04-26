"use client";
import React from "react";
import { BallTriangle } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="pt-20 h-screen flex justify-center items-center">
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#610000"
        ariaLabel="ball-triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
}
