import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDish } from "../services/authapi";

export default function DishDetails() {

    const navigate = useNavigate();

    const [dishes, setDishes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDish();
    }, [restaurantId]);

    const fetchDish = async () => {
        try {
            setLoading(true);
            setError("")
            const data = await getRestaurantDish(restaurantId);
            setDishes(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading dishes...</p>;
    }

    if (error) {
        return (
            <p className="text-center mt-10 text-red-500">{error}</p>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6">
            <h2 className="text-3xl font-bold mb-6">
                {dish.name}
            </h2>
            {dish.image && (
                <img
                    src={
                        dish.image.startsWith("http")
                            ? dish.image
                            : `http://localhost:8000${dish.image}`
                    }
                    alt={dish.name}
                    className="w-full h-64 object-cover rounded-lg mb-5"
                />
            )}
            <p className="text-lg"><strong>Price:</strong> ₹{dish.price}</p>
            <p className="text-lg mt-2"><strong>Category:</strong> {dish.category}</p>
            <p className="text-gray-600 mt-4">{dish.description}</p>
            <button
                onClick={() => navigate(`/partner/dish/update/${dish.id}`)}
                className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg"
            >
                Edit Dish
            </button>
        </div>
    );
}