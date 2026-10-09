import React, { useEffect, useState } from 'react'
import{useNavigate,useParams} from'react-router-dom'
import RestaurantForm from '../components/RestaurantForm'
import {getRestaurant,updateRestaurant} from '../services/authapi'

export default function UpdateRestaurant() {
    const{id} = useParams()
    const navigate = useNavigate()

    const[initialValues,setInitialValues]=useState({
        name:"",
        address:"",
        city:"",
        state:"",
        pincode:"",
        food_types:[],
        description:"",
        image:null
    })
    const[loading,setLoading] = useState(true)
    const[error,setError] = useState("")

    useEffect(()=>{
        fetchRestaurant()
    },[id])

    const fetchRestaurant = async ()=>{
        try{
            setLoading(true)
            setError("")
            const data = await getRestaurant(id)

            setInitialValues({
                name:data.name || "",
                address:data.address || "",
                city:data.city || "",
                state:data.state || "",
                pincode:data.pincode || "",
                food_types:data.food_types || [],
                description:data.description || "",
                image:null
            })
        } catch(error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async(values,{setSubmitting,setStatus})=>{
        try{
            setStatus("")

            const formData=new FormData()
            formData.append("name",values.name)
            formData.append("address",values.address)
            formData.append("city",values.city)
            formData.append("state",values.state)
            formData.append("pincode",values.pincode)
            formData.append("food_types", JSON.stringify(values.food_types))
            formData.append("description",values.description)
            if (values.image) {
                formData.append("image", values.image);
            }
            await updateRestaurant(id, formData);
            navigate("/partner/restaurants");
        } catch(error){
            setStatus(error.message)
        } finally{
            setSubmitting(false)
        }
    }
    if(loading){
        return(
            <div className='min-h-screen flex justify-center items-center'>
                <p className='text-gray-600 text-lg'>Loading restaurant...</p>
            </div>
        )
    }
    if(error){
        return(
            <div className='min-h-screen flex justify-center items-center'>
                <p className='text-gray-600 text-lg'>{error}</p>
            </div>
        )
    }

  return (
    <RestaurantForm initialValues={initialValues} onSubmit={handleUpdate} isEdit={true}/>
  )
}
