import React, { useEffect, useState } from "react";
import { getAllRestaurants } from "../services/authapi";
import Restaurants from "../components/Restaurants";
import Category from '../components/Category'
import Quotation from '../components/Quotation'

export default function Home() {

  const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {

        try {

            setLoading(true);

            const data = await getAllRestaurants();
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
    <>
      <Quotation />
      <Category />
      
       <div className="px-6 pt-2 pb-10 bg-gray-50 ">

            {/* HEADING */}

            <div className="mb-6 px-20">

                <h1
                    className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-gray-900
                        font-sans
                    "
                >
                    Restaurants
                </h1>

            </div>


            {/* REUSABLE RESTAURANT LIST */}

            <Restaurants
                restaurants={restaurants}
                isPartner={false}
            />

        </div>
    </>
  )
}
