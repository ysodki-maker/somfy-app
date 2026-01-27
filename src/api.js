import { jwtDecode } from "jwt-decode";

const API_URL = "https://crm.magicwalls.ma/wp-json";

export async function loginUser(username, password) {
    const response = await fetch(`${API_URL}/jwt-auth/v1/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Erreur API :", data);
        throw new Error(data.message || "Erreur inconnue");
    }

    // Ici, data.token est garanti valide
    const decoded = jwtDecode(data.token);
    data.userId = decoded.data.user.id;

    return data;
}

export async function createClient(token, clientData) {
    const response = await fetch(`https://crm.magicwalls.ma/wp-json/information-clients/v1/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // JWT pour authentification
        },
        body: JSON.stringify(clientData)
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Erreur API création client :", data);
        throw new Error(data.message || "Erreur lors de la création du client");
    }

    return data; // Contient le client créé
}

export async function createRideau(token, rideauData) {
  const response = await fetch(`${API_URL}/espaces-rideaux/v1/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(rideauData)
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Erreur API création rideau :", data);
    throw new Error(data.message || "Erreur lors de la création de l'espace rideaux");
  }

  return data;
}