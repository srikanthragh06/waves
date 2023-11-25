import AuthPage from "./pages/authPage/AuthPage";
import { Route, Routes, useLocation } from "react-router-dom";
import NotFound from "./pages/notFound/NotFound";
import Home from "./pages/home/Home";
import MainNavbar from "./navbar/MainNavbar";
import Profile from "./pages/profile/Profile";

function App() {
    const location = useLocation();
    const showNavbarPaths = ["/", "/profile"];

    return (
        <div
            className="flex flex-col space-y-2  w-[100vw] h-[100vh] bg-color5 
                        sm:flex-row sm:space-y-0 sm:space-x-0 sm:items-center
                         overflow-auto"
        >
            {showNavbarPaths.includes(location.pathname) && <MainNavbar />}
            <Routes>
                <Route path="/auth" element={<AuthPage />}></Route>
                <Route path="/" element={<Home />}></Route>
                <Route path="/profile" element={<Profile />}></Route>
                <Route path="*" element={<NotFound />}></Route>
            </Routes>
        </div>
    );
}

export default App;
