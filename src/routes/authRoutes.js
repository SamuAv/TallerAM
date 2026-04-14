const express = require('express');
const router  = express.Router();
const authController = require('../controllers/authController');

// Mostrar formulario de login
router.get('/login',  authController.getLogin);

// Procesar credenciales
router.post('/login',  authController.postLogin);

// Cerrar sesión
router.post('/logout', authController.postLogout);

module.exports = router;
