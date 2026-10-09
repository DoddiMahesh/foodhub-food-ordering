import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function DishForm({
    initialValues,
    onSubmit,
    isEdit = false,
}) {

    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Dish name is required")
            .min(2, "Dish name must be at least 2 characters"),

        description: Yup.string(),

        price: Yup.number()
            .typeError("Price must be a number")
            .required("Price is required")
            .positive("Price must be greater than 0"),

        category: Yup.string()
            .required("Category is required"),

        image: Yup.mixed()
            .nullable()
            .test(
                "fileType",
                "Only JPG, JPEG, PNG or WEBP images are allowed",
                (value) => {
                    if (!value) return true;

                    return [
                        "image/jpeg",
                        "image/jpg",
                        "image/png",
                        "image/webp",
                    ].includes(value.type);
                }
            ),
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
        <div className="min-h-screen bg-gray-50 px-6 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        {isEdit ? "UPDATE DISH" : "ADD DISH"}
                    </h1>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={onSubmit}
                    >
                        {({
                            isSubmitting,
                            setFieldValue,
                            values,
                        }) => (
                            <Form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 ">
                                        Dish Name
                                    </label>
                                    <Field type="text" name="name" placeholder="Enter dish name"
                                        onKeyDown={handleEnter} autoFocus 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-orange-500 "
                                    />
                                    <ErrorMessage name="name" component="p"
                                        className="text-sm text-red-500 mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Price
                                    </label>
                                    <Field type="number" name="price" step="0.01" placeholder="Enter price" onKeyDown={handleEnter}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-orange-500"
                                    />
                                    <ErrorMessage name="price" component="p"
                                        className="text-sm text-red-500 mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <Field as="select" name="category" onKeyDown={handleEnter}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-orange-500"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Starters">Starters</option>
                                        <option value="Main Course">Main Course</option>
                                        <option value="Biryani">Biryani</option>
                                        <option value="Rice">Rice</option>
                                        <option value="Noodles">Noodles</option>
                                        <option value="Fast Food">Fast Food</option>
                                        <option value="Desserts">Desserts</option>
                                        <option value="Beverages">Beverages</option>
                                    </Field>
                                    <ErrorMessage name="category" component="p"
                                        className="text-sm text-red-500 mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <Field  as="textarea" name="description" rows="2" placeholder="Enter dish description"
                                        onKeyDown={handleEnter}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-orange-500"
                                    />
                                    <ErrorMessage name="description" component="p"
                                        className="text-sm text-red-500 mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Dish Image
                                    </label>
                                    <input type="file" accept="image/jpeg,image/png,image/webp"
                                        onChange={(event) => {
                                            setFieldValue(
                                                "image", event.currentTarget.files[0]
                                            )
                                        }}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                                    />
                                    {isEdit &&
                                        typeof values.image === "string" &&
                                        values.image && (
                                            <div className="mt-3">
                                                <p className="text-sm text-gray-500 mb-2">
                                                    Current Image
                                                </p>
                                                <img src={values.image} alt="Current dish"
                                                    className="w-32 h-24 object-cover rounded-lg"
                                                />
                                            </div>
                                        )}
                                    <ErrorMessage name="image" component="p"
                                        className="text-sm text-red-500 mt-1"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => window.history.back()}
                                        className="w-1/2 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isSubmitting}
                                        className="w-1/2 px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold disabled:opacity-50"
                                    >
                                        {isSubmitting ? isEdit ? "Updating..." : "Adding..."
                                            : isEdit ? "Update Dish" : "Add Dish"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}