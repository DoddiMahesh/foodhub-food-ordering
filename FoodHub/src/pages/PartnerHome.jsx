import React, { useEffect, useState } from "react";
import { getMyRestaurants } from "../services/authapi";
import { Link } from "react-router-dom";
import Restaurants from "../components/Restaurants";

export default function PartnerHome() {

    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {

        try {

            setLoading(true);

            const data = await getMyRestaurants();

            console.log("MY RESTAURANTS:", data);

            setRestaurants(data);

        } catch (error) {

            console.error("RESTAURANT ERROR:", error);

            setError(error.message);

        } finally {

            setLoading(false);

        }
    };


    // LOADING

    if (loading) {
        return (
            <div className="text-center py-10 text-gray-500">
                Loading restaurants...
            </div>
        );
    }


    // ERROR

    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                {error}
            </div>
        );
    }


    return (

        <div className="px-6 pt-2 pb-10 bg-gray-50 min-h-screen">


            {/* BANNER */}

            <div className="w-full px-20 mb-10">

                <img
                    src="/images/Restaurant Banner.png"
                    alt="restaurant banner"
                    className="
                        block
                        w-full
                        h-55
                        sm:h-70
                        md:h-87.5
                        lg:h-100
                        object-cover
                        rounded-2xl
                    "
                />

            </div>


            {/* HEADING + ADD BUTTON */}

            <div className="flex items-center justify-between mb-6 pr-20">

                <h1
                    className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-gray-900
                        font-sans
                        pb-4
                        pl-20
                    "
                >
                    Restaurants
                </h1>


                <Link
                    to="/partner/restaurant/add"
                    className="
                        bg-orange-500
                        hover:bg-orange-600
                        text-white
                        font-semibold
                        w-72
                        text-center
                        px-6
                        py-3
                        rounded-lg
                        shadow-lg
                        transition
                    "
                >
                    + Add Restaurant
                </Link>

            </div>


            {/* RESTAURANT LIST */}

            <Restaurants
                restaurants={restaurants}
                isPartner={true}
            />

        </div>
    );
}