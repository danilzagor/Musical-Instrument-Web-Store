const express = require('express');
const router = express.Router();
const drumController = require('../controllers/drumController');
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {authenticateToken, authorizeRole} = require("../services/securityService");
const guitarController = require("../controllers/guitarController");

router.get('/', drumController.getAllDrums);
router.post('/',authenticateToken, authorizeRole("ADMIN"), upload.single("image") , drumController.addDrum);
router.get('/filters', drumController.getDrumFilters)
router.put('/filters', authenticateToken, authorizeRole("ADMIN"), drumController.editDrumFilterByName)
router.get('/:id', drumController.getDrumById);
router.delete('/:id',authenticateToken, authorizeRole("ADMIN"), drumController.deleteDrumById);
router.put('/:id',authenticateToken, authorizeRole("ADMIN"),upload.single("image"), drumController.editDrumById);

module.exports = router;
