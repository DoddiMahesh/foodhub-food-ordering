import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function AdressForm() {

    const location = useLocation()
    const navigate = useNavigate()

    // If addressId exists, update the existing address
    // If addressId does not exist, create a new address
    const addressId = location.state?.addressId

    const [formData, setFormData] = useState({
        flat_no: "",
        area: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    // Handle input changes
    const handleChange = (e) => {

        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Submit address
    const handleSubmit = async (e) => {

        e.preventDefault()

        setLoading(true)
        setMessage("")
        setError("")

        try {

            // If addressId exists -> UPDATE
            // Otherwise -> ADD
            const url = addressId
                ? `http://localhost:8000/api/auth/customer/address/${addressId}/`
                : "http://localhost:8000/api/auth/customer/address/"

            const method = addressId ? "PATCH" : "POST"

            const response = await fetch(url, {
                method: method,

                headers: {
                    "Content-Type": "application/json",
                },

                // Sends Django session cookie
                credentials: "include",

                body: JSON.stringify({
                    flat_no: formData.flat_no,
                    area: formData.area,
                    landmark: formData.landmark,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                }),
            })

            const data = await response.json()

            console.log("Backend response:", data)

            if (!response.ok) {

                console.log("Backend error:", data)

                setError(
                    data.error ||
                    data.detail ||
                    "Failed to save address"
                )

                return
            }

            // Success
            console.log(
                addressId
                    ? "Address replaced:"
                    : "Address added:",
                data
            )

            setMessage(
                addressId
                    ? "Address replaced successfully!"
                    : "Address added successfully!"
            )

            // Clear form
            setFormData({
                flat_no: "",
                area: "",
                landmark: "",
                city: "",
                state: "",
                pincode: "",
            })

            // After successful save, go back to delivery address page
            setTimeout(() => {
                navigate("/cart")
            }, 1000)

        } catch (error) {

            console.error("Error saving address:", error)

            setError("Unable to connect to the server.")

        } finally {

            setLoading(false)
        }
    }

    return (

        <div className="min-h-screen bg-gray-50 py-10 px-4">

            <div className="max-w-xl mx-auto">

                <div className="bg-white rounded-xl shadow-md p-6">

                    {/* HEADING */}

                    <h2 className="text-2xl font-bold text-gray-800 pb-5 text-center">
                        {addressId
                            ? "Update Delivery Address"
                            : "Add Delivery Address"}
                    </h2>


                    <form onSubmit={handleSubmit}>

                        {/* FLAT NO */}

                        <div className="mb-4">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Flat / Door No
                            </label>

                            <input
                                type="text"
                                name="flat_no"
                                value={formData.flat_no}
                                onChange={handleChange}
                                placeholder="Enter flat / house number"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                required
                            />

                        </div>


                        {/* AREA */}

                        <div className="mb-4">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Area
                            </label>

                            <input
                                type="text"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                placeholder="Enter area / locality"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                required
                            />

                        </div>


                        {/* LANDMARK */}

                        <div className="mb-4">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Landmark
                            </label>

                            <input
                                type="text"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleChange}
                                placeholder="Enter nearby landmark"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />

                        </div>


                        {/* CITY */}

                        <div className="mb-4">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                City
                            </label>

                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Enter city"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                required
                            />

                        </div>


                        {/* STATE */}

                        <div className="mb-4">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                State
                            </label>

                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="Enter state"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                required
                            />

                        </div>


                        {/* PINCODE */}

                        <div className="mb-5">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Pincode
                            </label>

                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="Enter 6-digit pincode"
                                maxLength="6"
                                inputMode="numeric"
                                pattern="[0-9]{6}"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                required
                            />

                        </div>


                        {/* SUCCESS MESSAGE */}

                        {message && (

                            <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-600 text-sm font-medium">
                                {message}
                            </div>

                        )}


                        {/* ERROR MESSAGE */}

                        {error && (

                            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
                                {error}
                            </div>

                        )}


                        {/* SAVE BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
                        >

                            {loading
                                ? "Saving..."
                                : addressId
                                    ? "Replace Address"
                                    : "Save Address"}

                        </button>

                    </form>

                </div>

            </div>

        </div>
    )
}