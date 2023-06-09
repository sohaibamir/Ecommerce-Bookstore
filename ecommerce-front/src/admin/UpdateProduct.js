import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Layout from "../core/Layout";
import { getSingleProduct, getCategories, updateProduct } from "./apiAdmin";

const UpdateProduct = () => {
  const params = useParams();
  const { user, token } = isAuthenticated();
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    category: "",
    shipping: "",
    quantity: "",
    photo: "",
    loading: false,
    error: "",
    updatedProduct: "",
    redirectToProfile: false,
    formData: "",
  });

  const init = (productId) => {
    getSingleProduct(productId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        // populate state
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category._id,
          shipping: data.shipping,
          quantity: data.quantity,
          formData: new FormData(),
        });

        // load categories
        initCategories();
      }
    });
  };

  // load categories and set form data
  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ categories: data, formData: new FormData() });
      }
    });
  };

  const {
    name,
    description,
    price,
    categories,
    category,
    shipping,
    quantity,
    loading,
    error,
    updatedProduct,
    redirectToProfile,
    formData,
  } = values;

  useEffect(() => {
    const productId = params.productId;
    init(productId);
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });

    updateProduct(params.productId, user._id, token, formData).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, updatedProduct: false });
      } else {
        setValues({
          ...values,
          error: false,
          name: "",
          description: "",
          price: "",
          quantity: "",
          photo: "",
          loading: false,
          redirectToProfile: true,
          updatedProduct: data.name,
          formData: "",
        });
      }
    });
  };

  const newPostForm = () => (
    <form className="mb-3" onSubmit={clickSubmit}>
      <h4>Post Photo</h4>
      <div className="form-group">
        <label className="btn btn-secondary">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image/*"
          />
        </label>
      </div>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Description</label>
        <textarea
          onChange={handleChange("description")}
          className="form-control"
          value={description}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Price</label>
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          value={price}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Category</label>
        <select onChange={handleChange("category")} className="form-control">
          <option>Please Select</option>
          {categories &&
            categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <label className="text-muted">Shipping</label>
        <select onChange={handleChange("shipping")} className="form-control">
          <option>Please Select</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>
      <div className="form-group">
        <label className="text-muted">Quantity</label>
        <input
          onChange={handleChange("quantity")}
          type="number"
          className="form-control"
          value={quantity}
        />
      </div>
      <button className="btn btn-outline-primary btn-block">Update Product</button>
    </form>
  );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => {
    return (
      <div
        className="alert alert-info"
        style={{ display: updatedProduct ? "" : "none" }}
      >
        <h3>{`${updatedProduct}`} is updated!</h3>
      </div>
    );
  };

  const showLoading = () =>
    loading && (
      <div className="alert alert-success">
        <h2>Loading</h2>
      </div>
    );

    const redirectUser = () => {
        if (redirectToProfile) {
            if (!error) {
                return <Navigate to="/"/>
            }
        }
    }

  return (
    <Layout
      title="Add a new product"
      description={`Welcome ${user.name}, ready to add a new product?`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showLoading()}
          {showSuccess()}
          {showError()}
          {newPostForm()}
          {redirectUser()}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
