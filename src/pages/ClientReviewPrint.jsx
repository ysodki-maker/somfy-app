import React, { forwardRef } from "react";

export const ClientReviewPrint = forwardRef(({ clientData, espaces }, ref) => {
  const today = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div ref={ref} style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.brandSection}>
            <img
              src="https://crm.magicwalls.ma/wp-content/uploads/2024/11/somfy-logo.webp"
              alt="Somfy"
              style={styles.logo}
              crossOrigin="anonymous"
            />
            <div style={styles.brandInfo}>
              <div style={styles.brandName}>SOMFY</div>
              <div style={styles.brandTagline}>Bordeaux Production</div>
            </div>
          </div>
          <div style={styles.docInfo}>
            <div style={styles.docTitle}>FICHE DE PRODUCTION</div>
            <div style={styles.docMeta}>{today} · Ref: FP-{new Date().getTime().toString().slice(-6)}</div>
          </div>
        </div>
      </div>

      {/* CLIENT INFO */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Informations client</div>
        <div style={styles.clientGrid}>
          <div style={styles.field}>
            <span style={styles.fieldLabel}>Client</span>
            <span style={styles.fieldValue}>{clientData.client_name}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.fieldLabel}>Projet</span>
            <span style={styles.fieldValue}>{clientData.projet_name}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.fieldLabel}>Ville</span>
            <span style={styles.fieldValue}>{clientData.ville}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.fieldLabel}>Contact</span>
            <span style={styles.fieldValue}>{clientData.contact_client}</span>
          </div>
        </div>
      </div>

      {/* ESPACES */}
      {espaces.map((espace, index) => (
        <div key={index} style={styles.section}>
          {/* Espace Title */}
          <div style={styles.espaceTitle}>
            <span style={styles.espaceTitleText}>
              {index + 1}. {espace.espace_name}
            </span>
            <span style={styles.espaceCount}>
              {espace.rideaux.length} rideau{espace.rideaux.length > 1 ? "x" : ""}
            </span>
          </div>

          {/* Rideaux */}
          {espace.rideaux.map((rideau, idx) => (
            <div key={idx} style={styles.rideauCard}>
              {/* Header */}
              <div style={styles.rideauHeader}>
                <span style={styles.rideauNumber}>{idx + 1}</span>
                <span style={styles.rideauRef}>{rideau.ref_tissu}</span>
                <span style={styles.rideauAmpleur}>{rideau.ampleur}</span>
              </div>

              {/* Content */}
              <div style={styles.rideauContent}>
                <div style={styles.row}>
                  <div style={styles.col}>
                    <span style={styles.label}>Largeur</span>
                    <span style={styles.value}>{rideau.largeur} cm</span>
                  </div>
                  <div style={styles.col}>
                    <span style={styles.label}>Hauteur</span>
                    <span style={styles.value}>{rideau.hauteur} cm</span>
                  </div>
                  <div style={styles.col}>
                    <span style={styles.label}>Confection</span>
                    <span style={styles.value}>{rideau.type_confection}</span>
                  </div>
                </div>

                <div style={styles.row}>
                  <div style={styles.col}>
                    <span style={styles.label}>Tringles</span>
                    <span style={styles.value}>{rideau.type_tringles}</span>
                  </div>
                  <div style={styles.col}>
                    <span style={styles.label}>Type</span>
                    <span style={styles.value}>{rideau.type_rideau}</span>
                  </div>
                  <div style={styles.col}>
                    <span style={styles.label}>Ouverture</span>
                    <span style={styles.value}>{rideau.type_ouverture}</span>
                  </div>
                </div>

                <div style={styles.row}>
                  <div style={styles.col}>
                    <span style={styles.label}>Finition au sol</span>
                    <span style={styles.value}>{rideau.finition_au_sol}</span>
                  </div>
                  <div style={styles.col}>
                    <span style={styles.label}>Ourlet</span>
                    <span style={styles.value}>{rideau.ourlet}</span>
                  </div>
                </div>

                {rideau.remarque_client && (
                  <div style={styles.remarque}>
                    <span style={styles.remarqueLabel}>Remarque :</span>
                    <span style={styles.remarqueText}>{rideau.remarque_client}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* FOOTER */}
      <div style={styles.footer}>
        <span>Bordeaux Production Rideaux</span>
        <span style={styles.footerSep}>·</span>
        <span>{new Date().toLocaleString("fr-FR")}</span>
        <span style={styles.footerSep}>·</span>
        <span>{espaces.length} espace{espaces.length > 1 ? "s" : ""}</span>
      </div>
    </div>
  );
});

const styles = {
  container: {
    width: "794px",
    padding: "48px 56px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: "#ffffff",
    color: "#000",
    margin: "0 auto",
    boxSizing: "border-box",
    minHeight: "1123px",
    lineHeight: "1.5",
  },

  /* HEADER */
  header: {
    marginBottom: "48px",
    paddingBottom: "24px",
    borderBottom: "1px solid #000",
  },

  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  brandSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  logo: {
    height: "40px",
    width: "auto",
    objectFit: "contain",
  },

  brandInfo: {
    display: "flex",
    flexDirection: "column",
  },

  brandName: {
    fontSize: "16px",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },

  brandTagline: {
    fontSize: "12px",
    color: "#666",
    fontWeight: "400",
  },

  docInfo: {
    textAlign: "right",
  },

  docTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "4px",
  },

  docMeta: {
    fontSize: "11px",
    color: "#666",
  },

  /* SECTION */
  section: {
    marginBottom: "40px",
  },

  sectionTitle: {
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#999",
    marginBottom: "16px",
  },

  /* CLIENT GRID */
  clientGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px 24px",
    paddingBottom: "32px",
    borderBottom: "1px solid #e5e5e5",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  fieldLabel: {
    fontSize: "10px",
    color: "#999",
    fontWeight: "500",
  },

  fieldValue: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#000",
  },

  /* ESPACE */
  espaceTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "20px",
    paddingBottom: "8px",
    borderBottom: "1px solid #000",
  },

  espaceTitleText: {
    fontSize: "16px",
    fontWeight: "600",
  },

  espaceCount: {
    fontSize: "11px",
    color: "#666",
  },

  /* RIDEAU CARD */
  rideauCard: {
    marginBottom: "16px",
    border: "1px solid #e5e5e5",
  },

  rideauHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderBottom: "1px solid #e5e5e5",
    background: "#fafafa",
  },

  rideauNumber: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#666",
  },

  rideauRef: {
    fontSize: "13px",
    fontWeight: "600",
    flex: 1,
  },

  rideauAmpleur: {
    fontSize: "12px",
    fontWeight: "600",
    padding: "2px 8px",
    border: "1px solid #000",
  },

  rideauContent: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },

  col: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  label: {
    fontSize: "10px",
    color: "#999",
    fontWeight: "500",
  },

  value: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#000",
  },

  remarque: {
    marginTop: "4px",
    padding: "12px",
    background: "#fffef0",
    border: "1px solid #f0e68c",
    display: "flex",
    gap: "8px",
  },

  remarqueLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#666",
  },

  remarqueText: {
    fontSize: "11px",
    color: "#333",
    flex: 1,
  },

  /* FOOTER */
  footer: {
    marginTop: "64px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e5e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "10px",
    color: "#999",
  },

  footerSep: {
    color: "#ccc",
  },
};

