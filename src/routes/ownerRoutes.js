const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');

router.get('/',        ownerController.getAllOwners);
router.get('/create',  ownerController.getCreateForm);
router.post('/create', ownerController.createOwner);

module.exports = router;
