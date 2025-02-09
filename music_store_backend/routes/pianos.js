const express = require('express');
const router = express.Router();
const multer = require("multer");
const pianoController = require('../controllers/pianoController');
const upload = multer({ storage: multer.memoryStorage() });
const {authenticateToken, authorizeRole} = require("../services/securityService");
const drumController = require("../controllers/drumController");


router.get('/', pianoController.getAllPianos);
router.post('/',authenticateToken, authorizeRole("ADMIN"), upload.single("image") , pianoController.addPiano);
router.get('/filters', pianoController.getPianoFilters)
router.put('/filters', authenticateToken, authorizeRole("ADMIN"), pianoController.editPianoFilterByName)
router.get('/:id', pianoController.getPianosById);
router.delete('/:id',authenticateToken, authorizeRole("ADMIN"), pianoController.deletePianoById);
router.put('/:id',authenticateToken, authorizeRole("ADMIN"), upload.single("image"), pianoController.editPianoById);

module.exports = router;
