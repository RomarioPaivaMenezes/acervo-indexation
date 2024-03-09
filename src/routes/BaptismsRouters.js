const express = require('express')
const router = express.Router()

const baptismController = require('../controllers/BaptismController')
const AuthController = require('../controllers/AuthController')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/baptisms/add/:projectId', checkAuth, baptismController.addBaptisms)
router.post('/add/project', checkAuth,baptismController.createBaptisms)

router.get('/baptisms/:projectId', checkAuth, baptismController.showBaptisms)
router.post('/baptisms/remove', checkAuth, baptismController.removeBaptisms)
router.get('/dashboard', checkAuth, baptismController.dashboard)
router.get('/', checkAuth, baptismController.showAllBaptisms)

module.exports = router