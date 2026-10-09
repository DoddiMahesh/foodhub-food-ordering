import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import DishForm from "../components/DishForm";
import { addDish } from "../services/authapi";

export default function AddDish() {

    const { id } = useParams();
    console.log("RESTAURANT ID:", id);
    const navigate = useNavigate();

    const initialValues = {
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
    };
    const handleSubmit = async (
        values,
        { setSubmitting, setErrors }
    ) => {
        try {
            const formData = new FormData();
            formData.append("restaurant_id", id);
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("price", values.price);
            formData.append("category", values.category);

            if (values.image) {
                formData.append("image", values.image);
            }

            await addDish(formData);
            navigate(`/partner/restaurant/${id}`);
        } catch (error) {
            setErrors({
                submit: error.message,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DishForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isEdit={false}
        />
    );
}