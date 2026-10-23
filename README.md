# Sistema Multi-Agente para Revisión, Corrección y Auditoría de Código — PinApp Challenge

Este repositorio contiene un prototipo funcional de un sistema multi-agente híbrido (IA + lógica determinística) diseñado para acelerar el ciclo de desarrollo de un equipo de e-commerce.

El sistema demuestra tres capacidades clave del reto técnico:

1. Revisión de código con feedback accionable (Agente A)
2. Detección y corrección de problemas con validación (Agentes B y D)
3. Decisión sobre si un cambio está listo para avanzar (Agente E)

Los agentes trabajan de forma coordinada mediante un pipeline ejecutable con un solo comando.

---

## 1. Arquitectura del Sistema

El sistema está compuesto por cinco agentes:

### Agente A — CodeReviewer
Analiza el código fuente y detecta patrones sospechosos o errores potenciales.  
Genera un reporte inicial en reports/A_CodeReview.json.

### Agente B — BugFixAdvisor
Usa IA (Ollama) para interpretar el reporte del Agente A.  
Explica la causa del problema y propone una corrección validada.  
Genera reports/B_BugFixAdvisor.json.

### Agente C — ReportFixer
Normaliza y limpia el reporte del Agente B para que sea determinístico y fácil de procesar.  
Genera reports/C_ReportFixer.json.

### Agente D — CodeModifier
Aplica la corrección al archivo real del proyecto.  
Genera un backup en audit_backups/index.js.backup.  
Produce reports/D_CodeModifier.log.

### Agente E — CodeAudit
Compara el archivo modificado con el backup.  
Genera un diff estilo Git y decide si el cambio está listo para avanzar.  
Produce reports/E_CodeAudit.log.

---

## 2. Requisitos

- Node.js 18+
- Ollama instalado
- Modelo llama3.2 descargado
- Windows, Linux o macOS

---

## 3. Instalación

Clonar el repositorio:

git clone https://github.com/hectoraltamirano751/ecommerce-challenge.git  

Los siguientes comandos deben ejecutarse en una terminal.  
Puede ser CMD, PowerShell o cualquier terminal equivalente en Windows, Linux o macOS.

cd ecommerce-challenge

Instalar dependencias:

npm install

Verificar que Ollama esté funcionando:

ollama list

Debe aparecer:

llama3.2

---

## 4. Estructura del Proyecto

ecommerce-challenge/  
agents/  
A_CodeReviewer.js  
B_BugFixAdvisor.js  
C_ReportFixer.js  
D_CodeModifier.js  
E_CodeAudit.js  
audit_backups/  
index.js.backup  
reports/  
A_CodeReview.json  
B_BugFixAdvisor.json  
C_ReportFixer.json  
D_CodeModifier.log  
E_CodeAudit.log  
src/  
index.js  
runAgents.js  
package.json

---

## 5. Cómo ejecutar el pipeline completo

Desde la raíz del proyecto:

node runAgents.js

Esto ejecuta:

A → B → C → D → E

Y genera todos los reportes en la carpeta reports/.

---

## 6. Ejemplo de salida

==============================================  
PIPELINE DE AGENTES — PinApp Challenge  
==============================================  
Ejecutando Agente A — CodeReviewer...  
Ejecutando Agente B — BugFixAdvisor...  
Ejecutando Agente C — ReportFixer...  
Ejecutando Agente D — CodeModifier...  
Ejecutando Agente E — CodeAudit...  
PIPELINE COMPLETADO — Código corregido

---

## 7. Consideraciones de diseño

Costo  
El sistema usa Ollama local, costo cero.  
Los agentes determinísticos no requieren servicios externos.

Tiempo de respuesta  
El pipeline completo corre en 2–4 segundos en una laptop estándar.

Privacidad  
Todo el procesamiento ocurre localmente.  
No se envía código a servicios externos.

Operabilidad  
El sistema se ejecuta con un solo comando.  
La estructura es clara y reproducible.

---

## 8. Limitaciones del prototipo

- Los backups se guardan en audit_backups/ por simplicidad.  
  En un sistema real, se usaría Git para versionado y auditoría.
- El pipeline está enfocado en revisión y corrección, no en preguntas sobre el código.
- El proyecto base es pequeño para facilitar la demostración.

---

## 9. Mejoras futuras

- Integración con Git para commits automáticos y diffs reales.  
- Agente adicional para responder preguntas sobre el código.  
- Análisis de múltiples archivos en lugar de uno solo.  
- Pipeline con paralelización inteligente.  
- UI web para visualizar reportes y diffs.

---

## 10. Autor

Héctor Altamirano  
Especialista en Automatización · IA Agéntica  
Córdoba, Argentina
