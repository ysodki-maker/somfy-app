import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

export default function App() {
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem("token"));

  // Fonction logout à passer à Home
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogged(false); // <- mise à jour du state
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={
            isLogged ? (
              <Navigate to="/home" />
            ) : (
              <Login onLoginSuccess={() => setIsLogged(true)} />
            )
          }
        />

        {/* Home protégé */}
        <Route
          path="/home"
          element={
            isLogged ? <Home onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
