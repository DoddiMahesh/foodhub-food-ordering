import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function DeliveryAddress() {

    const navigate = useNavigate()

    const [address, setAddress] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        fetch("http://localhost:8000/api/auth/customer/address/", {
            method: "GET",
            credentials: "include",
        })
            .then(response => response.json())
            .then(data => {

                console.log("Address:", data)

                if (Array.isArray(data) && data.length > 0) {
                    setAddress(data[0])
                } else {
                    setAddress(null)
                }

                setLoading(false)
            })
            .catch(error => {

                console.log("Address error:", error)

                setAddress(null)
                setLoading(false)
            })

    }, [])

    const handleAddress = () => {

        if (address) {

            navigate("/address", {
                state: {
                    addressId: address.id
                }
            })

        } else {

            navigate("/address")
        }
    }

    return (
        <section className="w-full bg-gray-50">

            <div className="mx-auto px-5 py-8 max-w-6xl">

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

                    <h1 className="text-2xl font-bold text-gray-800">
                        Delivery Address
                    </h1>

                    {loading && (
                        <p className="mt-5 text-gray-500">
                            Loading address...
                        </p>
                    )}

                    {!loading && address && (

                        <div className="mt-5 text-gray-700 leading-7 pl-5">

                            <p>
                                <span className="font-semibold">
                                    Door / House No:
                                </span>{" "}
                                {address.flat_no},{" "}
                                {address.area},{" "}
                                {address.landmark}
                            </p>

                            <p>
                                {address.city},{" "}
                                {address.state} -{" "}
                                {address.pincode}
                            </p>

                        </div>

                    )}

                    {!loading && !address && (

                        <p className="mt-5 text-gray-500">
                            No delivery address added yet.
                        </p>

                    )}

                    {!loading && (

                        <button
                            onClick={handleAddress}
                            className="text-sm font-bold border-2 rounded-lg px-3 py-1.5 border-green-600 text-green-600 hover:bg-green-600 hover:text-white w-36 cursor-pointer mt-6 ml-5"
                        >
                            Add New
                        </button>

                    )}

                </div>

            </div>

        </section>
    )
}