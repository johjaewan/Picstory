// PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export interface props {
	authenticated: String | null;
	component: JSX.Element;
}

const PrivateRoute = ({
	authenticated,
	component: Component,
}: props): React.ReactElement => {
	return authenticated ? Component : <Navigate to="/login"></Navigate>;
};

export default PrivateRoute;
