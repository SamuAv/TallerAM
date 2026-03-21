const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');

router.get('/',        petController.getAllPets);
router.get('/create',  petController.getCreateForm);
router.post('/create', petController.createPet);

module.exports = router;
