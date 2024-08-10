"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { getRequestContext } from "@cloudflare/next-on-pages";

import { Turnstile } from "@marsidev/react-turnstile";

type LoginAnswer = {
  username: string;
  password: string;
  token: string;
  validation: boolean;
  errors: string;
};

export default function Home() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    "cf-turnstile-response": "",
  });

  const [hideSubmit, setHideSubmit] = useState<boolean>(true);
  const [hideTurnstile, setHideTurnstile] = useState<boolean>(true);

  const [validStatus, setValidStatus] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await axios.post<LoginAnswer>("/api/login", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Form data submitted:", data);
    if (data.validation) {
      setValidStatus("Validation Success");
    } else {
      setValidStatus("Validation Failed: " + data.errors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form action="/api/login" method="POST" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <Turnstile
            siteKey={getRequestContext().env.TURNSTILE_SITE_KEY}
            onSuccess={(token: string) => {
              console.log("TOKEN: ", token);
              setFormData((prevData) => ({
                ...prevData,
                "cf-turnstile-response": token,
              }));
              setHideSubmit(false);
            }}
            onError={() => {
              setHideSubmit(true);
            }}
            onUnsupported={() => {
              setHideSubmit(false);
            }}
            onWidgetLoad={() => {
              setHideSubmit(true);
              setHideTurnstile(false);
            }}
            hidden={hideTurnstile}
          />
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              hidden={hideSubmit}
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="text-pretty text-3xl text-orange-500">
          {validStatus}
        </div>
      </div>
    </div>
  );
}
