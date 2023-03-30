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
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../atoms";
import AuthenticatedRoute from "./AuthenticatedRoute";

export default function RoutesSetup() {
	const token = useRecoilValue(tokenAtom);
	return (
		<Routes>
			<Route path="/" element={<Main />} />
			{/* <Route path="/login" element={<LoginForm />} />
			<Route path="/kakaoLogin" element={<KakaoLogin />} />
			<Route path="/signUp" element={<SignUp />} /> */}
			<Route
				path="/login"
				element={
					<AuthenticatedRoute component={<LoginForm />} authenticated={token} />
				}
			/>
			<Route
				path="/kakaoLogin"
				element={
					<AuthenticatedRoute
						component={<KakaoLogin />}
						authenticated={token}
					/>
				}
			/>
			<Route
				path="/signUp"
				element={
					<AuthenticatedRoute component={<SignUp />} authenticated={token} />
				}
			/>

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
					path="/storyResult"
					element={
						<PrivateRoute
							component={<StoryResultPage />}
							authenticated={token}
						/>
					}
				/>
				<Route
					path="/library"
					element={
						<PrivateRoute component={<LibraryPage />} authenticated={token} />
					}
				/>
				<Route
					path="/storyDetail/:id"
					element={
						<PrivateRoute
							component={<StoryDetailPage />}
							authenticated={token}
						/>
					}
				/>
				<Route
					path="/vocabulary"
					element={
						<PrivateRoute component={<Vocabulary />} authenticated={token} />
					}
				/>
				<Route
					path="/menu"
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
