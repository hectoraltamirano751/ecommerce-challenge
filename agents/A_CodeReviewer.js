const fs = require("fs");
const path = require("path");

// Reglas determinísticas simples
const RULES = [
  {
    id: "PRICE_MANIPULATION",
    description: "El precio se altera sin justificación.",
    pattern: /price\s*=\s*price\s*\*\s*1\.\d+/i,
    severity: "high",
  },
  {
    id: "QUANTITY_DUPLICATION",
    description: "La cantidad se multiplica sin motivo.",
    pattern: /quantity\s*=\s*quantity\s*\*\s*2/i,
    severity: "medium",
  },
  {
    id: "NO_ERROR_HANDLING",
    description: "Función sin manejo de errores.",
    pattern: /async\s+\w+\([^)]*\)\s*{[^}]*await[^}]*}/i,
    severity: "low",
  }
];

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const issues = [];

  RULES.forEach(rule => {
    const match = content.match(rule.pattern);
    if (match) {
      issues.push({
        id: rule.id,
        file: filePath,
        line: content.substring(0, match.index).split("\n").length,
        issue: rule.description,
        severity: rule.severity,
        snippet: match[0]
      });
    }
  });

  return issues;
}

function runCodeReviewer() {
  const srcDir = path.join(__dirname, "..", "src");
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith(".js"));

  let allIssues = [];

  files.forEach(file => {
    const filePath = path.join(srcDir, file);
    const issues = analyzeFile(filePath);
    allIssues = allIssues.concat(issues);
  });

  // Crear carpeta reports si no existe
  const reportsDir = path.join(__dirname, "..", "reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }

  // Guardar reporte
  fs.writeFileSync(
    path.join(reportsDir, "A_CodeReview.json"),
    JSON.stringify(allIssues, null, 2),
    "utf8"
  );

  console.log("Code Reviewer: análisis completado.");
  console.log("Reporte generado en reports/A_CodeReview.json");
}

runCodeReviewer();
