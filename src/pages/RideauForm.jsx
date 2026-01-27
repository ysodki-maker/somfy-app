import { useState } from "react";
import { createRideau } from "../api";

export default function RideauForm({ clientId, token }) {
  const espaceOptions = ["Chambre", "Salon", "Cuisine", "Bureau"];
  const typeTringlesOptions = ["Standard", "Double", "Motorisé"];
  const typeRideauOptions = ["Voilage", "Occultant", "Thermique"];
  const typeOuvertureOptions = ["Latérale", "Centrale"];
  const typeConfectionOptions = ["Pli simple", "Pli français"];
  const finitionAuSolOptions = ["Oui", "Non"];
  const ourletOptions = ["Oui", "Non"];
  const ampleurOptions = ["Standard", "Large"];
  const typeOptions = ["Tissu", "Velours", "Lin"];

  const [espaceName, setEspaceName] = useState("");
  const [nombreRideaux, setNombreRideaux] = useState(0);
  const [rideaux, setRideaux] = useState([]);
  const [message, setMessage] = useState("");

  // Générer le tableau rideaux quand le nombre change
  const handleNombreRideauxChange = (e) => {
    const nombre = parseInt(e.target.value) || 0;
    setNombreRideaux(nombre);

    const nouveauxRideaux = Array.from({ length: nombre }, (_, i) => rideaux[i] || {
      largeur: "",
      hauteur: "",
      type_tringles: "",
      type_rideau: "",
      type_ouverture: "",
      type_confection: "",
      finition_au_sol: "",
      ourlet: "",
      ampleur: "",
      type: "",
      remarque_client: ""
    });

    setRideaux(nouveauxRideaux);
  };

  // Mise à jour d'un champ d'un rideau
  const handleRideauChange = (index, field, value) => {
    const updated = [...rideaux];
    updated[index][field] = value;
    setRideaux(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!espaceName || rideaux.length === 0) {
      setMessage("Veuillez remplir le nom de l'espace et le nombre de rideaux.");
      return;
    }

    try {
      for (let i = 0; i < rideaux.length; i++) {
        const rideauData = {
          ...rideaux[i],
          information_client_id: clientId,
          espace_name: espaceName
        };
        await createRideau(token, rideauData);
      }
      setMessage("Tous les rideaux ont été créés avec succès !");
      // Réinitialiser le formulaire
      setEspaceName("");
      setNombreRideaux(0);
      setRideaux([]);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      <h2>Ajouter un espace rideaux</h2>

      {/* Sélection de l'espace */}
      <label>
        Nom de l'espace
        <select value={espaceName} onChange={(e) => setEspaceName(e.target.value)}>
          <option value="">Sélectionnez</option>
          {espaceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </label>

      {/* Nombre de rideaux */}
      <label>
        Nombre de rideaux
        <input type="number" min="0" value={nombreRideaux} onChange={handleNombreRideauxChange} />
      </label>

      {/* Champs dynamiques pour chaque rideau */}
      {rideaux.map((rideau, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}>
          <h3>Rideau {i + 1}</h3>
          <input placeholder="Largeur" value={rideau.largeur} onChange={e => handleRideauChange(i, "largeur", e.target.value)} />
          <input placeholder="Hauteur" value={rideau.hauteur} onChange={e => handleRideauChange(i, "hauteur", e.target.value)} />

          <label>Type tringles
            <select value={rideau.type_tringles} onChange={e => handleRideauChange(i, "type_tringles", e.target.value)}>
              <option value="">Sélectionnez</option>
              {typeTringlesOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </label>

          <label>Type rideau
            <select value={rideau.type_rideau} onChange={e => handleRideauChange(i, "type_rideau", e.target.value)}>
              <option value="">Sélectionnez</option>
              {typeRideauOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </label>

          <label>Type ouverture
            <select value={rideau.type_ouverture} onChange={e => handleRideauChange(i, "type_ouverture", e.target.value)}>
              <option value="">Sélectionnez</option>
              {typeOuvertureOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </label>

          <label>Type confection
            <select value={rideau.type_confection} onChange={e => handleRideauChange(i, "type_confection", e.target.value)}>
              <option value="">Sélectionnez</option>
              {typeConfectionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </label>

          <label>Finition au sol
            <select value={rideau.finition_au_sol} onChange={e => handleRideauChange(i, "finition_au_sol", e.target.value)}>
              <option value="">Sélectionnez</option>
              {finitionAuSolOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </label>

          <label>Ourlet
            <select value={rideau.ourlet} onChange={e => handleRideauChange(i, "ourlet", e.target.value)}>
              <option value="">Sélectionnez</option>
              {ourletOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </label>

          <label>Ampleur
            <select value={rideau.ampleur} onChange={e => handleRideauChange(i, "ampleur", e.target.value)}>
              <option value="">Sélectionnez</option>
              {ampleurOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </label>

          <label>Type
            <select value={rideau.type} onChange={e => handleRideauChange(i, "type", e.target.value)}>
              <option value="">Sélectionnez</option>
              {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </label>

          <input placeholder="Remarque client" value={rideau.remarque_client} onChange={e => handleRideauChange(i, "remarque_client", e.target.value)} />
        </div>
      ))}

      <button type="submit" style={{ marginTop: 10 }}>Créer tous les rideaux</button>
      {message && <p>{message}</p>}
    </form>
  );
}
