import React from "react";
import { useNavigate } from "react-router-dom";

const IMAGE_URL = "http://localhost:8000";

export default function Restaurants({
    restaurants,
    isPartner = false
}) {

    const navigate = useNavigate();

    if (!restaurants || restaurants.length === 0) {
        return (
            <div className="text-center py-16">

                <h2 className="text-2xl font-bold text-gray-700">
                    No restaurants available 🍽️
                </h2>

                <p className="text-gray-500 mt-2">
                    Please check again later.
                </p>

            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9 px-20">

            {restaurants.map((restaurant) => (

                <div
                    key={restaurant.id}
                    onClick={() => {

                        if (isPartner) {

                            navigate(
                                `/partner/restaurant/${restaurant.id}`
                            );

                        } else {

                            navigate(
                                `/restaurant/${restaurant.id}`
                            );

                        }

                    }}
                    className="
                        bg-white
                        rounded-xl
                        overflow-hidden
                        hover:shadow-lg
                        transition
                        duration-300
                        cursor-pointer
                    "
                >

                    {/* RESTAURANT IMAGE */}

                    {restaurant.image ? (

                        <img
                            src={
                                restaurant.image.startsWith("http")
                                    ? restaurant.image
                                    : `${IMAGE_URL}${restaurant.image}`
                            }
                            alt={restaurant.name}
                            className="
                                w-full
                                h-44
                                object-cover
                                p-3
                                rounded-4xl
                            "
                        />

                    ) : (

                        <div
                            className="
                                w-full
                                h-44
                                bg-gray-200
                                flex
                                items-center
                                justify-center
                                text-gray-500
                            "
                        >
                            No Image
                        </div>

                    )}


                    {/* RESTAURANT DETAILS */}

                    <div className="px-4 pb-5">

                        {/* NAME */}

                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-gray-800
                                truncate
                            "
                        >
                            {restaurant.name}
                        </h2>


                        {/* FOOD TYPES */}

                        <p className="text-sm text-gray-500 pt-1">

                            {Array.isArray(restaurant.food_types)
                                ? restaurant.food_types.join(", ")
                                : restaurant.food_types}

                        </p>


                        {/* ADDRESS */}

                        <p
                            className="
                                text-sm
                                text-gray-500
                                line-clamp-2
                                mt-1
                            "
                        >
                            {restaurant.address}
                        </p>


                        {/* CITY / STATE */}

                        <p className="text-sm text-gray-500 mt-1">

                            {restaurant.city}, {restaurant.state}

                        </p>

                    </div>

                </div>

            ))}

        </div>
    );
}