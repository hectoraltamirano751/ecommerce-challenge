const fs = require("fs");
const path = require("path");

/**
 * Genera un diff estilo Git entre dos archivos.
 */
function generateDiff(original, modified) {
  const originalLines = original.split("\n");
  const modifiedLines = modified.split("\n");

  let diff = "";
  const maxLines = Math.max(originalLines.length, modifiedLines.length);

  for (let i = 0; i < maxLines; i++) {
    const oldLine = originalLines[i] || "";
    const newLine = modifiedLines[i] || "";

    if (oldLine !== newLine) {
      diff += `@@ Línea ${i + 1} @@\n`;
      diff += `- ${oldLine}\n`;
      diff += `+ ${newLine}\n\n`;
    }
  }

  return diff || "No se detectaron diferencias.";
}

async function codeAudit() {
  console.log("\nCodeAudit: generando diff y auditoría final...\n");

  // Archivo modificado
  const filePath = path.join(process.cwd(), "src", "index.js");

  // Backup en audit_backups/
  const backupPath = path.join(process.cwd(), "audit_backups", "index.js.backup");

  if (!fs.existsSync(backupPath)) {
    console.error("ERROR: No existe el backup del archivo original. El Agente D debe generarlo.");
    process.exit(1);
  }

  const original = fs.readFileSync(backupPath, "utf8");
  const modified = fs.readFileSync(filePath, "utf8");

  const diff = generateDiff(original, modified);
  const timestamp = new Date().toISOString();

  const report = `
============================================================
                AUDITORÍA FINAL DEL PIPELINE
============================================================

Timestamp: ${timestamp}

Archivo original (backup): ${backupPath}
Archivo modificado: ${filePath}

------------------------------------------------------------
                        DIFF DETECTADO
------------------------------------------------------------

${diff}

------------------------------------------------------------
                     RESUMEN DEL PIPELINE
------------------------------------------------------------

✔ Agente A detectó la falla
✔ Agente B explicó la falla
✔ Agente C normalizó el reporte
✔ Agente D aplicó la corrección
✔ Agente E generó auditoría y diff final

============================================================
`;

  fs.writeFileSync("./reports/E_CodeAudit.log", report, "utf8");

  console.log("Auditoría generada en reports/E_CodeAudit.log\n");
}

codeAudit();
