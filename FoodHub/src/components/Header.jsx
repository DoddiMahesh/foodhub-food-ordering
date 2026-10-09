import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, CircleUserRound, Search } from 'lucide-react'

export default function Header({ type }) {

    const navigate = useNavigate()

    const [search, setSearch] = useState("")

    const navLinkClass = ({ isActive }) =>
        isActive
            ? 'relative text-orange-500 font-semibold'
            : 'relative hover:text-orange-500 transition font-semibold'

    const isCustomer = type === "customer"
    const isPartner = type === "partner"


    const handleSearch = () => {

        const searchText = search.trim()

        if (!searchText) {
            return
        }

        navigate(
            `/search?search=${encodeURIComponent(searchText)}`
        )
    }


    return (

        <header className='sticky top-0 z-50 bg-white shadow py-2'>

            <div className='max-w-7xl mx-auto px-6 flex items-center justify-between'>

                {/* LOGO */}

                <div className='flex gap-2 items-center'>

                    <Link to="/">
                        <img
                            src='/images/logo.png'
                            alt='foodhub'
                            className='w-10'
                        />
                    </Link>

                    <Link
                        to='/'
                        className='text-2xl font-bold'
                    >
                        Food<span className='text-orange-500'>Hub</span>
                    </Link>

                </div>


                {/* CUSTOMER SEARCH */}

                {isCustomer && (

                    <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden w-96">

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch()
                                }
                            }}
                            placeholder="Search for food or restaurants"
                            className="w-full px-4 py-2 outline-none text-sm font-semibold"
                        />

                        <button
                            onClick={handleSearch}
                            className="px-3 py-2 flex items-center justify-center"
                        >
                            <Search size={20} />
                        </button>

                    </div>

                )}


                {/* NAVIGATION */}

                <nav className='hidden md:flex items-center gap-8'>

                    {isCustomer && (

                        <>

                            <NavLink
                                to='/restorents'
                                className={navLinkClass}
                            >
                                About
                            </NavLink>

                            <NavLink
                                to='/partnerLoginCheck'
                                className={navLinkClass}
                            >
                                Partner with us
                            </NavLink>

                            <NavLink
                                to='/login'
                                className={navLinkClass}
                            >
                                Login
                            </NavLink>

                            <NavLink
                                to='/cart'
                                className={navLinkClass}
                            >
                                <ShoppingCart size={24} />
                            </NavLink>

                            <NavLink
                                to='/profile'
                                className={navLinkClass}
                            >
                                <CircleUserRound size={30} />
                            </NavLink>

                        </>

                    )}


                    {isPartner && (

                        <>

                            <NavLink
                                to='/partner/home'
                                className={navLinkClass}
                            >
                                Home
                            </NavLink>

                            <NavLink
                                to='/partner/restaurant/add'
                                className={navLinkClass}
                            >
                                Add Restaurant
                            </NavLink>

                            <NavLink
                                to='/partner/orders'
                                className={navLinkClass}
                            >
                                Orders
                            </NavLink>

                            <NavLink
                                to='/partner/profile'
                                className={navLinkClass}
                            >
                                <CircleUserRound size={30} />
                            </NavLink>

                        </>

                    )}

                </nav>

            </div>

        </header>
    )
}