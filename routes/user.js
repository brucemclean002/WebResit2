const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

// User routes
router.get('/admin', auth.ensureManager, userController.getAdminDashboard);
router.post('/add-user', auth.ensureManager, userController.addUser);
router.get('/edit/:id', auth.ensureManager, userController.editUser);
router.post('/edit/:id', auth.ensureManager, userController.updateUser);
router.post('/delete/:id', auth.ensureManager, userController.deleteUser);

module.exports = router;
