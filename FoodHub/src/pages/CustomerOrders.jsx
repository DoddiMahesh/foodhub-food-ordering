import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Package,
    MapPin,
    Clock3,
    IndianRupee,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    ShoppingBag,
    ReceiptText,
    CircleCheck,
    Truck,
    ChefHat,
    XCircle,
} from "lucide-react";

export default function CustomerOrders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedOrder, setExpandedOrder] = useState(null);


    useEffect(() => {
        fetchOrders();
    }, []);


    // =========================
    // Fetch Orders
    // =========================

    const fetchOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:8000/api/auth/customer/orders/",
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const data = await response.json();

            console.log(
                "Customer orders:",
                data
            );

            if (!response.ok) {

                if (response.status === 401) {

                    navigate("/login");

                    return;
                }

                throw new Error(
                    data.error ||
                    "Unable to fetch orders."
                );
            }

            setOrders(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Orders error:",
                error
            );

            setError(
                error.message ||
                "Something went wrong."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // Toggle Order
    // =========================

    const toggleOrder = (orderId) => {

        setExpandedOrder(
            expandedOrder === orderId
                ? null
                : orderId
        );
    };


    // =========================
    // Image URL
    // =========================

    const getImageUrl = (image) => {

        if (!image) {
            return null;
        }

        if (image.startsWith("http")) {
            return image;
        }

        return `http://localhost:8000${image}`;
    };


    // =========================
    // Format Date
    // =========================

    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    // =========================
    // Status Configuration
    // =========================

    const getStatusConfig = (status) => {

        switch (status) {

            case "Placed":

                return {
                    icon: Clock3,
                    container:
                        "bg-blue-50 text-blue-700 border-blue-100",
                    iconColor:
                        "text-blue-600",
                };


            case "Confirmed":

                return {
                    icon: CircleCheck,
                    container:
                        "bg-indigo-50 text-indigo-700 border-indigo-100",
                    iconColor:
                        "text-indigo-600",
                };


            case "Preparing":

                return {
                    icon: ChefHat,
                    container:
                        "bg-amber-50 text-amber-700 border-amber-100",
                    iconColor:
                        "text-amber-600",
                };


            case "Out for Delivery":

                return {
                    icon: Truck,
                    container:
                        "bg-orange-50 text-orange-700 border-orange-100",
                    iconColor:
                        "text-orange-600",
                };


            case "Delivered":

                return {
                    icon: CircleCheck,
                    container:
                        "bg-emerald-50 text-emerald-700 border-emerald-100",
                    iconColor:
                        "text-emerald-600",
                };


            case "Cancelled":

                return {
                    icon: XCircle,
                    container:
                        "bg-red-50 text-red-700 border-red-100",
                    iconColor:
                        "text-red-600",
                };


            default:

                return {
                    icon: Clock3,
                    container:
                        "bg-gray-50 text-gray-700 border-gray-200",
                    iconColor:
                        "text-gray-600",
                };
        }
    };


    // =========================
    // Get Restaurant Names
    // =========================

    const getRestaurantNames = (items) => {

        if (!items || !items.length) {
            return [];
        }

        return [
            ...new Set(
                items
                    .map(
                        (item) =>
                            item.restaurant_name
                    )
                    .filter(Boolean)
            ),
        ];
    };


    // =========================
    // Loading
    // =========================

    if (loading) {

        return (

            <div className="min-h-screen bg-[#f7f7f8] flex items-center justify-center px-4">

                <div className="text-center">

                    <div className="w-11 h-11 border-[3px] border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>

                    <p className="mt-5 text-sm font-medium text-gray-700">
                        Loading your orders
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        Please wait a moment...
                    </p>

                </div>

            </div>
        );
    }


    // =========================
    // Error
    // =========================

    if (error) {

        return (

            <div className="min-h-screen bg-[#f7f7f8] px-4 py-12">

                <div className="max-w-lg mx-auto">

                    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 text-center">

                        <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto">

                            <XCircle
                                size={27}
                                className="text-red-500"
                            />

                        </div>


                        <h2 className="mt-5 text-lg font-semibold text-gray-900">
                            Unable to load orders
                        </h2>


                        <p className="mt-2 text-sm text-gray-500">
                            {error}
                        </p>


                        <button
                            onClick={fetchOrders}
                            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition"
                        >

                            <RefreshCw
                                size={16}
                            />

                            Try Again

                        </button>

                    </div>

                </div>

            </div>
        );
    }


    // =========================
    // Empty Orders
    // =========================

    if (orders.length === 0) {

        return (

            <div className="min-h-screen bg-[#f7f7f8] px-4 py-12">

                <div className="max-w-5xl mx-auto">

                    {/* Page Header */}

                    <div className="mb-8">

                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
                            My Orders
                        </h1>

                        <p className="mt-1.5 text-sm text-gray-500">
                            Track and manage your food orders
                        </p>

                    </div>


                    {/* Empty State */}

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">

                        <div className="px-6 py-16 md:py-20 text-center">

                            <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center mx-auto">

                                <ShoppingBag
                                    size={28}
                                    className="text-gray-400"
                                />

                            </div>


                            <h2 className="mt-5 text-xl font-semibold text-gray-900">
                                No orders yet
                            </h2>


                            <p className="max-w-md mx-auto mt-2 text-sm leading-6 text-gray-500">
                                You haven't placed any orders yet.
                                Browse restaurants and order your
                                favourite food to see your orders here.
                            </p>


                            <button
                                onClick={() =>
                                    navigate(
                                        "/restorents"
                                    )
                                }
                                className="mt-6 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition"
                            >
                                Browse Restaurants
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    // =========================
    // Main Page
    // =========================

    return (

        <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 md:py-10">

            <div className="max-w-5xl mx-auto">

                {/* =========================
                    Page Header
                ========================== */}

                <div className="mb-8">

                    <div className="flex items-center justify-between gap-4">

                        <div>

                            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
                                My Orders
                            </h1>

                            <p className="mt-1.5 text-sm text-gray-500">
                                Track and manage your food orders
                            </p>

                        </div>


                        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">

                            <Package size={17} />

                            <span>

                                {orders.length}{" "}

                                {orders.length === 1
                                    ? "order"
                                    : "orders"}

                            </span>

                        </div>

                    </div>

                </div>


                {/* =========================
                    Orders
                ========================== */}

                <div className="space-y-5">

                    {orders.map((order) => {

                        const isExpanded =
                            expandedOrder ===
                            order.id;

                        const statusConfig =
                            getStatusConfig(
                                order.status
                            );

                        const StatusIcon =
                            statusConfig.icon;

                        const restaurants =
                            getRestaurantNames(
                                order.items
                            );

                        const itemCount =
                            order.items?.length ||
                            0;


                        return (

                            <div
                                key={order.id}
                                className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
                            >

                                {/* =========================
                                    Order Top Section
                                ========================== */}

                                <div className="p-5 md:p-6">

                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                                        {/* Restaurant Information */}

                                        <div className="min-w-0">

                                            <div className="flex items-start gap-3">

                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">

                                                    <Package
                                                        size={20}
                                                        className="text-gray-700"
                                                    />

                                                </div>


                                                <div className="min-w-0">

                                                    {/* Restaurant Name */}

                                                    {restaurants.length > 0 ? (

                                                        restaurants.map(
                                                            (
                                                                restaurant,
                                                                index
                                                            ) => (

                                                                <p
                                                                    key={
                                                                        index
                                                                    }
                                                                    className="text-base md:text-lg font-semibold text-gray-900"
                                                                >
                                                                    {
                                                                        restaurant
                                                                    }
                                                                </p>
                                                            )
                                                        )

                                                    ) : (

                                                        <p className="text-base md:text-lg font-semibold text-gray-900">
                                                            Restaurant
                                                        </p>

                                                    )}


                                                    {/* Order ID */}

                                                    <p className="mt-1 text-sm font-medium text-gray-600">
                                                        Order ID: #
                                                        {order.id}
                                                    </p>


                                                    {/* Ordered Date */}

                                                    <div className="flex items-center gap-2 mt-1.5 text-sm text-gray-500">

                                                        <Clock3
                                                            size={15}
                                                        />

                                                        <span>

                                                            Ordered on{" "}

                                                            {formatDate(
                                                                order.created_at
                                                            )}

                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>


                                        {/* Status + Expand Button */}

                                        <div className="flex items-center justify-between lg:justify-end gap-3">

                                            <div
                                                className={`inline-flex items-center gap-2 px-3.5 py-2 border rounded-lg text-sm font-medium ${statusConfig.container}`}
                                            >

                                                <StatusIcon
                                                    size={16}
                                                    className={
                                                        statusConfig.iconColor
                                                    }
                                                />

                                                <span>
                                                    {order.status}
                                                </span>

                                            </div>


                                            <button
                                                onClick={() =>
                                                    toggleOrder(
                                                        order.id
                                                    )
                                                }
                                                aria-label={
                                                    isExpanded
                                                        ? "Collapse order"
                                                        : "Expand order"
                                                }
                                                className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition"
                                            >

                                                {isExpanded ? (

                                                    <ChevronUp
                                                        size={18}
                                                    />

                                                ) : (

                                                    <ChevronDown
                                                        size={18}
                                                    />

                                                )}

                                            </button>

                                        </div>

                                    </div>


                                    {/* =========================
                                        Order Summary
                                    ========================== */}

                                    <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                        <div className="flex items-center gap-6">

                                            <div>

                                                <p className="text-xs text-gray-400">
                                                    Items
                                                </p>

                                                <p className="mt-0.5 text-sm font-semibold text-gray-800">

                                                    {itemCount}{" "}

                                                    {itemCount === 1
                                                        ? "item"
                                                        : "items"}

                                                </p>

                                            </div>


                                            <div className="w-px h-8 bg-gray-200"></div>


                                            <div>

                                                <p className="text-xs text-gray-400">
                                                    Total amount
                                                </p>

                                                <div className="mt-0.5 flex items-center text-sm font-bold text-gray-900">

                                                    <IndianRupee
                                                        size={14}
                                                        strokeWidth={2.5}
                                                    />

                                                    {Number(
                                                        order.total_amount
                                                    ).toFixed(2)}

                                                </div>

                                            </div>

                                        </div>


                                        <button
                                            onClick={() =>
                                                toggleOrder(
                                                    order.id
                                                )
                                            }
                                            className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition text-left sm:text-right"
                                        >

                                            {isExpanded
                                                ? "Hide details"
                                                : "View details"}

                                        </button>

                                    </div>

                                </div>


                                {/* =========================
                                    Expanded Details
                                ========================== */}

                                {isExpanded && (

                                    <div className="border-t border-gray-200 bg-[#fafafa] p-5 md:p-6">

                                        {/* =========================
                                            Ordered Items
                                        ========================== */}

                                        <div>

                                            <div className="flex items-center gap-2 mb-4">

                                                <ShoppingBag
                                                    size={17}
                                                    className="text-gray-700"
                                                />

                                                <h3 className="text-sm font-semibold text-gray-900">
                                                    Order Items
                                                </h3>

                                            </div>


                                            <div className="space-y-3">

                                                {order.items?.map(
                                                    (item) => {

                                                        const imageUrl =
                                                            getImageUrl(
                                                                item.image
                                                            );


                                                        return (

                                                            <div
                                                                key={
                                                                    item.id
                                                                }
                                                                className="bg-white border border-gray-200 rounded-xl p-4"
                                                            >

                                                                <div className="flex gap-4">

                                                                    {/* Image */}

                                                                    <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">

                                                                        {imageUrl ? (

                                                                            <img
                                                                                src={
                                                                                    imageUrl
                                                                                }
                                                                                alt={
                                                                                    item.dish_name
                                                                                }
                                                                                className="w-full h-full object-cover"
                                                                            />

                                                                        ) : (

                                                                            <div className="w-full h-full flex items-center justify-center">

                                                                                <ShoppingBag
                                                                                    size={
                                                                                        22
                                                                                    }
                                                                                    className="text-gray-300"
                                                                                />

                                                                            </div>

                                                                        )}

                                                                    </div>


                                                                    {/* Details */}

                                                                    <div className="flex-1 min-w-0">

                                                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">

                                                                            <div>

                                                                                <h4 className="text-sm md:text-base font-semibold text-gray-900 truncate">

                                                                                    {
                                                                                        item.dish_name
                                                                                    }

                                                                                </h4>


                                                                                <p className="mt-1 text-xs sm:text-sm text-gray-500">

                                                                                    {
                                                                                        item.restaurant_name
                                                                                    }

                                                                                </p>

                                                                            </div>


                                                                            <div className="flex items-center text-sm font-bold text-gray-900 shrink-0">

                                                                                <IndianRupee
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                />

                                                                                {(
                                                                                    Number(
                                                                                        item.price
                                                                                    ) *
                                                                                    Number(
                                                                                        item.quantity
                                                                                    )
                                                                                ).toFixed(
                                                                                    2
                                                                                )}

                                                                            </div>

                                                                        </div>


                                                                        <div className="mt-3 flex items-center gap-4 text-xs sm:text-sm">

                                                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md">

                                                                                Qty:{" "}

                                                                                {
                                                                                    item.quantity
                                                                                }

                                                                            </span>


                                                                            <span className="text-gray-500">

                                                                                ₹
                                                                                {Number(
                                                                                    item.price
                                                                                ).toFixed(
                                                                                    2
                                                                                )}{" "}
                                                                                each

                                                                            </span>

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </div>
                                                        );
                                                    }
                                                )}

                                            </div>

                                        </div>


                                        {/* =========================
                                            Address + Bill
                                        ========================== */}

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">

                                            {/* Delivery Address */}

                                            {order.address_details && (

                                                <div className="bg-white border border-gray-200 rounded-xl p-5">

                                                    <div className="flex items-center gap-2">

                                                        <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">

                                                            <MapPin
                                                                size={
                                                                    16
                                                                }
                                                                className="text-orange-600"
                                                            />

                                                        </div>


                                                        <h3 className="text-sm font-semibold text-gray-900">
                                                            Delivery Address
                                                        </h3>

                                                    </div>


                                                    <div className="mt-4 pl-10">

                                                        <p className="text-sm text-gray-600 leading-6">

                                                            {
                                                                order
                                                                    .address_details
                                                                    .flat_no
                                                            }

                                                            {order
                                                                .address_details
                                                                .area &&
                                                                `, ${order.address_details.area}`}

                                                            {order
                                                                .address_details
                                                                .landmark &&
                                                                `, ${order.address_details.landmark}`}

                                                            <br />

                                                            {order
                                                                .address_details
                                                                .city &&
                                                                `${order.address_details.city}`}

                                                            {order
                                                                .address_details
                                                                .state &&
                                                                `, ${order.address_details.state}`}

                                                            {order
                                                                .address_details
                                                                .pincode &&
                                                                `, ${order.address_details.pincode}`}

                                                        </p>

                                                    </div>

                                                </div>

                                            )}


                                            {/* Bill Details */}

                                            <div className="bg-white border border-gray-200 rounded-xl p-5">

                                                <div className="flex items-center gap-2">

                                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">

                                                        <ReceiptText
                                                            size={
                                                                16
                                                            }
                                                            className="text-gray-700"
                                                        />

                                                    </div>


                                                    <h3 className="text-sm font-semibold text-gray-900">
                                                        Bill Details
                                                    </h3>

                                                </div>


                                                <div className="mt-4 space-y-3 text-sm">

                                                    {/* Item Total */}

                                                    <div className="flex justify-between items-center">

                                                        <span className="text-gray-500">
                                                            Item Total
                                                        </span>

                                                        <span className="text-gray-700">

                                                            ₹
                                                            {(
                                                                Number(
                                                                    order.total_amount
                                                                ) -
                                                                Number(
                                                                    order.delivery_fee
                                                                )
                                                            ).toFixed(
                                                                2
                                                            )}

                                                        </span>

                                                    </div>


                                                    {/* Delivery Fee */}

                                                    <div className="flex justify-between items-center">

                                                        <span className="text-gray-500">
                                                            Delivery Fee
                                                        </span>

                                                        <span className="text-gray-700">

                                                            ₹
                                                            {Number(
                                                                order.delivery_fee
                                                            ).toFixed(
                                                                2
                                                            )}

                                                        </span>

                                                    </div>


                                                    {/* Divider */}

                                                    <div className="border-t border-gray-100 pt-3 mt-3">

                                                        <div className="flex justify-between items-center">

                                                            <span className="font-semibold text-gray-900">
                                                                Total
                                                            </span>


                                                            <span className="flex items-center text-base font-bold text-gray-900">

                                                                <IndianRupee
                                                                    size={
                                                                        15
                                                                    }
                                                                />

                                                                {Number(
                                                                    order.total_amount
                                                                ).toFixed(
                                                                    2
                                                                )}

                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                )}

                            </div>
                        );
                    })}

                </div>

            </div>

        </div>
    );
}