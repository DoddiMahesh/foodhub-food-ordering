import React, { useState } from 'react'
import {Formik, Form, Field, ErrorMessage } from "formik"
import *as Yup from "yup"
import {Eye, EyeOff} from "lucide-react"
import { customerRegister,partnerRegister } from "../services/authapi"
import {Link} from 'react-router-dom'

export default function RegisterForm({type}) {
    const [showPassword, setShowPassword]=useState(false)
    const[showconfirmPassword,setShowconfirmPassword]=useState(false)
    const[backendError,setBackendError]=useState("")

    const isCustomer=type==="customer"
    const initialValues = {
        ...(isCustomer ? {phone_number:""} : {email:""}),
        name:"",
        password:"",
        confirm_password:""
    }
    const validationSchema=Yup.object({
        ...(isCustomer ? {
            phone_number:Yup.string()
            .required("phone number is required")
            .matches(/^[6-9]\d{9}$/,"Enter a valid phone number"),
        }:{
            email:Yup.string()
            .required("Email is required")
            .email("Enter a valid email")
        }),
        name: Yup.string()
        .trim()
        .required("Name is required")
        .min(3, "Name must be at least 3 characters")
        .max(20, "Name must not exceed 20 characters")
        .matches(/^[A-Za-z ]+$/,"Name can contain only letters"),
        
        password:Yup.string()
        .required("Password is required")
        .min(6,"Password must be at least 6 charecters"),
        confirm_password:Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password")],"Password must mach")
    })
    const handleSubmit = async (values, { setSubmitting }) => {
            setBackendError("")
        try {
            let data
            if(isCustomer){

                data = await customerRegister({
                    name: values.name,
                    phone_number: values.phone_number,
                    password: values.password
                });
            } else {
                data = await partnerRegister({name:values.name,email:values.email, password:values.password})
            }

            console.log("Registration successful:", data);

        } catch (error) {

            console.error("Registration failed:", error);
            if(error.phone_number){
                setBackendError(error.phone_number[0])
            }
            else if(error.email){
                setBackendError(error.email[0])
            }
            else if(error.name){
                setBackendError(error.name)
            }
            else if(error.detail){
                setBackendError(error.detail)
            }
            else if(error.message){
                setBackendError(error.message)
            }
            else{
                setBackendError("Registration failed. please try again.")
            }

        } finally {

            setSubmitting(false);

        }
    };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-15'>
      <div className='bg-white w-full max-w-md p-8 rounded-2xl shadow-lg'>
        <h1 className='text-3xl font-bold text-center text-gray-800 mb-8'>sign up</h1>
        <Formik 
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({isSubmitting})=>(
                <Form className='space-y-6'>
                    <div>
                        <label className='black text-gray-700 font-medium mb-2'>Name</label>
                        <Field type="taxt" name="name" 
                            placeholder="Enter name"
                            className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />                
                        <ErrorMessage name="name" component="p" 
                            className='text-red-500 text-sm mt-1'
                        />

                    </div>
                    <div>
                        <label className='black text-gray-700 font-medium mb-2'>{isCustomer ? "Phone Number":"Email"}</label>
                        <Field type={isCustomer ? "text":"email"} name={isCustomer ? "phone_number":"email"} 
                            placeholder={isCustomer ? "Enter phone number":"Enter email"} 
                            className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />                
                        <ErrorMessage name={isCustomer ? "phone_number":"email"} component="p" 
                            className='text-red-500 text-sm mt-1'
                        />

                    </div>
                    <div>
                        <label className='black text-gray-700 font-medium mb-2'>Password</label>
                        <div className='relative'>
                            <Field type={showPassword ? "text" : "password"} name="password" placeholder="Enter password" 
                                className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />
                            <button type='button' onClick={()=> setShowPassword(!showPassword)} 
                                className='absolute right-3 top-1/2 -translate-1/2 text-gray-500'    
                            >
                                {showPassword ? (<EyeOff size={20} />)
                                    :(<Eye size={20} />)                            
                                }
                            </button>
                        </div>
                        <ErrorMessage name="password" component="p" className='text-red-500 text-sm mt-1'/>
                    </div>
                    <div>
                        <label className='black text-gray-700 font-medium mb-2'>Confirm Password</label>
                        <div className='relative'>
                            <Field type={showconfirmPassword ? "text" : "password"} name="confirm_password" placeholder="Confirm password" 
                                className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />
                            <button type='button' onClick={()=> setShowconfirmPassword(!showconfirmPassword)} 
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'     
                            >
                                {showconfirmPassword ? (<EyeOff size={20} />)
                                    :(<Eye size={20} />)                            
                                }
                            </button>
                        </div>
                        <ErrorMessage name="confirm_password" component="p" className='text-red-500 text-sm mt-1'/>
                    </div>
                    {backendError && (
                        <p className='text-red-500 text-sm text-center'>{backendError}</p>
                    )}
                    <button type='submit' disabled={isSubmitting}
                        className='w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition'
                    >{isSubmitting ? "Signing up...":"Sign Up"}</button>
                </Form>
            )}
        </Formik>
        <div className="text-center mt-4">
            <span className="text-gray-600">
                Already have an account?{" "}
            </span>

            <Link
                to={isCustomer ? "/login":"/partnerLogin"}
                className="text-orange-500 font-semibold hover:underline"
            >
                Login
            </Link>
        </div>
      </div>
    </div>
  )
}
