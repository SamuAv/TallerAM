/**
 * Controlador de autenticación.
 * Gestiona login y logout usando express-session.
 *
 * Usuarios de prueba (hardcodeados):
 *   medico / 1234  → rol: doctor
 *   admin  / admin → rol: admin
 */

const USERS = [
    { username: 'medico', password: '1234',  role: 'doctor', displayName: 'Dr. García' },
    { username: 'admin',  password: 'admin', role: 'admin',  displayName: 'Administrador' },
];

// GET /login — muestra el formulario de login
exports.getLogin = (req, res) => {
    // Si ya hay sesión, redirigir al inicio
    if (req.session && req.session.user) {
        return res.redirect('/');
    }
    res.render('login', { title: 'Iniciar Sesión', error: null });
};

// POST /login — valida credenciales y crea la sesión
exports.postLogin = (req, res) => {
    const { username, password } = req.body;

    const user = USERS.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).render('login', {
            title: 'Iniciar Sesión',
            error: 'Usuario o contraseña incorrectos.'
        });
    }

    // Guardar en sesión solo los datos necesarios (sin la contraseña)
    req.session.user = {
        username:    user.username,
        displayName: user.displayName,
        role:        user.role,
    };

    res.redirect('/');
};

// POST /logout — destruye la sesión y redirige al login
exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};
