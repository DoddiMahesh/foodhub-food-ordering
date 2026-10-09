import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Restaurants from '../components/Restaurants'

export default function SearchResult() {

    const [searchParams] = useSearchParams()

    const search = searchParams.get("search") || ""

    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    useEffect(() => {

        const searchRestaurants = async () => {

            try {

                setLoading(true)
                setError("")

                const url =
                    `http://localhost:8000/api/auth/customer/restaurants/search/?search=${encodeURIComponent(search)}`

                console.log("Search URL:", url)

                const response = await fetch(url)

                console.log("Response status:", response.status)

                if (!response.ok) {
                    throw new Error(
                        `Search API error: ${response.status}`
                    )
                }

                const data = await response.json()

                console.log("Search data:", data)

                setRestaurants(data)

            } catch (error) {

                console.error("Search error:", error)

                setError("Unable to search restaurants")

                setRestaurants([])

            } finally {

                setLoading(false)

            }
        }


        if (search.trim()) {
            searchRestaurants()
        } else {
            setRestaurants([])
            setLoading(false)
        }

    }, [search])


    if (loading) {

        return (

            <div className="text-center py-20">

                <h2 className="text-xl font-semibold">
                    Searching...
                </h2>

            </div>

        )
    }


    if (error) {

        return (

            <div className="text-center py-20">

                <h2 className="text-xl font-semibold text-red-500">
                    {error}
                </h2>

            </div>

        )
    }


    return (

        <div className="min-h-screen bg-gray-50 py-10">

            <div className="px-20 mb-8">

                <h1 className="text-2xl font-bold text-gray-800">
                    Search Results
                </h1>

                <p className="text-gray-500 mt-2">
                    Results for "{search}"
                </p>

            </div>


            <Restaurants
                restaurants={restaurants}
                isPartner={false}
            />

        </div>

    )
}