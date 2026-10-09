import React, { useState } from 'react'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from "yup"
import {Eye, EyeOff} from "lucide-react"
import { customerLogin,parentLogin  } from '../services/authapi'
import {Link, useNavigate} from 'react-router-dom'

export default function LoginForm({type}) {
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const isCustomer=type==="customer"
    const initialValues = {[isCustomer ? "phone_number":"email"]:"",    
        password:""
    }

    const validationSchema = Yup.object({[isCustomer ? "phone_number":"email"]:isCustomer ?       
        Yup.string()
            .required("Phone number is required")
            .matches(
                /^[6-9]\d{9}$/,
                "Enter a valid phone number"
            ) : Yup.string()
                .required("Email is require")
                .email("Enter a valid email"),
        password:Yup.string()
        .required("Password is required")
        .min(6,"Password must be at least 6 characters")
        
    })

    const handleSubmit = async (values,{setSubmitting,setStatus}) => {
        try {
            setStatus("")
            
            let data
            if(isCustomer){
                data = await customerLogin(values);
                console.log("Customer login successful:",data)
                navigate("/")
            } else {
                data = await parentLogin(values)
                console.log("Partner login successful:",data)
                navigate("/partner/home")
            }
       
            
        } catch (error) {
            console.error("Login failed:", error);
            setStatus(error.message)
        } finally {setSubmitting(false)}

};
    
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white w-full max-w-md p-8 rounded-2xl shadow-lg'>
        <h1 className='text-3xl font-bold text-center text-gray-800 mb-8'>Login</h1>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({isSubmitting,status})=>(
                <Form className='space-y-6'>
                    
                    <div>
                        <label className='black text-gray-700 font-medium mb-2'>{isCustomer ? "Phone Number":"email"}</label>
                        <Field
                            type={isCustomer ? "text" : 'email'}
                            name={isCustomer ? "phone_number" : "email"}
                            placeholder={isCustomer ? "Enter phone number" : "Enter email"}
                            className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                        <ErrorMessage
                            name={isCustomer ? "phone_number" : "email"}
                            component="p"
                            className='text-red-500 text-sm mt-1'

                        />
                    </div>
                    <div>
                        <label className='black text-gray-700 font-medium mb-2'>Password</label>
                        <div className='relative'>
                            <Field 
                                type={showPassword ? "text":"password"}
                                name="password"
                                placeholder="Enter password"
                                className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />
                            <button type='button'
                                onClick={()=> setShowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 -translate-1/2 text-gray-500'
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ):(
                                    <Eye size={20} />
                                )}
                            </button> 
                            <ErrorMessage
                                name="password"
                                component="p"
                                className='text-red-500 text-sm mt-1'
                            />
                        </div>
                    </div>
                    {status && (
                        <p className="text-red-500 text-sm">{status}</p>
                    )}
                    <button type='submit' disabled={isSubmitting} 
                        className='w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition'
                    >{isSubmitting ? "Logging in .." : "Login"}</button>
                </Form>
            )}
        </Formik>
        <div className="text-center mt-4">
            <span className="text-gray-600">
                New to FoodHub?{" "}
            </span>

            <Link
                to={isCustomer ? "/signup":"/partnerSignup"}
                className="text-orange-500 font-semibold hover:underline"
            >
                Create account
            </Link>
        </div>
      </div>      
    </div>
  )
}

