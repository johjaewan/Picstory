import { Routes, Route } from "react-router-dom";
import Main from "../components/main/main";
import StoryCreatePage from "../pages/storyCreatePage";
import StoryResultPage from "../pages/storyResultPage";
import StoryDetailPage from "../pages/storyDetailPage";
import LibraryPage from "../pages/LibraryPage";
import Loading from "../components/storyCreate/loading";
import NotFound from "../pages/NotFound";
import Layout from "../components/main/Layout";
import Vocabulary from "../pages/vocabulary";
import Menu from "../components/main/menu";
import SignUp from "../components/user/SignUp";
import LoginForm from "../components/user/Login";
import KakaoLogin from "../components/user/KakaoLogin";
import PrivateRoute from "./PrivateRoute";

export default function RoutesSetup() {
	const token: string | null = localStorage.getItem("access_token");

	return (
		<Routes>
			<Route path="/" element={<Main />} />
			<Route path="/login" element={<LoginForm />} />
			<Route path="/kakaoLogin" element={<KakaoLogin />} />
			<Route path="/signUp" element={<SignUp />} />
			<Route element={<Layout />}>
				<Route
					path="/storyCreatePage"
					element={
						<PrivateRoute
							component={<StoryCreatePage />}
							authenticated={token}
						/>
					}
				/>
				<Route
					path="/storyCreatePage"
					element={
						<PrivateRoute
							component={<StoryResultPage />}
							authenticated={token}
						/>
					}
				/>
				<Route
					path="/storyCreatePage"
					element={
						<PrivateRoute component={<LibraryPage />} authenticated={token} />
					}
				/>
				<Route
					path="/storyCreatePage"
					element={
						<PrivateRoute
							component={<StoryDetailPage />}
							authenticated={token}
						/>
					}
				/>
				<Route
					path="/storyCreatePage"
					element={
						<PrivateRoute component={<Vocabulary />} authenticated={token} />
					}
				/>
				<Route
					path="/storyCreatePage"
					element={<PrivateRoute component={<Menu />} authenticated={token} />}
				/>
				{/* <Route path="/storyResult" element={<StoryResultPage />} /> */}
				{/* <Route path="/library" element={<LibraryPage />} /> */}
				{/* <Route path="/storyDetail/:id" element={<StoryDetailPage />} /> */}
				<Route path="/Loading" element={<Loading />} />
				{/* <Route path="/vocabulary" element={<Vocabulary />} /> */}
				{/* <Route path="/menu" element={<Menu />} /> */}
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
