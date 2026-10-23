// ---------------------------------------------------------------------------
// IMPORTS Y CONFIGURACIÓN INICIAL
// ---------------------------------------------------------------------------
// express: framework para crear el servidor HTTP
// db: conexión a la base de datos SQLite (archivo db.js)
// app: instancia principal del servidor
// PORT: puerto donde se levanta el backend
// ---------------------------------------------------------------------------

const express = require('express');
const db = require('./db'); 
const app = express();
const PORT = 3000;

// Permite que Express pueda interpretar JSON enviado en el body de las requests
app.use(express.json());



// ---------------------------------------------------------------------------
// ENDPOINT RAÍZ
// Devuelve un mensaje simple para verificar que el backend está funcionando.
// ---------------------------------------------------------------------------

app.get('/', (req, res) => {
  res.send('Backend PinApp Challenge funcionando');
});



// ---------------------------------------------------------------------------
// ENDPOINT /products  (VERSIÓN ORIGINAL - SIN FALLA)
// ---------------------------------------------------------------------------
// Este bloque representa la versión correcta del endpoint.
// Se deja comentado para:
//   - comparar contra la versión fallada
//   - mostrar cómo era antes de introducir la falla
//   - permitir restaurarlo fácilmente si se desea
//   - facilitar la demostración del pipeline de agentes
// ---------------------------------------------------------------------------

/*
app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows); // ← versión correcta: devuelve los productos sin modificar
  });
});
*/



// ---------------------------------------------------------------------------
// ENDPOINT /products  (VERSIÓN CON FALLA INTENCIONAL)
// ---------------------------------------------------------------------------
// Esta versión contiene un error introducido a propósito:
//   - El precio se incrementa artificialmente en un 10%
//   - Esto permite que el Agente A detecte la falla
//   - El Agente B la explique
//   - El Agente C la normalice
//   - El Agente D la corrija automáticamente
// ---------------------------------------------------------------------------

app.get('/products', (req, res) => {
  db.all(`SELECT * FROM products`, [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }

    // Falla intencional: precio mal calculado
    const productosConError = rows.map(p => ({
      ...p,
      price: p.price * 1.10 // ← error introducido a propósito
    }));

    res.json(productosConError);
  });
});



// ---------------------------------------------------------------------------
// ENDPOINT /cart  (VER CARRITO)
// Devuelve el contenido actual del carrito, incluyendo:
//   - id del ítem
//   - nombre del producto
//   - precio
//   - cantidad
// ---------------------------------------------------------------------------

app.get('/cart', (req, res) => {
  db.all(
    `SELECT cart_items.id, products.name, products.price, cart_items.quantity
     FROM cart_items
     JOIN products ON cart_items.product_id = products.id`,
    [],
    (err, rows) => {
      if (err) {
        res.status(500).send(err.message);
        return;
      }
      res.json(rows);
    }
  );
});



// ---------------------------------------------------------------------------
// ENDPOINT /cart/clear  (VACIAR CARRITO)
// Elimina todos los ítems del carrito.
// ---------------------------------------------------------------------------

app.delete('/cart/clear', (req, res) => {
  db.run(`DELETE FROM cart_items`, [], function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.send("Carrito vaciado");
  });
});



// ---------------------------------------------------------------------------
// ENDPOINT /cart/add  (VERSIÓN ORIGINAL - SIN FALLA)
// ---------------------------------------------------------------------------
// Esta es la versión correcta del endpoint para agregar productos al carrito.
// Se deja comentada para:
//   - servir como referencia del comportamiento esperado
//   - comparar contra la versión fallada
//   - permitir restaurar el comportamiento correcto fácilmente
// ---------------------------------------------------------------------------

/*
app.post('/cart/add', (req, res) => {
  const { product_id, quantity } = req.body;

  db.run(
    `INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)`,
    [product_id, quantity],
    function(err) {
      if (err) {
        res.status(500).send(err.message);
        return;
      }
      res.send(`Producto agregado al carrito con id ${this.lastID}`);
    }
  );
});
*/



// ---------------------------------------------------------------------------
// ENDPOINT /cart/add  (VERSIÓN CON FALLA INTENCIONAL)
// ---------------------------------------------------------------------------
// Esta versión contiene un error introducido a propósito:
//   - La cantidad se multiplica por 2 sin justificación
//   - Esto genera un comportamiento incorrecto en el carrito
//   - Permite que el pipeline de agentes detecte y corrija la falla
// ---------------------------------------------------------------------------

app.post('/cart/add', (req, res) => {
  let { product_id, quantity } = req.body;

  // Falla intencional: cantidad incorrecta
  quantity = quantity * 2; // ← error introducido a propósito

  db.run(
    `INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)`,
    [product_id, quantity],
    function(err) {
      if (err) {
        res.status(500).send(err.message);
        return;
      }
      res.send(`Producto agregado con cantidad incorrecta (falla intencional)`);
    }
  );
});



// ---------------------------------------------------------------------------
// INICIO DEL SERVIDOR
// Levanta el backend en el puerto definido.
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
