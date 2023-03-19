import React, { useEffect, useState } from "react";
import Layout from "../core/Layout";
import { useNavigate } from "react-router";
import { authenticate, signin, isAuthenticated } from "../auth";

const Signin = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "sohaibamir123@gmail.com",
    password: "sohaib15",
    error: "",
    loading: false,
    redirectToReferrer: false,
  });

  const { email, password, loading, error, redirectToReferrer } = values;
  const { user } = isAuthenticated();

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    const user = { email, password };
    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        authenticate(data, () => {
          setValues({
            ...values,
            redirectToReferrer: true,
          });
        });
      }
    });
  };

  const signinForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      <button onClick={clickSubmit} className="btn btn-primary">
        Submit
      </button>
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

  const showLoading = () =>
    loading && (
      <div className="alert alert-info">
        <h2>Loading</h2>
      </div>
    );

  useEffect(() => {
    if (redirectToReferrer) {
      if (user && user.role === 1) {
        return navigate("/admin/dashboard");
      } else {
        return navigate("/user/dashboard");
      }
    }
    if (isAuthenticated()) {
      navigate("/")
    }
  })
  

  return (
    <Layout
      title="Signin"
      description="Signin to Node React E-commerce App"
      className="container col-md-8 offsett-md-2"
    >
      {showError()}
      {showLoading()}
      {signinForm()}
      {/* {redirectUser()} */}
    </Layout>
  );
};

export default Signin;
