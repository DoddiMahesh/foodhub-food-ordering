import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function PartnerLoginCheck() {

    const navigate = useNavigate()

    useEffect(() => {

        const checkPartnerLogin = async () => {

            try {

                const response = await fetch(
                    "http://localhost:8000/api/auth/partner/profile/",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                )

                if (response.ok) {
                    navigate("/partner/home", { replace: true })
                } else {
                    navigate("/partnerLogin", { replace: true })
                }

            } catch (error) {

                console.error(error)
                navigate("/partnerLogin", { replace: true })

            }
        }

        checkPartnerLogin()

    }, [navigate])

    return null
}