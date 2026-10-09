import React from 'react'
import {useNavigate} from 'react-router-dom'
import { addRestaurant } from '../services/authapi'
import RestaurantForm from '../components/RestaurantForm'

export default function AddRestaurant() {
    const navigate=useNavigate()
    const initialValues={
        name:"",
        address:"",
        city:"",
        state:"",
        pincode:"",
        food_types:[],
        description:"",
        image:null
    }
    const handleSubmit=async(values,{setSubmitting,setStatus})=>{
        try{
            const formData=new FormData()
            formData.append("name",values.name)
            formData.append("address",values.address)
            formData.append("city",values.city)
            formData.append("state",values.state)
            formData.append("pincode",values.pincode)
            formData.append("food_types", JSON.stringify(values.food_types))
            formData.append("description",values.description)

            if(values.image){
                formData.append("image",values.image)
            }
            await addRestaurant(formData)
            navigate("/partner/restaurants")
        } catch(error){
            console.error("Add restaurant error")
            setStatus(error.message)
        } finally{
            setSubmitting(false)
        }
    }
    
  return (
    <RestaurantForm initialValues={initialValues} onSubmit={handleSubmit} isEdit={false} />
  )
}
