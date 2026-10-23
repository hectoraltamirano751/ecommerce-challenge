const sqlite3 = require('sqlite3').verbose();

// Crear o abrir la base de datos
const db = new sqlite3.Database('./database.db');

// Crear tablas si no existen
db.serialize(() => {
  // Tabla de productos
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    description TEXT
  )`);

  // Insertar productos de ejemplo
  db.run(`INSERT INTO products (name, price, description)
          VALUES ('Laptop Gamer', 1000, 'Laptop con GPU dedicada')`);
  db.run(`INSERT INTO products (name, price, description)
          VALUES ('Mouse Inalámbrico', 25, 'Mouse ergonómico con batería recargable')`);
  db.run(`INSERT INTO products (name, price, description)
          VALUES ('Auriculares Bluetooth', 60, 'Auriculares con cancelación de ruido')`);

  // Tabla de carrito
  db.run(`CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    quantity INTEGER,
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);
});

module.exports = db;
