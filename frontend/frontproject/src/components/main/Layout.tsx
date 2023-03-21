import { Outlet } from "react-router-dom";
import TheHeader from "./TheHeader";

const Layout = () => {
	return (
		<div>
			<header>
				<TheHeader></TheHeader>
			</header>
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default Layout;
