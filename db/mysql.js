
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

module.exports.init = async () => {
    const host = config.host ?? 'localhost'
    const port = config.port ?? 3306
    const user = config.user ?? 'user'
    const password = config.password ?? 'password'
    const database = config.database ?? 'bend-task'
    const dialect = config.dialect ?? 'mysql'

    const sequelize = new Sequelize(database, user, password, {
        host: host,
        port: port,
        dialect: dialect
    });

    try {
        await sequelize.authenticate()
        await sequelize.sync({ force: true })
        console.log(`Connection has been established successfully to the ${database}@${host}:${port}.`)
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

// return new Promise((acc, rej) => {
//     pool.query(
//         'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean)',
//         err => {
//             if (err) return rej(err);

//             console.log(`Connected to mysql db at ${host}: ${port}`);
//             acc();
//         },
//     );
// });

// async function teardown() {
//     return new Promise((acc, rej) => {
//         pool.end(err => {
//             if (err) rej(err);
//             else acc();
//         });
//     });
// }

// async function getItems() {
//     return new Promise((acc, rej) => {
//         pool.query('SELECT * FROM todo_items', (err, rows) => {
//             if (err) return rej(err);
//             acc(
//                 rows.map(item =>
//                     Object.assign({}, item, {
//                         completed: item.completed === 1,
//                     }),
//                 ),
//             );
//         });
//     });
// }

// async function getItem(id) {
//     return new Promise((acc, rej) => {
//         pool.query('SELECT * FROM todo_items WHERE id=?', [id], (err, rows) => {
//             if (err) return rej(err);
//             acc(
//                 rows.map(item =>
//                     Object.assign({}, item, {
//                         completed: item.completed === 1,
//                     }),
//                 )[0],
//             );
//         });
//     });
// }

// async function storeItem(item) {
//     return new Promise((acc, rej) => {
//         pool.query(
//             'INSERT INTO todo_items (id, name, completed) VALUES (?, ?, ?)',
//             [item.id, item.name, item.completed ? 1 : 0],
//             err => {
//                 if (err) return rej(err);
//                 acc();
//             },
//         );
//     });
// }

// async function updateItem(id, item) {
//     return new Promise((acc, rej) => {
//         pool.query(
//             'UPDATE todo_items SET name=?, completed=? WHERE id=?',
//             [item.name, item.completed ? 1 : 0, id],
//             err => {
//                 if (err) return rej(err);
//                 acc();
//             },
//         );
//     });
// }

// async function removeItem(id) {
//     return new Promise((acc, rej) => {
//         pool.query('DELETE FROM todo_items WHERE id = ?', [id], err => {
//             if (err) return rej(err);
//             acc();
//         });
//     });
// }

// module.exports = {
//     init
    // teardown,
    // getItems,
    // getItem,
    // storeItem,
    // updateItem,
    // removeItem,
// };
