// PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export interface props {
	authenticated: String | null;
	component: JSX.Element;
}
// 로그인 안 된 사용자는 페이지 접근불가
const PrivateRoute = ({
	authenticated,
	component: Component,
}: props): React.ReactElement => {
	return authenticated ? Component : <Navigate to='/login'></Navigate>;
};

export default PrivateRoute;
