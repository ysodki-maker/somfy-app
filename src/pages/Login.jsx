import { useState } from "react";
import { loginUser } from "../api";
import {jwtDecode} from "jwt-decode"; // ✅ correct
import { useNavigate } from "react-router-dom";

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(username, password);

      if (!data.token) {
        throw new Error("Impossible de récupérer le token. Vérifiez vos identifiants.");
      }

      // Stocker le token
      localStorage.setItem("token", data.token);

      // Décoder pour récupérer ID et display_name
      const decoded = jwtDecode(data.token);

      const user = {
        id: decoded.data.user.id,
        user_display_name: data.user_display_name,
        user_email: data.user_email,
        user_nicename: data.user_nicename,
      };

      localStorage.setItem("user", JSON.stringify(user));
    onLoginSuccess();
      navigate("/home");
    } catch (err) {
      console.error("Erreur login:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">Connexion</h1>
          <p className="mt-2 text-sm text-gray-500">Accédez à votre compte</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
