import React, { useEffect, useState } from "react";
import {
    Package,
    MapPin,
    User,
    Phone,
    IndianRupee,
    ShoppingBag,
    Clock3,
    ReceiptText,
} from "lucide-react";

export default function PartnerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:8000/api/auth/partner/orders/",
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const data = await response.json();

            console.log("Partner Orders:", data);

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    data.error ||
                    "Failed to fetch orders"
                );
            }

            setOrders(data);

        } catch (error) {

            console.error(
                "Partner Orders Error:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);

        }
    };

    const formatDate = (date) => {

        if (!date) return "N/A";

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-600">
                        Loading orders...
                    </p>

                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

                <div className="bg-white rounded-xl shadow-sm p-8 text-center">

                    <p className="text-red-500 font-medium">
                        {error}
                    </p>

                    <button
                        onClick={fetchOrders}
                        className="mt-5 px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">

            <div className="max-w-6xl mx-auto">

                {/* Page Header */}

                <div className="mb-8">

                    <div className="flex items-center gap-3">

                        <div className="p-3 bg-orange-100 rounded-xl">

                            <Package
                                size={28}
                                className="text-orange-500"
                            />

                        </div>

                        <div>

                            <h1 className="text-2xl font-bold text-gray-800">
                                Orders
                            </h1>

                            <p className="text-gray-500 mt-1">
                                View orders received from customers
                            </p>

                        </div>

                    </div>

                </div>

                {/* No Orders */}

                {orders.length === 0 ? (

                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">

                        <ShoppingBag
                            size={60}
                            className="mx-auto text-gray-300"
                        />

                        <h2 className="text-xl font-semibold text-gray-700 mt-5">
                            No orders yet
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Customer orders will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-6">

                        {orders.map((order) => (

                            <div
                                key={order.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                            >

                                {/* Order Header */}

                                <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">

                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                        <div className="flex items-center gap-3">

                                            <div className="p-2.5 bg-orange-100 rounded-lg">

                                                <ReceiptText
                                                    size={22}
                                                    className="text-orange-500"
                                                />

                                            </div>

                                            <div>

                                                <p className="font-bold text-gray-800">
                                                    Order #{order.id}
                                                </p>

                                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">

                                                    <Clock3 size={15} />

                                                    <span>
                                                        {formatDate(
                                                            order.created_at
                                                        )}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="flex items-center gap-4">

                                            <span className="px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
                                                {order.status || "Placed"}
                                            </span>

                                            <span className="font-bold text-lg text-gray-800 flex items-center">

                                                <IndianRupee size={17} />

                                                {Number(
                                                    order.bill?.total ||
                                                    order.total_amount ||
                                                    0
                                                ).toFixed(2)}

                                            </span>

                                        </div>

                                    </div>

                                </div>

                                {/* Order Content */}

                                <div className="p-6">

                                    {/* Customer + Address */}

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                                        {/* Customer */}

                                        <div className="border border-gray-200 rounded-xl p-5">

                                            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">

                                                <User
                                                    size={19}
                                                    className="text-orange-500"
                                                />

                                                Customer Details

                                            </h3>

                                            <div className="space-y-3">

                                                <div>

                                                    <p className="text-xs text-gray-500">
                                                        Name
                                                    </p>

                                                    <p className="font-medium text-gray-800">

                                                        {order.customer?.name ||
                                                            "N/A"}

                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-xs text-gray-500">
                                                        Phone
                                                    </p>

                                                    <p className="font-medium text-gray-800 flex items-center gap-2">

                                                        <Phone size={15} />

                                                        {order.customer?.phone_number ||
                                                            "N/A"}

                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                        {/* Address */}

                                        <div className="border border-gray-200 rounded-xl p-5">

                                            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">

                                                <MapPin
                                                    size={19}
                                                    className="text-orange-500"
                                                />

                                                Delivery Address

                                            </h3>

                                            <div className="text-gray-600 leading-7">

                                                {/* First Line */}
                                                <p>
                                                    <span className="font-medium text-gray-700">
                                                        Flat / House No:
                                                    </span>{" "}
                                                    {order.address?.flat_no ||
                                                        ""}

                                                    {order.address?.area
                                                        ? `, ${order.address.area}`
                                                        : ""}

                                                    {order.address?.landmark
                                                        ? `, ${order.address.landmark}`
                                                        : ""}
                                                </p>

                                                {/* Second Line */}
                                                <p>
                                                    {order.address?.city ||
                                                        ""}

                                                    {order.address?.state
                                                        ? `, ${order.address.state}`
                                                        : ""}

                                                    {order.address?.pincode
                                                        ? ` - ${order.address.pincode}`
                                                        : ""}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    {/* Restaurant */}

                                    {order.restaurant && (

                                        <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-xl">

                                            <p className="text-xs text-gray-500">
                                                Restaurant
                                            </p>

                                            <p className="font-semibold text-gray-800 mt-1">
                                                {order.restaurant.name}
                                            </p>

                                        </div>

                                    )}

                                    {/* Ordered Items */}

                                    <div>

                                        <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">

                                            <ShoppingBag
                                                size={19}
                                                className="text-orange-500"
                                            />

                                            Ordered Items

                                        </h3>

                                        <div className="border border-gray-200 rounded-xl overflow-hidden">

                                            {order.items?.map(
                                                (item, index) => (

                                                    <div
                                                        key={
                                                            item.id ||
                                                            index
                                                        }
                                                        className="flex items-center justify-between gap-4 px-5 py-4 border-b last:border-b-0 border-gray-200"
                                                    >

                                                        <div>

                                                            <p className="font-semibold text-gray-800">

                                                                {item.dish?.name ||
                                                                    item.dish_name ||
                                                                    item.name ||
                                                                    "Dish"}

                                                            </p>

                                                            <p className="text-sm text-gray-500 mt-1">

                                                                ₹
                                                                {Number(
                                                                    item.price ||
                                                                    0
                                                                ).toFixed(2)}

                                                                {" × "}

                                                                {item.quantity ||
                                                                    1}

                                                            </p>

                                                        </div>

                                                        <div className="font-semibold text-gray-800 flex items-center">

                                                            <IndianRupee
                                                                size={15}
                                                            />

                                                            {Number(
                                                                item.item_total ||
                                                                (
                                                                    Number(
                                                                        item.price ||
                                                                        0
                                                                    ) *
                                                                    Number(
                                                                        item.quantity ||
                                                                        1
                                                                    )
                                                                )
                                                            ).toFixed(2)}

                                                        </div>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                    {/* Total */}

                                    <div className="flex justify-end mt-6">

                                        <div className="w-full md:w-80">

                                            <div className="flex justify-between py-2 text-gray-600">

                                                <span>
                                                    Subtotal
                                                </span>

                                                <span>
                                                    ₹
                                                    {Number(
                                                        order.bill?.subtotal ||
                                                        0
                                                    ).toFixed(2)}
                                                </span>

                                            </div>

                                            <div className="flex justify-between py-2 text-gray-600">

                                                <span>
                                                    Delivery Fee
                                                </span>

                                                <span>
                                                    ₹
                                                    {Number(
                                                        order.bill?.delivery_fee ||
                                                        0
                                                    ).toFixed(2)}
                                                </span>

                                            </div>

                                            <div className="border-t border-gray-200 pt-3 flex justify-between">

                                                <span className="font-bold text-gray-800">
                                                    Total
                                                </span>

                                                <span className="font-bold text-lg text-orange-500 flex items-center">

                                                    <IndianRupee size={17} />

                                                    {Number(
                                                        order.bill?.total ||
                                                        order.total_amount ||
                                                        0
                                                    ).toFixed(2)}

                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}