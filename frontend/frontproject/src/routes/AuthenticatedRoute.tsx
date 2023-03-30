import React from "react";
import { Navigate } from "react-router-dom";

export interface props {
	authenticated: String | null;
	component: JSX.Element;
}
// 로그인 된 사용자는 로그인, 회원가입 페이지 접근불가
const AuthenticatedRoute = ({
	authenticated,
	component: Component,
}: props): React.ReactElement => {
	return authenticated !== null ? <Navigate to="/"></Navigate> : Component;
};

export default AuthenticatedRoute;
