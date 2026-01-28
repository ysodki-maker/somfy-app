import { useRef, useState } from "react";
import { createClient, createRideau } from "../api";
import { ClientReviewPrint } from "./ClientReviewPrint";
import html2pdf from "html2pdf.js";

const OPTIONS_ESPACES = [
  "Chambre Enfant",
  "Chambre Parent",
  "Chambre invité",
  "chambre 1",
  "Chambre 2",
  "Chambre 3",
  "Chambre 4",
  "Salon 1",
  "Salon 2",
  "Salon 3",
  "Salon 4",
  "Salon Marocain",
  "Cuisine",
  "Cave",
  "Autre",
];
const OPTIONS_TRINGLES = [
  "Tringle Magicwalls",
  "Tringle Somfy",
  "Tringle Store Bateau",
  "Barre Ø35",
];
const OPTIONS_TYPE_RIDEAU = [
  "Voilage",
  "Blackout",
  "Store Bateau",
  "Enrouleur",
  "Store Bateau et Voilage",
];
const OPTIONS_OUVERTURE = ["Latérale", "Centrale"];
const OPTIONS_CONFECTION = ["Wave", "Plis plats"];
const OPTIONS_AMPLEUR = ["1", "1.5", "2", "2.5", "3"];
const OPTIONS_FINITION_SOL = [
  "à fleur (0,5 cm)",
  "cassant 1 cm",
  "cassant 2 cm",
  "cassant 3 cm",
  "Cassant 4 cm",
  "cassant 5 cm",
];
const OPTIONS_OURLER = ["5cm", "10cm", "15cm", "Bas plombé"];
const OPTIONS_TYPE = ["Manuelle", "Motorisé"];

