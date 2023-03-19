import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './user/Signin';
import Signup from './user/Signup';
import Home from './core/Home';
import Dashboard from './user/UserDashboard';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';
import AdminDashboard from './user/AdminDashboard';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import Orders from './admin/Orders';
import Shop from './core/Shop';
import Product from './core/Product';
import Cart from './core/Cart';
import Profile from './user/Profile';
import ManageProducts from './admin/ManageProducts';
import UpdateProduct from './admin/UpdateProduct';

const Routess = () => {
  return (
    <Router>
      <Routes >
        <Route exact path="/" element={<Home />} />
        <Route exact path="/shop" element={<Shop />} />
        <Route exact path="/signin" element={<Signin />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/user/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
        <Route exact path="/profile/:userId" element={<PrivateRoute><Profile/></PrivateRoute>} />
        <Route exact path="/admin/dashboard" element={<AdminRoute><AdminDashboard/></AdminRoute>} />
        <Route exact path="/create/category" element={<AdminRoute><AddCategory/></AdminRoute>} />
        <Route exact path="/create/product" element={<AdminRoute><AddProduct/></AdminRoute>} />
        <Route exact path="/admin/product/update/:productId" element={<AdminRoute><UpdateProduct/></AdminRoute>} />
        <Route exact path="/admin/orders" element={<AdminRoute><Orders/></AdminRoute>} />
        <Route exact path="/admin/products" element={<AdminRoute><ManageProducts/></AdminRoute>} />
        <Route exact path="/product/:productId" element={<Product/>} />
        <Route exact path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  )
}

export default Routess;
