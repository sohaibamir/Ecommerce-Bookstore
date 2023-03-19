import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { getBraintreeClientToken, processPayment, createOrder } from "./apiCore";
import DropIn from "braintree-web-drop-in-react";
import { emptyCart } from "./cartHelpers";

const Checkout = ({ products, setRun = f => f, run = undefined }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: '',
    instance: {},
    address: ""
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then(data => {
      if (data.error) {
        setData({ ...data, error: data.error })
      }
      else {
        setData({ clientToken: data.clientToken })
      }
    })
  }

  useEffect(() => {
    getToken(userId, token)
  }, [])

  const handleAddress = event => {
    setData({ ...data, address: event.target.value });
  };

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => (
      currentValue + nextValue.count * nextValue.price
    ), 0)
  }

  const showCheckout = () => (
    isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to="/signin">
        <button className="btn btn-primary">Sign in to checkout</button>
      </Link>
    )
  )

  let deliveryAddress = data.address;

  const buy = () => {
    // send nonce to server
    // nonce = data.instance.requestPaymentMethod();
    let nonce;
    let getNonce = data.instance
    if (getNonce !== undefined) {
      getNonce.requestPaymentMethod()
        .then(data => {
          // console.log(data)
          nonce = data.nonce
          setData({ loading: true })
          // once you have nonce (card type, card number) send nonce as 'paymentMethodNonce'
          // and also total to be charged

          // console.log('send nonce and total to the process: ', nonce, getTotal(products));
          const paymentData = {
            paymentMethodNonce: nonce,
            amount: getTotal(products)
          }

          processPayment(userId, token, paymentData).then(response => {
            // console.log(response)
            // empty cart
            // create order
            const createOrderData = {
              products: products,
              transaction_id: response.transaction.id,
              amount: response.transaction.amount,
              address: deliveryAddress
            }

            createOrder(userId, token, createOrderData).then(response => {
              emptyCart(() => {
                setRun(!run);
                console.log('payment success and empty')
                setData({ ...data, success: true, loading: false })
              })
            })

          })
            .catch(error => {
              console.log(error)
              setData({ loading: false })
            })

        })
        .catch(error => {
          // console.log('dropin error: ', error);
          setData({ ...data, error: error.message })
        })
    }
  }


  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: '' })}>
      {data.clientToken !== null && products.length > 0 ? (

        <div>
          <div className="gorm-group mb-3">
            <label className="text-muted">Delivery address:</label>
            <textarea
              onChange={handleAddress}
              className="form-control"
              value={data.address}
              placeholder="Type your delivery address here..."
              required
            />
          </div>
          <DropIn options={{
            authorization: data.clientToken
          }} onInstance={instance => setData({ ...data, instance })} />
          <button onClick={buy} className="btn btn-success btn-block">Pay</button>
        </div>
      ) : null}
    </div>
  )

  const showError = error => (
    <div className="alert alert-danger mt-4" style={{ display: error ? '' : "none" }}>
      {error}
    </div>
  )

  const showSuccess = success => (
    <div className="alert alert-info mt-4" style={{ display: success ? '' : "none" }}>
      Thanks! Your payment was successfull
    </div>
  )

  const showLoading = loading => loading && <h2>Loading...</h2>

  return (
    <div>
      <h2>Total: Rs. {getTotal()}</h2>
      {showLoading(data.loading)}
      {showSuccess(data.success)}
      {showError(data.error)}
      {showCheckout()}
    </div>
  )
}

export default Checkout
