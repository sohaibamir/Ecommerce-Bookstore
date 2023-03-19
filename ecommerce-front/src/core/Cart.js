import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";
import { getCart } from "./cartHelpers";
import Checkout from "./Checkout";
import Layout from "./Layout";

const Cart = () => {
    const [items, setItems] = useState([]);
    const [run, setRun] = useState(false);

    useEffect(() => {
        setItems(getCart());
    }, [run]);

    const showItems = items => (
        <div>
            <h2>Your cart has {`${items.length}`} items</h2>
            <hr />
            <div className="row">
                {items.map((product, i) => (
                    <div key={i} className="col-6 mb-3">
                        <Card product={product} showAddToCartButton={false} cartUpdate={true} showRemoveProductButton={true} run={run} setRun={setRun} />
                    </div>
                ))} </div>
        </div>
    )

    const noItemsMessage = () => (
        <h2>Your cart is empty
            <br />
            <Link to="/shop">Contnue shopping</Link>
        </h2>
    )

    return (
        <Layout title="Shopping Cart" description="Manage your cart items. Add remove checkout or continue shopping." className="container-fluid">
            <div className="row">
                <div className="col-6">
                    {items.length > 0 ? showItems(items) : noItemsMessage()}
                </div>

                <div className="col-6">
                    <h2 className="mb-3">Your cart Summary</h2>
                    <hr/>
                    <Checkout products={items} setRun={setRun} run={run} />
                </div>
            </div>
        </Layout>
    )
}

export default Cart
