import React from "react";
import { Link, useLocation} from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import { useNavigate } from "react-router";
import { itemTotal } from "./cartHelpers";

const isActive = (pathname, path) => {
    if (pathname === path) {
        return { color: "#ff9900" };
    } else {
        return { color: "#ffffff" };
    }
};

const Menu = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    return (
        <div>
            <ul className="nav nav-tabs bg-primary">
                <li className="nav-item">
                    <Link className="nav-link" to="/" style={isActive(pathname, "/")}>
                        Home
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/shop" style={isActive(pathname, "/shop")}>
                        Shop
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/cart" style={isActive(pathname, "/cart")}>
                        Cart <sup><small className="cart-badge" style={{display: itemTotal()? '': "none"}}>{itemTotal()}</small></sup>
                    </Link>
                </li>
                {isAuthenticated() && isAuthenticated().user.role === 0 && (
                    <li className="nav-item">
                    <Link className="nav-link" to="/user/dashboard" style={isActive(pathname, "/user/dashboard")}>
                        Dashboard
                    </Link>
                </li>
                )}
                {isAuthenticated() && isAuthenticated().user.role === 1 && (
                    <li className="nav-item">
                    <Link className="nav-link" to="/admin/dashboard" style={isActive(pathname, "/admin/dashboard")}>
                        Dashboard
                    </Link>
                </li>
                )}
                {!isAuthenticated() ? <>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            to="/signin"
                            style={isActive(pathname, "/signin")}
                        >
                            Signin
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            to="/signup"
                            style={isActive(pathname, "/signup")}
                        >
                            Signup
                        </Link>
                    </li>
                </> : <li className="nav-item">
                    <span
                        className="nav-link"
                        onClick={() =>
                            signout(() => {
                                navigate("/");
                            })
                        }
                        style={{ cursor: "pointer", color: "#ffffff" }}
                    >
                        Signout
                    </span>
                </li>}

            </ul>
        </div>
    );
};

export default Menu;
