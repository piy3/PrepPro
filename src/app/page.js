"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";
import { authUser, login, registerUser } from "@/api/requests";
import toast from "react-hot-toast";
import { useAuth } from "@/store/useAuth";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [validationLoading, setValidationLoading] = useState(false);
  const { login: loginToStore } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      if(isLogin){
          const res = await login(formData);
        // console.log("res:",res);
        if (res.data.success && typeof window !== "undefined") {
          toast.success("Login Successful");
          loginToStore(res.data);
          window.location.href = "/home";
        } else {
          toast.error(res.data.message);
        }
      }else{
        const data = {
          fullname:formData.name,
          email:formData.email,
          password:formData.password
        }
        const res = await registerUser(data);
        if (res.data.success && typeof window !== "undefined") {
          toast.success("Registration Successful");
          loginToStore(res.data);
          window.location.href = "/home";
        } else {
          toast.error(res.data.message);
        }
      }
      // Simulate API call
     
      setIsLoading(false);
    }
  };

  // useLayoutEffect(() => {
  //   const validateCookie = async () => {
  //     if (typeof window !== 'undefined') {
  //       const res = await authUser();
  //       console.log("auth res:", res);
  //       if (res.data.success && typeof window !== 'undefined') {
  //         window.location.href = "/home";
  //       }
  //       setValidationLoading(false)
  //     }
  //   }

  //   validateCookie();
  // }, [])

  // if (validationLoading) {
  //   return (
  //     <>
  //       <div className=" h-screen w-full flex items-center justify-center">
  //         <div>Loading....</div>
  //       </div>
  //     </>
  //   )
  // }

  return (
    <>
      {validationLoading ? (
        <div className=" h-screen w-full flex items-center justify-center">
          <div>Loading....</div>
        </div>
      ) : (
        <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
          <div className="absolute top-4 right-4">
            <ModeToggle />
          </div>
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Hero section */}
              <div className="text-center lg:text-left">
                <h1 className="text-5xl font-bold text-indigo-900 dark:text-indigo-200 mb-6">
                  Welcome to{" "}
                  <span className="text-indigo-600 dark:text-indigo-400">
                    PrepPro
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Your all-in-one platform for placement preparation. Ace your
                  interviews with our comprehensive resources and mock tests.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-2 mr-4">
                      <svg
                        className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Practice with real interview questions
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-2 mr-4">
                      <svg
                        className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Track your progress and improve
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-2 mr-4">
                      <svg
                        className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Get personalized recommendations
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side - Form */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {isLogin ? "Sign in to your account" : "Create an account"}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                    >
                      {isLogin ? "Create account" : "Sign in instead"}
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.name
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-700"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Password
                      </label>
                      {isLogin && (
                        <Link
                          href="/forgot-password"
                          className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          Forgot password?
                        </Link>
                      )}
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.password
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {!isLogin && (
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-700"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="••••••••"
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : isLogin ? (
                      "Sign in"
                    ) : (
                      "Sign up"
                    )}
                  </button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.16 20 14.416 20 10c0-5.523-4.477-10-10-10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg
                        className="w-5 h-5 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.16 20 14.416 20 10c0-5.523-4.477-10-10-10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
