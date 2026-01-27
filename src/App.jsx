import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

export default function App() {
  // Vérifie si un token existe dans localStorage
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem("token"));

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
            isLogged ? <Home /> : <Navigate to="/" />
          }
        />

        {/* Catch-all → redirige vers login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
