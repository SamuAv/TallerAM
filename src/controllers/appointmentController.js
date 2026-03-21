const db = require('../config/db');

// GET / — lista citas con JOIN a pets y owners
exports.getAllAppointments = (req, res) => {
    const sql = `
        SELECT appointments.*,
               pets.name       AS pet_name,
               pets.species    AS pet_species,
               owners.name     AS owner_name
        FROM   appointments
        JOIN   pets   ON appointments.pet_id   = pets.id
        JOIN   owners ON pets.owner_id         = owners.id
        ORDER  BY appointments.appointment_date DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.render('index', { title: 'Panel de Citas', appointments: rows });
    });
};

// GET /create — formulario para agendar cita (muestra lista de mascotas)
exports.getCreateForm = (req, res) => {
    const sql = `
        SELECT pets.id, pets.name AS pet_name, owners.name AS owner_name
        FROM   pets
        JOIN   owners ON pets.owner_id = owners.id
        ORDER  BY pets.name ASC
    `;
    db.all(sql, [], (err, pets) => {
        if (err) return res.status(500).send(err.message);
        res.render('create', { title: 'Agendar Nueva Cita', pets });
    });
};

// POST /create — crear cita
exports.createAppointment = (req, res) => {
    const { pet_id, service, appointment_date } = req.body;
    const sql = 'INSERT INTO appointments (pet_id, service, appointment_date) VALUES (?, ?, ?)';
    db.run(sql, [pet_id, service, appointment_date], function (err) {
        if (err) return res.status(500).send(err.message);
        res.redirect('/');
    });
};

// POST /delete/:id — eliminar cita
exports.deleteAppointment = (req, res) => {
    db.run('DELETE FROM appointments WHERE id = ?', req.params.id, function (err) {
        if (err) return res.status(500).send(err.message);
        res.redirect('/');
    });
};
