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
import UserPage from "../pages/userPage";
import UserSignUp from "../components/user/UserSignUp";
import LoginForm from "../components/user/Login";

export default function RoutesSetup() {
	return (
		<Routes>
			<Route path="/" element={<Main />} />
			<Route element={<Layout />}>
				<Route path="/user" element={<UserPage />} />
				<Route path="/LoginForm" element={<LoginForm />} />
				<Route path="/signUp" element={<UserSignUp />} />
				<Route path="/storyCreatePage" element={<StoryCreatePage />} />
				<Route path="/storyResult" element={<StoryResultPage />} />
				<Route path="/library" element={<LibraryPage />} />
				<Route path="/storyDetail/:id" element={<StoryDetailPage />} />
				<Route path="/Loading" element={<Loading />} />
				<Route path="/vocabulary" element={<Vocabulary />} />
				<Route path="/menu" element={<Menu />} />
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
