const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    // ─── Tabla de Dueños ────────────────────────────────────────────────────
    db.run(`CREATE TABLE owners (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        name       TEXT    NOT NULL,
        phone      TEXT,
        email      TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // ─── Tabla de Mascotas ───────────────────────────────────────────────────
    // owner_id es obligatorio (NOT NULL) y referencia a owners.id
    db.run(`CREATE TABLE pets (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        name       TEXT    NOT NULL,
        species    TEXT    NOT NULL DEFAULT 'Perro',
        breed      TEXT,
        owner_id   INTEGER NOT NULL REFERENCES owners(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // ─── Tabla de Citas ──────────────────────────────────────────────────────
    // pet_id referencia a pets.id en lugar de repetir pet_name / owner_name
    db.run(`CREATE TABLE appointments (
        id               INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_id           INTEGER NOT NULL REFERENCES pets(id),
        service          TEXT    NOT NULL,
        appointment_date TEXT    NOT NULL,
        status           TEXT    DEFAULT 'Programada',
        created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // ─── Datos de ejemplo ────────────────────────────────────────────────────
    // Dueños
    db.run(`INSERT INTO owners (name, phone, email) VALUES
        ('Juan Pérez',   '555-0101', 'juan@example.com'),
        ('María García', '555-0202', 'maria@example.com')`);

    // Mascotas (vinculadas a sus dueños)
    db.run(`INSERT INTO pets (name, species, breed, owner_id) VALUES
        ('Rex',  'Perro', 'Labrador', 1),
        ('Luna', 'Perro', 'Poodle',   2),
        ('Max',  'Gato',  'Siamés',   1)`);

    // Citas (vinculadas a las mascotas)
    db.run(`INSERT INTO appointments (pet_id, service, appointment_date) VALUES
        (1, 'Corte de Pelo',    '2026-04-01T10:00'),
        (2, 'Baño y Limpieza',  '2026-04-01T11:30')`);
});

module.exports = db;
