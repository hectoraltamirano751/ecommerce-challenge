
require("dotenv").config();
const fs = require("fs");
const { spawn } = require("child_process");

async function bugFixAdvisor() {
  const raw = fs.readFileSync("./reports/A_CodeReview.json", "utf8");
  const issues = JSON.parse(raw);

  const summary = issues
    .map(
      (issue, index) =>
        `#${index + 1}\n` +
        `Archivo: ${issue.file}\n` +
        `Línea: ${issue.line}\n` +
        `Severidad: ${issue.severity}\n` +
        `Descripción: ${issue.issue}\n` +
        `Snippet:\n${issue.snippet}\n`
    )
    .join("\n\n");

const prompt = `
Actuás como un revisor técnico senior especializado en Node.js, Express, SQLite y arquitectura de e-commerce.

Tu salida debe ser EXCLUSIVAMENTE un JSON válido.  
NO debe contener texto antes o después del JSON.  
NO debe contener razonamiento en voz alta.  
NO debe contener "Thinking".  
NO debe contener explicaciones internas.  
NO debe contener inglés.  
NO debe contener comentarios.  
NO debe contener nada fuera del JSON.

Formato EXACTO:

{
  "issues": [
    {
      "id": "string",
      "file": "string",
      "line": number,
      "explanation": "string",
      "root_cause": "string",
      "fix": "string",
      "validation": "string"
    }
  ]
}

Reglas estrictas:
- Solo analizar los problemas listados en ${summary}.
- No inventar problemas adicionales.
- No agregar issues que no estén en el JSON original.
- Si solo hay un problema, devolver solo un issue.
- No inventar valores numéricos.
- No proponer cantidades arbitrarias.
- No inventar escenarios.
- No inventar palabras.
- No repetir el prompt.
- No agregar secciones adicionales.
- No usar inglés.
- No usar razonamiento en voz alta.
- No usar lenguaje coloquial.
- No usar texto fuera del JSON.
- La solución debe basarse SOLO en el snippet detectado.
- La corrección debe ser EXACTAMENTE: "Reemplazar quantity = quantity * 2 por quantity = quantity".
- El JSON debe estar completamente en español.

Objetivo:
Producir un análisis técnico correcto del problema detectado por el agente determinístico y proponer una solución válida basada en buenas prácticas de backend.

Problemas detectados:

${summary}
`;



  const ollama = spawn("ollama", ["run", "llama3.1:8b"], {
    stdio: ["pipe", "pipe", "pipe"],
  });

  ollama.stdin.write(prompt);
  ollama.stdin.end();

  let output = "";

  ollama.stdout.on("data", (data) => {
    output += data.toString();
  });

  ollama.on("close", () => {
    console.log("Bug Fix Advisor Report:\n");
    console.log(output);

    fs.writeFileSync("./reports/B_BugFixAdvisor.txt", output, "utf8");
  });
}

bugFixAdvisor();


