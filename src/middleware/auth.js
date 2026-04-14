/**
 * Middlewares de autenticación y autorización por rol.
 *
 * isAuthenticated  → verifica que exista una sesión activa.
 * isDoctor         → verifica que el usuario autenticado tenga rol 'doctor'.
 */

/**
 * Criterio 2: Solo usuarios autenticados pueden acceder a rutas protegidas.
 * Si no hay sesión, redirige al login con estado 401.
 */
exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).redirect('/login');
};

/**
 * Criterio 1: Solo el médico puede alterar historiales de salud (campos vitales).
 * Requiere haber pasado primero por isAuthenticated (o tener sesión válida).
 * Si el rol no es 'doctor', responde 403 con vista de error.
 */
exports.isDoctor = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'doctor') {
        return next();
    }
    return res.status(403).render('error', {
        title: 'Acceso Denegado',
        message: 'Solo el médico puede registrar o editar campos médicos (Consulta Médica).'
    });
};
