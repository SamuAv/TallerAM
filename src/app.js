const express        = require('express');
const path           = require('path');
const expressLayouts = require('express-ejs-layouts');
const morgan         = require('morgan');
const session        = require('express-session');

const appointmentRoutes = require('./routes/appointmentRoutes');
const ownerRoutes       = require('./routes/ownerRoutes');
const petRoutes         = require('./routes/petRoutes');
const authRoutes        = require('./routes/authRoutes');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Sesión
app.use(session({
    secret: 'pelucan-spa-secret-2026',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 horas
}));

// Exponer usuario de sesión a todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use('/',       authRoutes);
app.use('/',       appointmentRoutes);
app.use('/owners', ownerRoutes);
app.use('/pets',   petRoutes);

module.exports = app;
