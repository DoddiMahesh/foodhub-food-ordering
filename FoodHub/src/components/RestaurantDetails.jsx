import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { deleteRestaurant } from "../services/authapi";
import DishList from "./DishList";

export default function RestaurantDetails({ isPartner = false }) {

    const [restaurant, setRestaurant] = useState(null);
    const [dishes, setDishes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [dishLoading, setDishLoading] = useState(true);

    const [error, setError] = useState("");
    const [dishError, setDishError] = useState("");

    const [deleting, setDeleting] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();


    // ==========================================
    // FETCH RESTAURANT + DISHES
    // ==========================================

    useEffect(() => {

        fetchRestaurant();
        fetchDishes();

    }, [id, isPartner]);


    // ==========================================
    // GET RESTAURANT DETAILS
    // ==========================================

    const fetchRestaurant = async () => {

        try {

            setLoading(true);
            setError("");

            const endpoint = isPartner
                ? `http://localhost:8000/api/auth/partner/restaurant/${id}/`
                : `http://localhost:8000/api/auth/customer/restaurant/${id}/`;

            const response = await fetch(
                endpoint,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load restaurant");
            }

            const data = await response.json();
            setRestaurant(data);

        } catch (error) {

            console.error("RESTAURANT ERROR:", error);

            setError(error.message);

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // GET ALL DISHES
    // ==========================================

    const fetchDishes = async () => {

        try {

            setDishLoading(true);
            setDishError("");

            const endpoint = isPartner
                ? `http://localhost:8000/api/auth/partner/restaurant/${id}/dishes/`
                : `http://localhost:8000/api/auth/customer/restaurant/${id}/dishes/`;

            const response = await fetch(
                endpoint,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load dishes");
            }

            const data = await response.json();
            setDishes(data);

        } catch (error) {

            console.error("DISH ERROR:", error);

            setDishError(error.message);

        } finally {

            setDishLoading(false);

        }
    };


    // ==========================================
    // DELETE RESTAURANT
    // PARTNER ONLY
    // ==========================================

    const handleDelete = async () => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${restaurant.name}"?`
        );

        if (!confirmDelete) {
            return;
        }

        try {

            setDeleting(true);
            setError("");

            await deleteRestaurant(restaurant.id);

            navigate("/partner/restaurants");

        } catch (error) {

            console.error("DELETE ERROR:", error);

            setError(error.message);

        } finally {

            setDeleting(false);

        }
    };


    // ==========================================
    // LOADING RESTAURANT
    // ==========================================

    if (loading) {

        return (
            <div className="text-center py-10 text-gray-500">
                Loading Restaurant...
            </div>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="p-6 text-center text-red-500">
                {error}
            </div>
        );

    }


    // ==========================================
    // NOT FOUND
    // ==========================================

    if (!restaurant) {

        return (
            <div className="text-center py-10 text-gray-500">
                Restaurant not found
            </div>
        );

    }


    return (

        <div className=" min-h-screen px-60 py-8">

            <div className="max-w-6xl mx-auto bg-white rounded-2xl overflow-hidden p-5">


                {/* ================================= */}
                {/* RESTAURANT NAME */}
                {/* ================================= */}

                <h1 className="text-3xl font-bold text-gray-900 pb-4 pt-5 pl-4">

                    {restaurant.name}

                </h1>


                {/* ================================= */}
                {/* RESTAURANT IMAGE */}
                {/* ================================= */}

                {restaurant.image ? (

                    <img
                        src={
                            restaurant.image.startsWith("http")
                                ? restaurant.image
                                : `http://localhost:8000${restaurant.image}`
                        }
                        alt={restaurant.name}
                        className="
                            w-full
                            h-64
                            sm:h-80
                            object-cover
                            rounded-2xl
                        "
                    />

                ) : (

                    <div
                        className="
                            w-full
                            h-64
                            bg-gray-200
                            flex
                            items-center
                            justify-center
                            rounded-2xl
                            text-gray-500
                        "
                    >
                        No Image
                    </div>

                )}


                {/* ================================= */}
                {/* RESTAURANT INFORMATION */}
                {/* ================================= */}

                <div className="pl-7">


                    {/* OPEN / CLOSED */}

                    <div className="pt-5">

                        <span
                            className={`
                                inline-block
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-semibold
                                border

                                ${
                                    restaurant.is_active
                                        ? "border-green-500 text-green-600"
                                        : "border-red-500 text-red-600"
                                }
                            `}
                        >

                            {restaurant.is_active
                                ? "Open Now"
                                : "Closed"
                            }

                        </span>

                    </div>


                    {/* FOOD TYPES */}

                    <div className="mt-2">

                        <p className="text-gray-600 font-semibold">

                            {Array.isArray(restaurant.food_types)
                                ? restaurant.food_types.join(", ")
                                : restaurant.food_types}

                        </p>


                        {/* ADDRESS */}

                        <p className="text-gray-600 font-semibold">

                            {restaurant.address},{" "}
                            {restaurant.city},{" "}
                            {restaurant.state}

                        </p>


                        {/* DESCRIPTION */}

                        <p className="text-gray-600 leading-relaxed font-semibold">

                            {restaurant.description}

                        </p>

                    </div>

                </div>


                {/* ========================================= */}
                {/* PARTNER ONLY - EDIT / DELETE */}
                {/* ========================================= */}

                {isPartner && (

                    <div className="pl-8 pt-5 flex gap-10">

                        {/* EDIT */}

                        <button
                            type="button"
                            className="
                                text-sm
                                font-bold
                                border-2
                                rounded-lg
                                px-2
                                py-1.5
                                border-green-400
                                text-green-400
                                w-20
                                cursor-pointer
                            "
                            onClick={() =>
                                navigate(
                                    `/partner/restaurant/edit/${restaurant.id}`
                                )
                            }
                        >
                            Edit
                        </button>


                        {/* DELETE */}

                        <button
                            type="button"
                            className="
                                text-sm
                                font-bold
                                border-2
                                rounded-lg
                                px-2
                                py-1.5
                                border-red-400
                                text-red-400
                                w-20
                                cursor-pointer
                            "
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </button>

                    </div>

                )}


                {/* ========================================= */}
                {/* PARTNER ONLY - ADD DISH */}
                {/* ========================================= */}

                {isPartner && (

                    <>

                        <hr className="my-6 border-gray-200" />

                        <div className="text-center flex flex-col items-center gap-5">

                            <p className="text-lg font-medium text-gray-700 italic">

                                “Good food creates memorable moments.
                                <br />
                                Add your delicious creations and make your menu unforgettable.”

                            </p>


                            <Link
                                to={`/partner/restaurant/${id}/dish/add`}
                                className="
                                    bg-orange-500
                                    hover:bg-orange-600
                                    text-white
                                    font-semibold
                                    px-5
                                    py-2.5
                                    rounded-lg
                                "
                            >
                                + Add Dish
                            </Link>

                        </div>

                    </>

                )}


                {/* ========================================= */}
                {/* DISHES */}
                {/* ========================================= */}

                <div className="mt-8">

                    {dishLoading ? (

                        <div className="text-center py-10 text-gray-500">
                            Loading dishes...
                        </div>

                    ) : dishError ? (

                        <div className="text-center py-10 text-red-500">
                            {dishError}
                        </div>

                    ) : dishes.length === 0 ? (

                        <div className="text-center py-10 text-gray-500">

                            <p className="text-lg font-semibold">
                                No dishes available 🍽️
                            </p>

                            {isPartner && (
                                <p className="mt-2">
                                    Add your first dish to this restaurant.
                                </p>
                            )}

                        </div>

                    ) : (

                        <DishList
                            dishes={dishes}
                            isPartner={isPartner}
                        />

                    )}

                </div>

            </div>

        </div>
    );
}