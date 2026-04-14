const express = require('express');
const router  = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { isAuthenticated, isDoctor } = require('../middleware/auth');

router.get('/',    appointmentController.getAllAppointments);
router.get('/create', appointmentController.getCreateForm);

// Criterio 1: solo el médico puede enviar campos de Consulta Médica
router.post('/create', isDoctor, appointmentController.createAppointment);

// Criterio 2: solo usuarios autenticados pueden eliminar registros
router.post('/delete/:id', isAuthenticated, appointmentController.deleteAppointment);

module.exports = router;
