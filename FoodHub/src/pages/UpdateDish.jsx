import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DishForm from "../components/DishForm";
import {getDish, updateDish} from "../services/authapi";

export default function UpdateDish() {
    const { id, dishId } = useParams();
    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        fetchDish();
    }, [dishId]);

    const fetchDish = async () => {
        try {
            const data = await getDish(dishId);
            setInitialValues({
                name: data.name || "",
                description: data.description || "",
                price: data.price || "",
                category: data.category || "",
                image: data.image || null,
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (
        values,
        { setSubmitting, setErrors }
    ) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("price", values.price);
            formData.append("category", values.category);

            // Only send image if a NEW image was selected
            if (values.image instanceof File) {
                formData.append("image", values.image);
            }
            await updateDish(dishId, formData);
            navigate(`/partner/restaurant/${id}`);

        } catch (error) {
            setErrors({
                submit: error.message,
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-10 text-gray-500">
                Loading dish...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <DishForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isEdit={true}
        />
    );
}