export default function Home({ onLogout }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [clientData, setClientData] = useState({
    client_name: "",
    projet_name: "",
    ville: "",
    contact_client: "",
  });
  const [espaces, setEspaces] = useState([]);
  const [activeEspaceIndex, setActiveEspaceIndex] = useState(null);
  const [activeRideauIndex, setActiveRideauIndex] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? JSON.parse(storedUser)
    : { id: 1, user_display_name: "Utilisateur Demo" };

  const steps = [
    { id: 1, name: "Client", icon: "👤" },
    { id: 2, name: "Configuration", icon: "✨" },
    { id: 3, name: "Validation", icon: "✓" },
  ];

  const handleClientChange = (e) =>
    setClientData({ ...clientData, [e.target.name]: e.target.value });

  const addEspace = () => {
    const newIndex = espaces.length;
    setEspaces([
      ...espaces,
      {
        id: Date.now(),
        espace_name: "",
        rideaux: [],
      },
    ]);
    setActiveEspaceIndex(newIndex);
    setActiveRideauIndex(null);
  };

  const addRideau = (espaceIndex) => {
    const newEspaces = [...espaces];
    const newRideau = {
      id: Date.now(),
      largeur: "",
      hauteur: "",
      type_tringles: "",
      type_rideau: "",
      type_ouverture: "",
      type_confection: "",
      ampleur: "",
      finition_au_sol: "",
      ref_tissu: "",
      ourlet: "",
      remarque_client: "",
    };
    newEspaces[espaceIndex].rideaux.push(newRideau);
    setEspaces(newEspaces);
    setActiveRideauIndex(newEspaces[espaceIndex].rideaux.length - 1);
  };

  const handleEspaceChange = (index, field, value) => {
    const newEspaces = [...espaces];
    newEspaces[index][field] = value;
    setEspaces(newEspaces);
  };

  const handleRideauChange = (espaceIndex, rideauIndex, field, value) => {
    const newEspaces = [...espaces];
    newEspaces[espaceIndex].rideaux[rideauIndex][field] = value;
    setEspaces(newEspaces);
  };

  const removeEspace = (index) => {
    setEspaces(espaces.filter((_, i) => i !== index));
    if (activeEspaceIndex === index) {
      setActiveEspaceIndex(null);
      setActiveRideauIndex(null);
    }
  };

  const removeRideau = (espaceIndex, rideauIndex) => {
    const newEspaces = [...espaces];
    newEspaces[espaceIndex].rideaux = newEspaces[espaceIndex].rideaux.filter(
      (_, i) => i !== rideauIndex,
    );
    setEspaces(newEspaces);
    if (activeRideauIndex === rideauIndex) {
      setActiveRideauIndex(null);
    }
  };

  const selectEspace = (index) => {
    setActiveEspaceIndex(index);
    setActiveRideauIndex(null);
  };

  const selectRideau = (index) => {
    setActiveRideauIndex(index);
  };

  const validateStep1 = () =>
    clientData.client_name &&
    clientData.projet_name &&
    clientData.ville &&
    clientData.contact_client;

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCompletedSteps([...completedSteps, 1]);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCompletedSteps([...completedSteps, 2]);
      setCurrentStep(3);
    }
  };

  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleSubmitAll = async () => {
    /*setMessage("");
    setLoading(true);

    try {
      if (!validateStep1()) {
        setMessage("Veuillez remplir tous les champs du client.");
        setLoading(false); 
        return;
      }

      const clientResult = await createClient(token, {
        ...clientData,
        owner_id: user.id,
        responsable: user.user_display_name,
      });
      const clientId = clientResult.id;

      for (const espace of espaces) {
        for (const rideau of espace.rideaux) {
          await createRideau(token, {
            ...rideau,
            espace_name: espace.espace_name,
            information_client_id: clientId,
          });
        }
      }

      setMessage("✅ Client et espaces créés avec succès !");
      setClientData({
        client_name: "",
        projet_name: "",
        ville: "",
        contact_client: "",
      });
      setEspaces([]);
      setCurrentStep(1);
      setCompletedSteps([]);*/
      handleDownloadPDF();
    } catch (err) {
      console.error(err);
      setMessage("❌ " + (err.message || "Erreur lors de l'envoi."));
    } finally {
      setLoading(false);
    }
  };

  const printRef = useRef();
  const handleDownloadPDF = () => {
    const element = printRef.current;
    const options = {
      margin: [10, 0, 10, 0],
      filename: `Fiche_${clientData.client_name}_${new Date().toLocaleDateString()}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: "#ffffff",
        windowWidth: 794,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
        before: ".espaceContainer",
        after: ".espaceContainer",
      },
    };
    html2pdf().set(options).from(element).save();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Fond élégant avec motifs subtils */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-100/30 via-transparent to-transparent"></div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDMiLz48L3N2Zz4=')] opacity-60"></div>

      <div className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* En-tête élégant */}
        <div className="text-center mb-16 animate-[fadeIn_0.8s_ease-out]">
          {/* Badge utilisateur + logout intégré */}
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-blue-200/50 px-6 py-3 rounded-full text-sm font-light text-blue-700 mb-4 shadow-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
            <span className="tracking-wide">{user.user_display_name}</span>

            {/* Ligne verticale séparatrice */}
            <div className="w-px h-5 bg-blue-200 mx-3"></div>

            {/* Bouton logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V7"
                />
              </svg>
              Logout
            </button>
          </div>

          <h1 className="text-6xl md:text-7xl font-light text-gray-800 mb-4 tracking-tight">
            Prise de <span className="text-blue-600 font-normal">Mesure</span>
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-light tracking-wide">
            Créez votre espace rideaux
          </p>
        </div>

        {/* Progression minimaliste */}
        <div className="mb-12 animate-[fadeIn_1s_ease-out_0.2s_both]">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200 -translate-y-1/2"></div>
            <div
              className="absolute top-1/2 left-0 h-px bg-gradient-to-r from-blue-400 to-purple-400 -translate-y-1/2 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(59,130,246,0.3)]"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            ></div>

            {steps.map((step, idx) => (
              <div
                key={step.id}
                className="relative flex flex-col items-center gap-4"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-light transition-all duration-500 border-2 ${
                    currentStep === step.id
                      ? "bg-blue-500 text-white border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-110"
                      : completedSteps.includes(step.id)
                        ? "bg-white text-blue-600 border-blue-300 shadow-md"
                        : "bg-white text-gray-400 border-gray-200 shadow-sm"
                  }`}
                >
                  {completedSteps.includes(step.id) ? "✓" : step.icon}
                </div>
                <span
                  className={`text-xs font-light tracking-widest uppercase transition-colors duration-500 ${
                    currentStep === step.id ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-8 px-8 py-5 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg animate-[fadeIn_1s_ease-out_0.4s_both]">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="group px-6 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-light tracking-wide hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 hover:gap-2"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            <span className="text-sm">Précédent</span>
          </button>

          <div className="text-sm font-light text-gray-500 tracking-widest">
            {currentStep} / {steps.length}
          </div>

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              disabled={currentStep === 1 && !validateStep1()}
              className="group px-6 py-2.5 bg-blue-500 text-white rounded-xl font-medium tracking-wide hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 hover:gap-4 shadow-lg shadow-blue-500/30"
            >
              <span className="text-sm">Suivant</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          ) : (
            <button
              onClick={handleSubmitAll}
              disabled={loading}
              className="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold tracking-wide hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-sm">Création...</span>
                </>
              ) : (
                <span className="text-sm">✓ Valider</span>
              )}
            </button>
          )}
        </div>

        {/* Message */}
        {message && (
          <div
            className={`max-w-2xl mx-auto mb-8 p-5 rounded-2xl backdrop-blur-xl border transition-all duration-500 animate-[fadeIn_0.5s_ease-out] ${
              message.includes("succès")
                ? "bg-emerald-50/80 text-emerald-700 border-emerald-300/50"
                : "bg-red-50/80 text-red-700 border-red-300/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">
                {message.includes("succès") ? "✓" : "⚠"}
              </span>
              <span className="font-light tracking-wide">{message}</span>
            </div>
          </div>
        )}

        {/* Étape 1 - Formulaire client */}
        {currentStep === 1 && (
          <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-10 shadow-xl animate-[fadeIn_0.6s_ease-out]">
            <div className="mb-10">
              <h2 className="text-3xl font-light text-gray-800 mb-2 tracking-tight">
                Informations Client
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-blue-400/60 to-transparent mb-4"></div>
              <p className="text-gray-600 font-light">
                Détails essentiels du projet
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "client_name",
                  label: "Nom du client",
                  placeholder: "Jean Dupont",
                },
                {
                  name: "projet_name",
                  label: "Nom du projet",
                  placeholder: "Villa Moderne",
                },
                { name: "ville", label: "Ville", placeholder: "Casablanca" },
                {
                  name: "contact_client",
                  label: "Contact",
                  placeholder: "+212 6XX XXX XXX",
                },
              ].map((field, idx) => (
                <div
                  key={field.name}
                  className="group"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <label className="block text-xs font-light text-gray-600 mb-3 tracking-widest uppercase">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    value={clientData[field.name]}
                    onChange={handleClientChange}
                    placeholder={field.placeholder}
                    className="w-full px-5 py-4 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 font-light focus:bg-white focus:border-blue-400 outline-none transition-all duration-300 focus:shadow-lg focus:shadow-blue-100"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Étape 2 - Configuration 3 colonnes */}
        {currentStep === 2 && (
          <div className="grid grid-cols-12 gap-6 animate-[fadeIn_0.6s_ease-out]">
            {/* Sidebar - Espaces */}
            <div className="col-span-12 lg:col-span-3">
              <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-xl sticky top-6">
                <h3 className="text-lg font-light text-gray-800 mb-6 tracking-tight flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Espaces
                </h3>

                <div className="space-y-2 mb-6 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {espaces.map((espace, index) => (
                    <button
                      key={espace.id}
                      onClick={() => selectEspace(index)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl font-light transition-all duration-300 group ${
                        activeEspaceIndex === index
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                              activeEspaceIndex === index
                                ? "bg-white/20 text-white"
                                : "bg-white text-blue-600"
                            }`}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="truncate text-sm tracking-wide">
                            {espace.espace_name || "Sans nom"}
                          </span>
                        </div>
                        <span
                          className={`text-xs ml-2 ${
                            activeEspaceIndex === index
                              ? "text-white/70"
                              : "text-gray-500"
                          }`}
                        >
                          {espace.rideaux.length}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={addEspace}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3.5 rounded-xl font-light tracking-wide hover:bg-gray-100 hover:border-blue-400 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span className="text-blue-500 group-hover:scale-110 transition-transform duration-300">
                    +
                  </span>
                  <span className="text-sm">Nouvel espace</span>
                </button>
              </div>
            </div>

            {/* Panel central - Détails espace + Rideaux */}
            <div className="col-span-12 lg:col-span-4">
              {activeEspaceIndex !== null ? (
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-light text-gray-800 tracking-tight flex items-center gap-3">
                      <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-lg font-medium tracking-widest">
                        ESPACE {String(activeEspaceIndex + 1).padStart(2, "0")}
                      </span>
                    </h3>
                    <button
                      onClick={() => removeEspace(activeEspaceIndex)}
                      className="text-red-500/70 hover:text-red-600 text-sm font-light px-3 py-1.5 hover:bg-red-50 rounded-lg transition-all duration-300"
                    >
                      Supprimer
                    </button>
                  </div>

                  <div className="mb-8">
                    <label className="block text-xs font-light text-gray-600 mb-3 tracking-widest uppercase">
                      Type d'espace
                    </label>
                    <select
                      value={espaces[activeEspaceIndex]?.espace_name}
                      onChange={(e) =>
                        handleEspaceChange(
                          activeEspaceIndex,
                          "espace_name",
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 font-light focus:bg-white focus:border-blue-400 outline-none transition-all duration-300"
                    >
                      <option value="" className="bg-white">
                        Sélectionner...
                      </option>
                      {OPTIONS_ESPACES.map((opt) => (
                        <option key={opt} value={opt} className="bg-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="border-t border-gray-200 pt-8">
                    <h4 className="text-sm font-light text-gray-600 mb-4 tracking-widest uppercase flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      Rideaux ({espaces[activeEspaceIndex]?.rideaux.length})
                    </h4>

                    <div className="space-y-2 mb-4 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                      {espaces[activeEspaceIndex]?.rideaux.map(
                        (rideau, rIndex) => (
                          <button
                            key={rideau.id}
                            onClick={() => selectRideau(rIndex)}
                            className={`w-full text-left px-4 py-3 rounded-xl font-light transition-all duration-300 ${
                              activeRideauIndex === rIndex
                                ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-300/50 shadow-md"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span
                                  className={`text-xs font-medium px-2.5 py-0.5 rounded-lg ${
                                    activeRideauIndex === rIndex
                                      ? "bg-blue-200/50"
                                      : "bg-white"
                                  }`}
                                >
                                  R{rIndex + 1}
                                </span>
                                <span className="truncate text-sm">
                                  {rideau.type_rideau || "Non configuré"}
                                </span>
                              </div>
                              {rideau.largeur && rideau.hauteur && (
                                <span className="text-xs opacity-60 ml-2">
                                  {rideau.largeur}×{rideau.hauteur}
                                </span>
                              )}
                            </div>
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      onClick={() => addRideau(activeEspaceIndex)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 rounded-xl font-light hover:bg-gray-100 hover:border-blue-400 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      <span className="group-hover:scale-110 transition-transform duration-300">
                        +
                      </span>
                      <span className="text-sm">Ajouter rideau</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-12 shadow-xl text-center">
                  <div className="text-6xl mb-6 opacity-30">✨</div>
                  <h3 className="text-xl font-light text-gray-800 mb-3 tracking-tight">
                    Sélectionnez un espace
                  </h3>
                  <p className="text-gray-500 font-light text-sm tracking-wide mb-8">
                    ou créez-en un nouveau
                  </p>
                  <button
                    onClick={addEspace}
                    className="bg-blue-500 text-white px-8 py-3 rounded-xl font-medium tracking-wide hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/30"
                  >
                    Créer un espace
                  </button>
                </div>
              )}
            </div>

            {/* Panel droite - Formulaire rideau */}
            <div className="col-span-12 lg:col-span-5">
              {activeEspaceIndex !== null && activeRideauIndex !== null ? (
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-light text-gray-800 tracking-tight flex items-center gap-3">
                      <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-lg font-medium tracking-widest">
                        RIDEAU {String(activeRideauIndex + 1).padStart(2, "0")}
                      </span>
                    </h3>
                    {espaces[activeEspaceIndex]?.rideaux.length > 1 && (
                      <button
                        onClick={() =>
                          removeRideau(activeEspaceIndex, activeRideauIndex)
                        }
                        className="text-red-500/70 hover:text-red-600 text-sm font-light px-3 py-1.5 hover:bg-red-50 rounded-lg transition-all duration-300"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>

                  <div className="space-y-5 max-h-[600px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {/* Dimensions */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-light text-gray-600 mb-2 tracking-widest uppercase">
                          Largeur (cm)
                        </label>
                        <input
                          type="number"
                          placeholder="250"
                          value={
                            espaces[activeEspaceIndex]?.rideaux[
                              activeRideauIndex
                            ].largeur
                          }
                          onChange={(e) =>
                            handleRideauChange(
                              activeEspaceIndex,
                              activeRideauIndex,
                              "largeur",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 font-light focus:bg-white focus:border-blue-400 outline-none transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-light text-gray-600 mb-2 tracking-widest uppercase">
                          Hauteur (cm)
                        </label>
                        <input
                          type="number"
                          placeholder="280"
                          value={
                            espaces[activeEspaceIndex]?.rideaux[
                              activeRideauIndex
                            ].hauteur
                          }
                          onChange={(e) =>
                            handleRideauChange(
                              activeEspaceIndex,
                              activeRideauIndex,
                              "hauteur",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 font-light focus:bg-white focus:border-blue-400 outline-none transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Sélections */}
                    {[
                      {
                        field: "type_tringles",
                        label: "Type de tringles",
                        options: OPTIONS_TRINGLES,
                      },
                      {
                        field: "type_rideau",
                        label: "Type de rideau",
                        options: OPTIONS_TYPE_RIDEAU,
                      },
                      {
                        field: "type_ouverture",
                        label: "Ouverture",
                        options: OPTIONS_OUVERTURE,
                      },
                      {
                        field: "type_confection",
                        label: "Confection",
                        options: OPTIONS_CONFECTION,
                      },
                      {
                        field: "ampleur",
                        label: "Ampleur",
                        options: OPTIONS_AMPLEUR,
                      },
                      {
                        field: "finition_au_sol",
                        label: "Finition sol",
                        options: OPTIONS_FINITION_SOL,
                      },
                      {
                        field: "ref_tissu",
                        label: "Référence tissu",
                        options: OPTIONS_TYPE,
                      },
                      {
                        field: "ourlet",
                        label: "Ourlet",
                        options: OPTIONS_OURLER,
                      },
                    ].map((item) => (
                      <div key={item.field}>
                        <label className="block text-xs font-light text-gray-600 mb-2 tracking-widest uppercase">
                          {item.label}
                        </label>
                        <select
                          value={
                            espaces[activeEspaceIndex]?.rideaux[
                              activeRideauIndex
                            ][item.field]
                          }
                          onChange={(e) =>
                            handleRideauChange(
                              activeEspaceIndex,
                              activeRideauIndex,
                              item.field,
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 font-light focus:bg-white focus:border-blue-400 outline-none transition-all duration-300"
                        >
                          <option value="" className="bg-white">
                            Sélectionner...
                          </option>
                          {item.options.map((opt) => (
                            <option key={opt} value={opt} className="bg-white">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}

                    <div>
                      <label className="block text-xs font-light text-gray-600 mb-2 tracking-widest uppercase">
                        Remarques
                      </label>
                      <textarea
                        placeholder="Notes spéciales..."
                        value={
                          espaces[activeEspaceIndex]?.rideaux[activeRideauIndex]
                            .remarque_client
                        }
                        onChange={(e) =>
                          handleRideauChange(
                            activeEspaceIndex,
                            activeRideauIndex,
                            "remarque_client",
                            e.target.value,
                          )
                        }
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 font-light focus:bg-white focus:border-blue-400 outline-none transition-all duration-300 resize-none"
                      />
                    </div>
                  </div>
                </div>
              ) : activeEspaceIndex !== null ? (
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-12 shadow-xl text-center">
                  <div className="text-6xl mb-6 opacity-30">🪟</div>
                  <h3 className="text-xl font-light text-gray-800 mb-3 tracking-tight">
                    Sélectionnez un rideau
                  </h3>
                  <p className="text-gray-500 font-light text-sm tracking-wide mb-8">
                    ou créez-en un nouveau
                  </p>
                  <button
                    onClick={() => addRideau(activeEspaceIndex)}
                    className="bg-blue-500 text-white px-8 py-3 rounded-xl font-medium tracking-wide hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/30"
                  >
                    Créer un rideau
                  </button>
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-12 shadow-xl text-center">
                  <div className="text-6xl mb-6 opacity-20">←</div>
                  <h3 className="text-xl font-light text-gray-800 mb-3 tracking-tight">
                    Commencez par un espace
                  </h3>
                  <p className="text-gray-500 font-light text-sm tracking-wide">
                    Sélectionnez ou créez un espace
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Étape 3 */}
        {currentStep === 3 && (
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-xl animate-[fadeIn_0.6s_ease-out]">
            <div className="flex justify-end gap-4 mb-8">
              <button
                onClick={handleDownloadPDF}
                className="bg-gray-50 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-light tracking-wide hover:bg-gray-100 hover:border-blue-400 transition-all duration-300 flex items-center gap-3"
              >
                <span className="text-sm">Générer PDF</span>
              </button>
            </div>

            <div ref={printRef}>
              <ClientReviewPrint clientData={clientData} espaces={espaces} />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: rgba(209, 213, 219, 0.6);
          border-radius: 3px;
        }

        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

