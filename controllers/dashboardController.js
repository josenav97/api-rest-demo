// controllers/dashboardController.js

const db = require('../db');

// --- ANOTACIÓN PARA JUNIORS ---
// Este controlador se encarga de una única tarea: recoger datos de varias tablas
// y presentarlos en una página de resumen. Es una buena práctica tener controladores
// específicos para funcionalidades concretas.

/**
 * Función auxiliar para ejecutar una consulta de conteo y devolver una Promesa.
 * Esto nos permite usar async/await para manejar las consultas a la base de datos de forma más limpia.
 * @param {string} sql - La consulta SQL a ejecutar (ej: "SELECT COUNT(*) FROM users").
 * @returns {Promise<number>} - Una promesa que se resuelve con el número de filas.
 */
const countQuery = (sql) => {
  return new Promise((resolve, reject) => {
    db.get(sql, (err, row) => {
      if (err) {
        return reject(err)
      }
      resolve(row['COUNT(*)'] || 0)
    })
  })
}

/**
 * Función auxiliar para ejecutar una consulta que devuelve una lista de resultados.
 * @param {string} sql - La consulta SQL a ejecutar.
 * @returns {Promise<Array<object>>} - Una promesa que se resuelve con un array de filas.
 */
const listQuery = (sql) => {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        return reject(err)
      }
      resolve(rows || [])
    })
  })
};

exports.getDashboardSummary = async (req, res) => {
  try {
    // Ejecutamos todas las consultas en paralelo para mayor eficiencia.
    const [
      userCount,
      restaurantCount,
      reservationCount,
      users,
      restaurants,
      reservations
    ] = await Promise.all([
      countQuery('SELECT COUNT(*) FROM users'),
      countQuery('SELECT COUNT(*) FROM restaurants'),
      countQuery('SELECT COUNT(*) FROM reservations'),
      listQuery('SELECT id, full_name, email, role FROM users ORDER BY id DESC'),
      listQuery(`
                SELECT r.id, r.name, r.city, u.full_name as owner_name 
                FROM restaurants r 
                JOIN users u ON r.owner_id = u.id 
                ORDER BY r.id DESC
            `),
      listQuery(`
                SELECT res.id, strftime('%Y-%m-%d %H:%M', res.reservation_time) as reservation_time, res.party_size, u.full_name as customer_name, r.name as restaurant_name 
                FROM reservations res 
                JOIN users u ON res.user_id = u.id 
                JOIN restaurants r ON res.restaurant_id = r.id 
                ORDER BY res.reservation_time DESC
            `)
    ])

    // Creamos una página HTML simple para mostrar los resultados.
    const html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Dashboard de Reservas</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f7f6; color: #333; }
                    .container { max-width: 1000px; margin: auto; background: white; padding: 20px 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    h1, h2 { color: #0056b3; text-align: center; }
                    h2 { border-top: 1px solid #ddd; padding-top: 20px; margin-top: 40px; }
                    .summary { display: flex; justify-content: space-around; text-align: center; margin: 40px 0; }
                    .summary-item { background-color: #eef4ff; padding: 20px; border-radius: 8px; width: 30%; }
                    .summary-item h3 { margin-top: 0; color: #0056b3; }
                    .summary-item p { font-size: 2.5em; margin: 0; font-weight: bold; color: #333; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                    th { background-color: #0056b3; color: white; }
                    tr:nth-child(even) { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Resumen del Sistema</h1>
                    <div class="summary">
                        <div class="summary-item"><h3>Usuarios</h3><p>${userCount}</p></div>
                        <div class="summary-item"><h3>Restaurantes</h3><p>${restaurantCount}</p></div>
                        <div class="summary-item"><h3>Reservas</h3><p>${reservationCount}</p></div>
                    </div>

                    <h2>Usuarios Registrados</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre Completo</th>
                                <th>Email</th>
                                <th>Rol</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(user => `
                                <tr>
                                    <td>${user.id}</td>
                                    <td>${user.full_name}</td>
                                    <td>${user.email}</td>
                                    <td>${user.role}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <h2>Restaurantes</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Ciudad</th>
                                <th>Propietario</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${restaurants.map(r => `
                                <tr>
                                    <td>${r.id}</td>
                                    <td>${r.name}</td>
                                    <td>${r.city}</td>
                                    <td>${r.owner_name}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <h2>Últimas Reservas</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha y Hora</th>
                                <th>Cliente</th>
                                <th>Restaurante</th>
                                <th>Comensales</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reservations.map(res => `
                                <tr>
                                    <td>${res.id}</td>
                                    <td>${res.reservation_time}</td>
                                    <td>${res.customer_name}</td>
                                    <td>${res.restaurant_name}</td>
                                    <td>${res.party_size}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </body>
            </html>
        `
    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  } catch (err) {
    res.status(500).send(`<h1>Error al generar el dashboard</h1><p>${err.message}</p>`)
  }
}