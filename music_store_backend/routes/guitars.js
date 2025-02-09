const express = require('express');
const router = express.Router();
const multer = require("multer");
const guitarController = require('../controllers/guitarController');
const upload = multer({ storage: multer.memoryStorage() });
const {authenticateToken, authorizeRole} = require("../services/securityService");

router.get('/filters', guitarController.getGuitarFilters)
router.put('/filters', authenticateToken, authorizeRole("ADMIN"), guitarController.editGuitarFilterByName)
router.get('/', guitarController.getAllGuitars);
router.post('/',authenticateToken, authorizeRole("ADMIN"), upload.single("image") , guitarController.addGuitar);
router.delete('/:id',authenticateToken, authorizeRole("ADMIN"), guitarController.deleteGuitarById);
router.put('/:id',authenticateToken, authorizeRole("ADMIN"), upload.single("image"), guitarController.editGuitarById);
router.get('/:id', guitarController.getGuitarById);

module.exports = router;
