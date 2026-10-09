import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import CustomerOrders from "../pages/CustomerOrders"

export default function Profile() {

    const navigate = useNavigate()
    const location = useLocation()

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loggingOut, setLoggingOut] = useState(false)

    const isPartner =
        location.pathname === "/partner/profile"


    useEffect(() => {

        const getProfile = async () => {

            try {

                const url = isPartner
                    ? "http://localhost:8000/api/auth/partner/profile/"
                    : "http://localhost:8000/api/auth/customer/profile/"

                const response = await fetch(url, {
                    method: "GET",
                    credentials: "include",
                })

                if (response.status === 401) {

                    navigate(
                        isPartner
                            ? "/partner/login"
                            : "/login"
                    )

                    return
                }

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(
                        data.message || "Something went wrong"
                    )
                }

                setUser(data)

            } catch (error) {

                console.error("Profile error:", error)

            } finally {

                setLoading(false)

            }
        }

        getProfile()

    }, [isPartner, navigate])


    // Logout directly from Profile
    const handleLogout = async () => {

        setLoggingOut(true)

        try {

            const url = isPartner
                ? "http://localhost:8000/api/auth/partner/logout/"
                : "http://localhost:8000/api/auth/customer/logout/"

            const response = await fetch(url, {
                method: "POST",
                credentials: "include",
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || "Logout failed"
                )
            }

            // Clear customer cart
            if (!isPartner) {
                localStorage.removeItem("cart")
            }

            // Go directly to login page
            navigate(
                isPartner
                    ? "/"
                    : "/login",
                { replace: true }
            )

        } catch (error) {

            console.error("Logout error:", error)

            alert("Logout failed. Please try again.")

            setLoggingOut(false)
        }
    }


    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">

                <p className="text-slate-600">
                    Loading...
                </p>

            </div>
        )
    }


    return (
        <div className="min-h-screen bg-gray-50 px-6 py-5">

            <div className="max-w-6xl mx-auto">

                {user && (

                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-7">

                        <div className="flex items-center justify-between gap-6">

                            {/* Profile Information */}

                            <div>

                                <h2 className="text-2xl font-bold text-slate-800">
                                    {user.name?.charAt(0).toUpperCase()}
                                    {user.name?.slice(1)}
                                </h2>

                                <p className="text-slate-500 text-base mt-2">
                                    {isPartner
                                        ? user.email
                                        : user.phone_number
                                    }
                                </p>

                            </div>


                            {/* Logout Button */}

                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="px-5 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-50"
                            >
                                {loggingOut
                                    ? "Logging out..."
                                    : "Logout"
                                }
                            </button>

                        </div>

                    </div>

                )}

            </div>
            {!isPartner && <CustomerOrders />}
        </div>
    )
}