import React, { forwardRef } from "react";

export const ClientReviewPrint = forwardRef(({ clientData, espaces }, ref) => {
  const today = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div ref={ref} style={styles.container}>
      {/* COMPACT HEADER */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.brandSection}>
            <div style={styles.brandInfo}>
              <div style={styles.brandName}>SOMFY</div>
              <div style={styles.brandTagline}>Bordeaux Production</div>
            </div>
          </div>
          
          <div style={styles.headerRight}>
            <div style={styles.docTitle}>FICHE DE PRODUCTION</div>
            <div style={styles.docMeta}>
              {today} · Ref: FP-{new Date().getTime().toString().slice(-6)}
            </div>
          </div>
        </div>
      </div>

      {/* COMPACT CLIENT INFO - Single Line */}
      <div style={styles.clientSection}>
        <div style={styles.clientRow}>
          <div style={styles.clientField}>
            <span style={styles.clientLabel}>Client:</span>
            <span style={styles.clientValue}>{clientData.client_name}</span>
          </div>
          <div style={styles.clientField}>
            <span style={styles.clientLabel}>Projet:</span>
            <span style={styles.clientValue}>{clientData.projet_name}</span>
          </div>
          <div style={styles.clientField}>
            <span style={styles.clientLabel}>Ville:</span>
            <span style={styles.clientValue}>{clientData.ville}</span>
          </div>
          <div style={styles.clientField}>
            <span style={styles.clientLabel}>Contact:</span>
            <span style={styles.clientValue}>{clientData.contact_client}</span>
          </div>
        </div>
      </div>

      {/* ESPACES - EXPANDED */}
      {espaces.map((espace, index) => (
        <div key={index} style={styles.espaceSection}>
          {/* Espace Header */}
          <div style={styles.espaceHeader}>
            <div style={styles.espaceHeaderLeft}>
              <span style={styles.espaceNumber}>{index + 1}</span>
              <span style={styles.espaceName}>{espace.espace_name}</span>
            </div>
            <span style={styles.espaceCount}>
              {espace.rideaux.length} rideau{espace.rideaux.length > 1 ? "x" : ""}
            </span>
          </div>

          {/* Rideaux Table */}
          <div style={styles.rideauxTable}>
            {espace.rideaux.map((rideau, idx) => (
              <div key={idx} style={styles.rideauRow}>
                {/* Row Header */}
                <div style={styles.rideauRowHeader}>
                  <span style={styles.rideauIndex}>#{idx + 1}</span>
                  <span style={styles.rideauRef}>Ref: {rideau.ref_tissu}</span>
                  <span style={styles.rideauAmpleur}>Ampleur: {rideau.ampleur}</span>
                </div>

                {/* Row Content - 3 columns layout */}
                <div style={styles.rideauGrid}>
                  {/* Column 1: Dimensions */}
                  <div style={styles.rideauColumn}>
                    <div style={styles.columnTitle}>Dimensions</div>
                    <div style={styles.dataRow}>
                      <span style={styles.dataLabel}>Largeur:</span>
                      <span style={styles.dataValue}>{rideau.largeur} cm</span>
                    </div>
                    <div style={styles.dataRow}>
                      <span style={styles.dataLabel}>Hauteur:</span>
                      <span style={styles.dataValue}>{rideau.hauteur} cm</span>
                    </div>
                  </div>

                  {/* Column 2: Configuration */}
                  <div style={styles.rideauColumn}>
                    <div style={styles.columnTitle}>Configuration</div>
                    <div style={styles.dataRow}>
                      <span style={styles.dataLabel}>Confection:</span>
                      <span style={styles.dataValue}>{rideau.type_confection}</span>
                    </div>
                    <div style={styles.dataRow}>
                      <span style={styles.dataLabel}>Type:</span>
                      <span style={styles.dataValue}>{rideau.type_rideau}</span>
                    </div>
                    <div style={styles.dataRow}>
                      <span style={styles.dataLabel}>Tringles:</span>
                      <span style={styles.dataValue}>{rideau.type_tringles}</span>
                    </div>
                  </div>

                  {/* Column 3: Finitions */}
                  <div style={styles.rideauColumn}>
                    <div style={styles.columnTitle}>Finitions</div>
                    <div style={styles.dataRow}>
                      <span style={styles.dataLabel}>Ouverture:</span>
                      <span style={styles.dataValue}>{rideau.type_ouverture}</span>
                    </div>
                    <div style={styles.dataRow}>
                      <span style={styles.dataLabel}>Finition sol:</span>
                      <span style={styles.dataValue}>{rideau.finition_au_sol}</span>
                    </div>
                    <div style={styles.dataRow}>
                      <span style={styles.dataLabel}>Ourlet:</span>
                      <span style={styles.dataValue}>{rideau.ourlet}</span>
                    </div>
                  </div>
                </div>

                {/* Remarque - Full Width */}
                {rideau.remarque_client && (
                  <div style={styles.remarqueRow}>
                    <span style={styles.remarqueIcon}>📝</span>
                    <span style={styles.remarqueText}>{rideau.remarque_client}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

     
    </div>
  );
});

const styles = {
  container: {
    width: "794px",
    padding: "40px 48px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: "#ffffff",
    color: "#000",
    margin: "0 auto",
    boxSizing: "border-box",
    minHeight: "1123px",
    lineHeight: "1.4",
  },

  /* COMPACT HEADER */
  header: {
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "2px solid #000",
  },

  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brandSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logo: {
    height: "32px",
    width: "auto",
    objectFit: "contain",
  },

  brandInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  brandName: {
    fontSize: "25px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },

  brandTagline: {
    fontSize: "10px",
    color: "#666",
    fontWeight: "500",
  },

  headerRight: {
    textAlign: "right",
  },

  docTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "2px",
  },

  docMeta: {
    fontSize: "10px",
    color: "#666",
  },

  /* COMPACT CLIENT SECTION */
  clientSection: {
    marginBottom: "32px",
    padding: "12px 16px",
    background: "#f8f9fa",
    border: "1px solid #e0e0e0",
  },

  clientRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px 20px",
  },

  clientField: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flex: "0 0 auto",
  },

  clientLabel: {
    fontSize: "9px",
    color: "#666",
    fontWeight: "600",
    textTransform: "uppercase",
  },

  clientValue: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#000",
  },

  /* ESPACE SECTION - EXPANDED */
  espaceSection: {
    marginBottom: "32px",
    pageBreakInside: "avoid",
  },

  espaceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    padding: "10px 16px",
    background: "#000",
    color: "#fff",
  },

  espaceHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  espaceNumber: {
    fontSize: "14px",
    fontWeight: "700",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    color: "#000",
    borderRadius: "50%",
  },

  espaceName: {
    fontSize: "15px",
    fontWeight: "600",
  },

  espaceCount: {
    fontSize: "11px",
    fontWeight: "600",
    padding: "4px 12px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "12px",
  },

  /* RIDEAUX TABLE */
  rideauxTable: {
    border: "1px solid #e0e0e0",
  },

  rideauRow: {
    borderBottom: "1px solid #e0e0e0",
  },

  rideauRowHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 16px",
    background: "#f8f9fa",
    borderBottom: "1px solid #e0e0e0",
  },

  rideauIndex: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#666",
    minWidth: "30px",
  },

  rideauRef: {
    fontSize: "13px",
    fontWeight: "700",
    flex: 1,
    color: "#000",
  },

  rideauAmpleur: {
    fontSize: "11px",
    fontWeight: "700",
    padding: "4px 10px",
    background: "#000",
    color: "#fff",
    borderRadius: "4px",
  },

  /* RIDEAU GRID - 3 COLUMNS */
  rideauGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0",
    borderBottom: "1px solid #e0e0e0",
  },

  rideauColumn: {
    padding: "12px 16px",
    borderRight: "1px solid #e0e0e0",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  "rideauColumn:last-child": {
    borderRight: "none",
  },

  columnTitle: {
    fontSize: "9px",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#999",
    letterSpacing: "0.5px",
    marginBottom: "4px",
  },

  dataRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: "8px",
  },

  dataLabel: {
    fontSize: "10px",
    color: "#666",
    fontWeight: "500",
  },

  dataValue: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#000",
    textAlign: "right",
  },

  /* REMARQUE ROW */
  remarqueRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "12px 16px",
    background: "#fffef5",
    borderTop: "2px solid #ffd700",
  },

  remarqueIcon: {
    fontSize: "14px",
    lineHeight: "1",
  },

  remarqueText: {
    fontSize: "10px",
    color: "#333",
    flex: 1,
    lineHeight: "1.5",
  },

  /* FOOTER */
  footer: {
    marginTop: "auto",
    paddingTop: "16px",
    borderTop: "1px solid #e0e0e0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "9px",
    color: "#999",
  },

  footerSep: {
    color: "#ccc",
  },
};
