import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

const foodTypeOptions = [
    "Indian",
    "Chinese",
    "Italian",
    "Mexican",
    "Fast Food",
    "South Indian",
    "North Indian",
    "Biryani",
    "Hyderabadi",
    "Kebabs",
    "Barbeque",
    "Continental",
    "Others",
];

export default function RestaurantForm({
    initialValues,
    onSubmit,
    isEdit = false,
}) {
    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Restaurant name is required")
            .min(3,"Restaurant name must be at least 3 characters"),
        address: Yup.string()
            .required("Address is required")
            .min(5,"Address must be at least 5 characters"),
        city: Yup.string()
            .required("City is required"),
        state: Yup.string()
            .required("State is required"),
        pincode: Yup.string()
            .required("Pincode is required")
            .matches(/^[0-9]{6}$/,"Pincode must be 6 digits"),
        food_types: Yup.array()
            .min(1,"Select at least one food type")
            .required("Food type is required"),
        description: Yup.string()
            .max(500,"Description cannot exceed 500 characters"),
        image: isEdit
            ? Yup.mixed()
            : Yup.mixed().required("Restaurant image is required"),
    });

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const form = e.currentTarget.form;
            const index = Array.prototype.indexOf.call(
                    form.elements,
                    e.currentTarget
                );
            const nextElement =
                form.elements[index + 1];
            if (nextElement) {
                nextElement.focus();
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                        {isEdit ? "Update Restaurant" : "Add Restaurant"}
                    </h2>
                    <p className="mt-2 text-gray-500 font-semibold">
                        {isEdit ? "Update your restaurant information"
                            : "Add your restaurant and start reaching more customers."
                        }
                    </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
                    <Formik initialValues={initialValues} validationSchema={validationSchema}
                        onSubmit={onSubmit} enableReinitialize={true}
                    >
                        {({values, setFieldValue,isSubmitting,status}) => {
                            const [foodTypeOpen, setFoodTypeOpen] = useState(false)
                            const handleFoodTypeSelect = (food) => {
                                const currentFoodTypes =  values.food_types || []
                                if (currentFoodTypes.includes(food)) {
                                    setFieldValue("food_types",currentFoodTypes.filter((item) => item !== food))
                                } else {
                                    setFieldValue("food_types",[...currentFoodTypes,food]);
                                }
                            };
                            const removeFoodType = (e,food) => {
                                e.stopPropagation();
                                setFieldValue("food_types",(values.food_types || []).filter(
                                        (item) => item !== food
                                    )
                                );
                            };
                            return (
                                <Form className="space-y-6 py-8">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Restaurant Name
                                        </label>
                                        <Field type="text" name="name" placeholder="Enter restaurant name"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400"
                                            onKeyDown={handleEnter} autoFocus
                                        />
                                        <ErrorMessage name="name" component="p"
                                            className="text-red-500 text-sm mt-1 pl-5"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <Field as="textarea" name="address" rows="3" placeholder="Enter restaurant address"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-orange-400 placeholder:text-gray-400"
                                            onKeyDown={handleEnter}
                                        />
                                        <ErrorMessage name="address" component="p"
                                            className="text-red-500 text-sm mt-1 pl-5"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            City
                                        </label>
                                        <Field type="text" name="city" placeholder="Enter city"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-orange-400 placeholder:text-gray-400"
                                            onKeyDown={handleEnter}
                                        />
                                        <ErrorMessage name="city" component="p"
                                            className="text-red-500 text-sm mt-1 pl-5"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            State
                                        </label>
                                        <Field type="text"  name="state" placeholder="Enter state"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-orange-400 placeholder:text-gray-400"
                                            onKeyDown={handleEnter}
                                        />
                                        <ErrorMessage name="state" component="p"
                                            className="text-red-500 text-sm mt-1 pl-5"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Pincode
                                        </label>
                                        <Field type="text" name="pincode" placeholder="Enter 6 digit pincode"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-orange-400 placeholder:text-gray-400"
                                            onKeyDown={handleEnter}
                                        />
                                        <ErrorMessage name="pincode" component="p"
                                            className="text-red-500 text-sm mt-1 pl-5"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Food Types
                                        </label>
                                        <div
                                            onClick={() => setFoodTypeOpen(!foodTypeOpen)}
                                            className="min-h-12.5 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer flex flex-wrap gap-2 items-center"
                                        >
                                            {values.food_types && values.food_types.length > 0 ? (
                                                values.food_types.map(
                                                    (food) => (
                                                        <span key={food} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm flex items-center gap-2" >
                                                            {food}
                                                            <button type="button" onClick={(e) =>
                                                                    removeFoodType(e,food)
                                                                }
                                                                className="font-bold hover:text-red-600 cursor-pointer"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <span className="text-gray-400">
                                                    Select Food Types
                                                </span>
                                            )}
                                            <span className="ml-auto text-gray-500">
                                                {foodTypeOpen ? "▲" : "▼"}
                                            </span>
                                        </div>
                                        {foodTypeOpen && (
                                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {foodTypeOptions.map(
                                                    (food) => {
                                                        const isSelected = values.food_types?.includes(food)
                                                        return (
                                                            <div key={food} onClick={() => handleFoodTypeSelect(food)}
                                                                className={`px-4 py-3 cursor-pointer hover:bg-orange-50 transition ${
                                                                    isSelected ? "bg-orange-100 text-orange-600 font-semibold"
                                                                        : "text-gray-700"
                                                                }`}
                                                            >
                                                                {food}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        )}
                                        <ErrorMessage name="food_types" component="p"
                                            className="text-red-500 text-sm mt-1 pl-5"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <Field as="textarea" name="description" rows="4"
                                            placeholder="Enter restaurant description"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-orange-400 placeholder:text-gray-400"
                                            onKeyDown={handleEnter}
                                        />
                                        <ErrorMessage name="description" component="p"
                                            className="text-red-500 text-sm mt-1 pl-5"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="image"
                                            className="block text-sm font-semibold text-gray-700 mb-2"
                                        >
                                            Restaurant Image
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                                            <input id="image" type="file" accept="image/*"
                                                onChange={(event) => {
                                                    setFieldValue("image",event.currentTarget.files[0])
                                                }}
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer"
                                            />
                                            <p className="text-xl text-gray-400 mt-2">
                                                Upload JPG, PNG or WEBP images
                                            </p>
                                        </div>
                                        <ErrorMessage  name="image" component="p"
                                            className="text-red-500 text-sm mt-1 pl-5"
                                        />
                                    </div>
                                    {status && (
                                        <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-red-500">
                                            {status}
                                        </div>
                                    )}
                                    <button type="submit" disabled={isSubmitting}
                                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3.5 px-6 rounded-xl transition duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {isSubmitting ? "Saving..." : isEdit ? "Update Restaurant" : "Add Restaurant"}
                                    </button>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </div>
    );
}