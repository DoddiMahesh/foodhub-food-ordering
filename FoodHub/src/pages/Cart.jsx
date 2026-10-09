import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DeliveryAddress from "./DeliveryAddress"

export default function Cart() {

    const navigate = useNavigate()

    const [cart, setCart] = useState([])
    const [address, setAddress] = useState(null)
    const [ordering, setOrdering] = useState(false)
    const [error, setError] = useState("")

    // ==================================
    // LOAD CART
    // ==================================

    useEffect(() => {

        const savedCart =
            JSON.parse(localStorage.getItem("cart")) || []

        setCart(savedCart)

    }, [])

    // ==================================
    // LOAD CUSTOMER ADDRESS
    // ==================================

    useEffect(() => {

        fetch(
            "http://localhost:8000/api/auth/customer/address/",
            {
                method: "GET",
                credentials: "include",
            }
        )
            .then(response => {

                if (!response.ok) {
                    throw new Error("Address not found")
                }

                return response.json()

            })
            .then(data => {

                console.log("Address:", data)

                if (Array.isArray(data)) {

                    setAddress(
                        data.length > 0
                            ? data[0]
                            : null
                    )

                } else {

                    setAddress(data)

                }

            })
            .catch(error => {

                console.log(
                    "Address error:",
                    error
                )

                setAddress(null)

            })

    }, [])

    // ==================================
    // UPDATE LOCAL STORAGE
    // ==================================

    const updateCart = (updatedCart) => {

        setCart(updatedCart)

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        )

    }

    // ==================================
    // INCREASE QUANTITY
    // ==================================

    const increaseQuantity = (id) => {

        const updatedCart = cart.map(item =>

            item.id === id
                ? {
                    ...item,
                    quantity: item.quantity + 1
                }
                : item

        )

        updateCart(updatedCart)

    }

    // ==================================
    // DECREASE QUANTITY
    // ==================================

    const decreaseQuantity = (id) => {

        const updatedCart = cart
            .map(item =>

                item.id === id
                    ? {
                        ...item,
                        quantity: item.quantity - 1
                    }
                    : item

            )
            .filter(
                item => item.quantity > 0
            )

        updateCart(updatedCart)

    }

    // ==================================
    // REMOVE ITEM
    // ==================================

    const removeItem = (id) => {

        const updatedCart = cart.filter(
            item => item.id !== id
        )

        updateCart(updatedCart)

    }

    // ==================================
    // TOTAL PRICE
    // ==================================

    const totalPrice = cart.reduce(
        (total, item) =>
            total +
            Number(item.price) *
            item.quantity,
        0
    )

    // ==================================
    // DELIVERY FEE
    // ==================================

    const deliveryFee = 40

    // ==================================
    // GRAND TOTAL
    // ==================================

    const grandTotal =
        totalPrice + deliveryFee

    // ==================================
    // GET CSRF TOKEN
    // ==================================

    const getCSRFToken = async () => {

        const response = await fetch(
            "http://localhost:8000/api/auth/customer/orders/csrf/",
            {
                method: "GET",
                credentials: "include",
            }
        )

        if (!response.ok) {

            throw new Error(
                "Unable to get CSRF token."
            )

        }

        const csrfToken = document.cookie
            .split("; ")
            .find(row =>
                row.startsWith("csrftoken=")
            )
            ?.split("=")[1]

        if (!csrfToken) {

            throw new Error(
                "CSRF token not found."
            )

        }

        return csrfToken

    }

    // ==================================
    // PLACE ORDER
    // ==================================

    const handleOrder = async () => {

        setError("")

        if (cart.length === 0) {

            setError(
                "Your cart is empty."
            )

            return

        }

        if (!address) {

            setError(
                "Please add a delivery address."
            )

            return

        }

        try {

            setOrdering(true)

            const orderData = {

                address_id: address.id,

                delivery_fee: 40,

                total_amount: grandTotal,

                items: cart.map(item => ({

                    dish_id: item.id,

                    quantity: item.quantity,

                    price: Number(item.price)

                }))

            }

            console.log(
                "Sending Order:",
                orderData
            )

            const csrfToken =
                await getCSRFToken()

            console.log(
                "CSRF Token:",
                csrfToken
            )

            const response = await fetch(
                "http://localhost:8000/api/auth/customer/orders/create/",
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "X-CSRFToken":
                            csrfToken,

                    },

                    credentials: "include",

                    body:
                        JSON.stringify(
                            orderData
                        )

                }
            )

            const text =
                await response.text()

            console.log(
                "Backend status:",
                response.status
            )

            console.log(
                "Backend response:",
                text
            )

            let data

            try {

                data =
                    JSON.parse(text)

            }
            catch {

                throw new Error(
                    `Server returned ${response.status}: ${text}`
                )

            }

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    data.detail ||
                    JSON.stringify(data)
                )

            }

            console.log(
                "Order created:",
                data
            )

            localStorage.removeItem(
                "cart"
            )

            setCart([])

            alert(
                "Order placed successfully!"
            )

            navigate("/orders")

        }
        catch (error) {

            console.error(
                "Order Error:",
                error
            )

            setError(
                error.message
            )

        }
        finally {

            setOrdering(false)

        }

    }

    // ==================================
    // EMPTY CART
    // ==================================

    if (cart.length === 0) {

        return (
            <div className="w-full bg-gray-50 min-h-screen">

                <DeliveryAddress />

                <div className="max-w-6xl mx-auto px-5">

                    <div className="min-h-[60vh] flex items-center justify-center">

                        <div className="text-center">

                            <div className="text-6xl mb-4">
                                🛒
                            </div>

                            <h2 className="text-2xl font-bold text-gray-700">
                                Your cart is empty
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Add some delicious dishes
                                to your cart.
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        )
    }

    // ==================================
    // CART
    // ==================================

    return (
        <div className="w-full bg-gray-50 min-h-screen">

            {/* ==================================
                ADDRESS
            ================================== */}

            <DeliveryAddress />

            <div className="max-w-6xl mx-auto px-5 py-8">

                {/* ==================================
                    ERROR
                ================================== */}

                {error && (

                    <div className="mb-6 bg-red-100 text-red-600 border border-red-200 px-4 py-3 rounded-lg">

                        {error}

                    </div>

                )}

                {/* ==================================
                    LEFT CART + RIGHT BILL
                ================================== */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ==================================
                        LEFT SIDE - CART ITEMS
                    ================================== */}

                    <div className="lg:col-span-2">

                        <h1 className="text-2xl font-bold text-gray-800 mb-5">
                            Your Cart
                        </h1>

                        <div className="space-y-5">

                            {cart.map(item => (

                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"
                                >

                                    <div className="flex justify-between items-center gap-5">

                                        {/* DISH INFORMATION */}

                                        <div className="flex items-center gap-5 min-w-0">

                                            {/* IMAGE */}

                                            <div className="w-28 h-24 shrink-0">

                                                {item.image ? (

                                                    <img
                                                        src={
                                                            item.image.startsWith(
                                                                "http"
                                                            )
                                                                ? item.image
                                                                : `http://localhost:8000${item.image}`
                                                        }
                                                        alt={item.name}
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

                                            {/* DISH DETAILS */}

                                            <div className="min-w-0">

                                                <h2 className="text-lg font-bold text-gray-800 truncate">
                                                    {item.name}
                                                </h2>

                                                <p className="text-orange-500 font-semibold mt-1">
                                                    ₹{item.price}
                                                </p>

                                            </div>

                                        </div>

                                        {/* RIGHT SIDE OF CARD */}

                                        <div className="flex items-center gap-5 shrink-0">

                                            {/* QUANTITY */}

                                            <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        decreaseQuantity(
                                                            item.id
                                                        )
                                                    }
                                                    className="w-9 h-9 text-lg font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    -
                                                </button>

                                                <span className="w-10 text-center font-bold text-gray-800">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        increaseQuantity(
                                                            item.id
                                                        )
                                                    }
                                                    className="w-9 h-9 text-lg font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    +
                                                </button>

                                            </div>

                                            {/* ITEM TOTAL */}

                                            <p className="w-24 text-right font-bold text-gray-800">

                                                ₹
                                                {Number(item.price) *
                                                    item.quantity}

                                            </p>

                                            {/* REMOVE */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeItem(
                                                        item.id
                                                    )
                                                }
                                                className="text-red-500 font-semibold hover:text-red-700 cursor-pointer"
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* ==================================
                        RIGHT SIDE - BILL
                    ================================== */}

                    <div className="lg:col-span-1">

                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-5">

                            <h2 className="text-xl font-bold text-gray-800 mb-5">
                                Bill Details
                            </h2>

                            {/* ITEM TOTAL */}

                            <div className="flex justify-between text-gray-600 mb-4">

                                <span>
                                    Item Total
                                </span>

                                <span>
                                    ₹{totalPrice}
                                </span>

                            </div>

                            {/* DELIVERY FEE */}

                            <div className="flex justify-between text-gray-600 mb-4">

                                <span>
                                    Delivery Fee
                                </span>

                                <span>
                                    ₹{deliveryFee}
                                </span>

                            </div>

                            <hr className="my-5" />

                            {/* TO PAY */}

                            <div className="flex justify-between text-lg font-bold text-gray-800">

                                <span>
                                    To Pay
                                </span>

                                <span className="text-orange-500">
                                    ₹{grandTotal}
                                </span>

                            </div>

                            {/* ORDER BUTTON */}

                            <button
                                type="button"
                                onClick={handleOrder}
                                disabled={ordering}
                                className="w-full mt-6 bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {ordering
                                    ? "Placing Order..."
                                    : "Place Order"
                                }
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}