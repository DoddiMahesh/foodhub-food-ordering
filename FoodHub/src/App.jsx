import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Home from './pages/Home'
import CustomerHeader from './pages/CustomerHeader'
import PartnerHeader from './pages/PartnerHeader'
import CustomerLogin from './pages/CustomerLogin'
import CustomerRegister from './pages/CustomerRegister'
import PartnerLogin from './pages/PartnerLogin'
import PartnerRegister from './pages/PartnerRegister'
import NotFound from './pages/NotFound'
import RestaurantDetails from './components/RestaurantDetails'
import PartnerHome from './pages/PartnerHome'
import AddRestaurant from './pages/AddRestaurant'
import UpdateRestaurant from './pages/UpdateRestaurant'
import AddDish from './pages/AddDish'
import UpdateDish from './pages/UpdateDish'
import DishDetails from './components/DishDetails'
import Cart from './pages/Cart'
import AdressForm from './components/AddressForm'
import Profile from './components/Profile'
import SearchResult from './pages/SearchResult'
import PartnerLoginCheck from './pages/PartnerLoginCheck'
import PartnerOrders from './pages/PartnerOrders'

function Layout(){
  const location=useLocation()
  const isPartnerPage = location.pathname.startsWith("/partner")

  return(
    <>
      {isPartnerPage ? <PartnerHeader /> : <CustomerHeader />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/partner/home" element={<PartnerHome />} />
        <Route path="/partner/restaurant/:id" element={<RestaurantDetails isPartner={true} />}/>
        <Route path="/restaurant/:id" element={<RestaurantDetails isPartner={false} />}/>
       {/* <Route path="/food/:id" element={<FoodDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} /> */}
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/signup" element={<CustomerRegister />} />
        <Route path="/partnerLogin" element={<PartnerLogin />} />
        <Route path="/partnerSignup" element={<PartnerRegister />} />
        <Route path="/partner/restaurant/add" element={<AddRestaurant />} />
        <Route path="/partner/restaurant/edit/:id" element={<UpdateRestaurant />} />
        <Route path="/partner/restaurant/:id/dish/add" element={<AddDish />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails isPartner={false} />}/>
        <Route path="/partner/restaurant/:id" element={<RestaurantDetails isPartner={true} />}/>
        <Route path="/partner/restaurant/:id/dish/edit/:dishId" element={<UpdateDish />} />
        <Route path="/partner/dish/:dishId" element={<DishDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="partner/profile" element={<Profile />} />
        <Route path='/address' element={<AdressForm />} />
        <Route path='/partnerLoginCheck' element={<PartnerLoginCheck />} />
        <Route path='/partner/orders' element={<PartnerOrders />} />
        <Route path='/search' element={<SearchResult />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default function App() {  
  return (
    <>
      <Layout />
      <Footer />
    </>
  )
}
