import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AnimalProfilePage from "./pages/AnimalProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import AdoptionPage from "./pages/AdoptionPage";

function App() {
  const { error } = useAuth0();
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/animal-profile/:id" element={<AnimalProfilePage />} />
        <Route path="/user-profile" element={<UserProfilePage />} />
        <Route path="/adopt-me/:id" element={<AdoptionPage />} />
      </Routes>
    </Router>
  );
}

/* export default App; */
export default withAuthenticationRequired(App, {
  onRedirecting: () => <div>Loading...</div>,
});
