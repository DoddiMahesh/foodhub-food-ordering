import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { deleteDish } from "../services/authapi"

export default function DishList({ dishes, isPartner = false }) {

    const navigate = useNavigate()

    const [deletingId, setDeletingId] = useState(null)
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    // ==================================
    // CATEGORY ORDER
    // ==================================

    const categoryOrder = [
        "Biryani",
        "Tandoori",
        "Kebabs",
        "Starters",
        "Main Course",
        "Rice",
        "Noodles",
        "Pasta",
        "Pizza",
        "Burgers",
        "Sandwiches",
        "Momos",
        "South Indian",
        "North Indian",
        "Chinese",
        "Thalis",
        "Street Food",
        "Fast Food",
        "Desserts",
        "Beverages"
    ]

    const showSuccessMessage = (message) => {

        setSuccessMessage(message)

        setTimeout(() => {
            setSuccessMessage("")
        }, 2000)
    }

    // ==================================
    // DELETE DISH
    // ==================================

    const handleDelete = async (dishId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this dish?"
        )

        if (!confirmDelete) {
            return
        }

        try {

            setDeletingId(dishId)
            setError("")

            await deleteDish(dishId)

            // Refresh page after delete
            window.location.reload()

        } catch (error) {

            console.error("DELETE DISH ERROR:", error)
            setError(error.message)

        } finally {

            setDeletingId(null)
        }
    }


    // ==================================
    // GROUP DISHES BY CATEGORY
    // ==================================

    const groupedDishes = dishes.reduce((groups, dish) => {

        const category = dish.category

        if (!groups[category]) {
            groups[category] = []
        }

        groups[category].push(dish)

        return groups

    }, {})


    // ==================================
    // NO DISHES
    // ==================================

    if (dishes.length === 0) {

        return (
            <div className="text-center py-10">

                <p className="text-gray-500 text-lg">
                    No dishes available
                </p>

                {isPartner && (
                    <p className="text-gray-400 text-sm mt-2">
                        Add your first dish to display it here.
                    </p>
                )}

            </div>
        )
    }

    const handleAddToCart = async (dish) => {
        try {
            const response = await fetch(
                "http://localhost:8000/api/auth/customer/profile/",
                {
                    method: "GET",
                    credentials: "include",
                }
            )

            if (!response.ok) {
                navigate("/login")
                return
            }
        } catch (error) {
            console.error(error)
            navigate("/login")
            return
        }

        const existingCart =
            JSON.parse(localStorage.getItem("cart")) || []

        if (existingCart.length === 0) {
            const updatedCart = [
                {
                    ...dish,
                    quantity: 1,
                },
            ]

            localStorage.setItem(
                "cart",
                JSON.stringify(updatedCart)
            )

            alert(`${dish.name} added to cart`)
            return
        }

        const currentRestaurantId = dish.restaurant
        const cartRestaurantId = existingCart[0].restaurant

        if (
            String(cartRestaurantId) ===
            String(currentRestaurantId)
        ) {
            const existingDish = existingCart.find(
                item => item.id === dish.id
            )

            let updatedCart

            if (existingDish) {
                updatedCart = existingCart.map(item =>
                    item.id === dish.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                        }
                        : item
                )
            } else {
                updatedCart = [
                    ...existingCart,
                    {
                        ...dish,
                        quantity: 1,
                    },
                ]
            }

            localStorage.setItem(
                "cart",
                JSON.stringify(updatedCart)
            )

            alert(`${dish.name} added to cart`)
            return
        }

        const confirmReplace = window.confirm(
            "Your cart contains items from another restaurant. Do you want to replace the cart?"
        )

        if (!confirmReplace) {
            return
        }

        const updatedCart = [
            {
                ...dish,
                quantity: 1,
            },
        ]

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        )

        alert(`${dish.name} added to cart`)
    }

    return (

        <div className="w-full">

            {/* ERROR */}

            {error && (
                <div className="text-center text-red-500 font-semibold mb-5">
                    {error}
                </div>
            )}


            {/* ==================================
                CATEGORY ORDER
            ================================== */}

            {categoryOrder.map((category) => {

                const categoryDishes = groupedDishes[category]

                if (!categoryDishes) {
                    return null
                }

                return (

                    <div
                        key={category}
                        className="mb-10"
                    >

                        {/* CATEGORY NAME */}

                        <h2 className="text-2xl font-medium text-gray-800 mb-2">
                            {category}
                        </h2>

                        <hr className="border-gray-300 mb-5" />


                        {/* DISHES */}

                        <div className="space-y-5">

                            {categoryDishes.map((dish) => (

                                <div
                                    key={dish.id}
                                    className="flex justify-between items-center rounded-xl px-5 pt-5 pb-10 bg-white shadow-sm hover:shadow-md transition"
                                >

                                    {/* LEFT SIDE */}

                                    <div className="flex-1 pr-6">

                                        <h3 className="text-xl font-bold text-gray-800">
                                            {dish.name}
                                        </h3>


                                        <p className="text-lg font-semibold text-orange-500 mt-2">
                                            ₹{dish.price}
                                        </p>


                                        {dish.description && (

                                            <p className="text-gray-600 leading-relaxed mt-1">
                                                {dish.description}
                                            </p>

                                        )}


                                        {/* PARTNER BUTTONS */}

                                        {isPartner && (

                                            <div className="flex gap-4 mt-5">

                                                {/* EDIT */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/partner/restaurant/${dish.restaurant}/dish/edit/${dish.id}`
                                                        )
                                                    }
                                                    className="text-sm font-bold border-2 rounded-lg px-2 py-1.5 border-green-400 text-green-400 w-20 cursor-pointer hover:bg-green-50"
                                                >
                                                    Edit
                                                </button>


                                                {/* DELETE */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(dish.id)
                                                    }
                                                    disabled={
                                                        deletingId === dish.id
                                                    }
                                                    className="text-sm font-bold border-2 rounded-lg px-2 py-1.5 border-red-400 text-red-400 w-20 cursor-pointer hover:bg-red-50"
                                                >
                                                    {deletingId === dish.id
                                                        ? "Deleting..."
                                                        : "Delete"
                                                    }
                                                </button>

                                            </div>

                                        )}

                                    </div>


                                    {/* RIGHT SIDE - IMAGE + ADD TO CART */}

                                    <div className="relative w-36 shrink-0">

                                        {/* IMAGE */}

                                        <div className="w-36 h-32">

                                            {dish.image ? (

                                                <img
                                                    src={
                                                        dish.image.startsWith("http")
                                                            ? dish.image
                                                            : `http://localhost:8000${dish.image}`
                                                    }
                                                    alt={dish.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />

                                            ) : (

                                                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">

                                                    <span className="text-gray-400 text-sm">
                                                        No Image
                                                    </span>

                                                </div>

                                            )}

                                        </div>


                                        {/* ADD TO CART */}

                                        {!isPartner && (

                                            <button
                                                type="button"
                                                onClick={() => handleAddToCart(dish)}
                                                className="absolute left-1/2 -bottom-4 -translate-x-1/2 w-26 h-9 bg-white border-2 border-gray-400 text-green-600 font-bold rounded-lg shadow-lg hover:bg-gray-300 transition cursor-pointer "
                                            >
                                                ADD
                                            </button>

                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                )

            })}


            {/* ==================================
                OTHER CATEGORIES
            ================================== */}

            {Object.entries(groupedDishes)

                .filter(
                    ([category]) =>
                        !categoryOrder.includes(category)
                )

                .map(([category, categoryDishes]) => (

                    <div
                        key={category}
                        className="mb-10"
                    >

                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            {category}
                        </h2>

                        <hr className="border-gray-300 mb-5" />


                        <div className="space-y-5">

                            {categoryDishes.map((dish) => (

                                <div
                                    key={dish.id}
                                    className="flex justify-between items-center border border-gray-200 rounded-xl p-5 bg-white shadow-sm"
                                >

                                    {/* LEFT */}

                                    <div className="flex-1 pr-6">

                                        <h3 className="text-xl font-bold text-gray-800">
                                            {dish.name}
                                        </h3>


                                        <p className="text-lg font-semibold text-orange-500 mt-2">
                                            ₹{dish.price}
                                        </p>


                                        {dish.description && (

                                            <p className="text-gray-600 mt-2">
                                                {dish.description}
                                            </p>

                                        )}


                                        {/* PARTNER BUTTONS */}

                                        {isPartner && (

                                            <div className="flex gap-4 mt-5">

                                                {/* EDIT */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/partner/restaurant/${dish.restaurant}/dish/edit/${dish.id}`
                                                        )
                                                    }
                                                    className="text-sm font-bold border-2 rounded-lg px-2 py-1.5 border-green-400 text-green-400 w-20 cursor-pointer hover:bg-green-50"
                                                >
                                                    Edit
                                                </button>


                                                {/* DELETE */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(dish.id)
                                                    }
                                                    disabled={
                                                        deletingId === dish.id
                                                    }
                                                    className="text-sm font-bold border-2 rounded-lg px-2 py-1.5 border-red-400 text-red-400 w-20 cursor-pointer hover:bg-red-50"
                                                >
                                                    {deletingId === dish.id
                                                        ? "Deleting..."
                                                        : "Delete"
                                                    }
                                                </button>

                                            </div>

                                        )}

                                    </div>

                                    {/* RIGHT SIDE - IMAGE + ADD TO CART */}

                                    <div className="w-36 shrink-0">

                                        {/* IMAGE */}

                                        <div className="w-36 h-32">

                                            {dish.image ? (

                                                <img
                                                    src={
                                                        dish.image.startsWith("http")
                                                            ? dish.image
                                                            : `http://localhost:8000${dish.image}`
                                                    }
                                                    alt={dish.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />

                                            ) : (

                                                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">

                                                    <span className="text-gray-400 text-sm">
                                                        No Image
                                                    </span>

                                                </div>

                                            )}

                                        </div>


                                        {/* ADD TO CART */}

                                        {!isPartner && (

                                            <button
                                                type="button"
                                                onClick={() => console.log("ADD TO CART:", dish)}
                                                className="w-full mt-3 border-2 border-orange-500 text-orange-500 font-bold py-2 rounded-lg hover:bg-orange-500 hover:text-white transition cursor-pointer"
                                            >
                                                Add to Cart
                                            </button>

                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                ))}

        </div>
    )
}