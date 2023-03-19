import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Layout from "../core/Layout";
import { getPurchaseHistory } from "./apiUser";
import moment from "moment"

const Dashboard = () => {
  const [history, setHistory] = useState([])

  const { user: { _id, name, email, role }, token } = isAuthenticated();

  const init = (userId, token) => {
    getPurchaseHistory(userId, token).then(data => {
      if (data.error) {
        console.log(data.error)
      }
      else {
        setHistory(data);
      }
    })
  }

  useEffect(() => {
    init(_id, token)
  }, [])

  const userLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">User Links</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to="/cart">
              My Cart
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to={`/profile/${_id}`}>
              Update Profile
            </Link>
          </li>
        </ul>
      </div>)
  };

  const userInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">User Information</h3>
        <ul className="list-group">
          <li className="list-group-item">{name}</li>
          <li className="list-group-item">{email}</li>
          <li className="list-group-item">
            {role === 1 ? "Admin" : "Registered User"}
          </li>
        </ul>
      </div>
    );
  };

  const purchaseHistory = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">Purchase history</h3>
        <ul className="list-group">
          <li className="list-group-item">
            {
              history.map((o, i) => (
                <div key={i}>
                  <hr />
                  <h6>Order Id: {o._id}</h6>
                  {o.products.map((p, i) => (
                    <div className="mb-2 p-2" style={{border: '1px solid black'}} key={i}>
                      <div>Product name: {p.name}</div>
                      <div>Product price: Rs. {p.price}</div>
                      <div>Purchased date: {moment(o.createdAt).fromNow()}</div>
                    </div>))}
                </div>
              ))
            }
          </li>
        </ul>
      </div>
    )
  }

  return (
    <Layout title="Dashboard" description={`Welcome ${name}`} className="container-fluid">
      <div className="row">
        <div className="col-3">{userLinks()}</div>
        <div className="col-9">
          {userInfo()}
          {purchaseHistory(history)}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
