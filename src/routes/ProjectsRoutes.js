const express = require('express')
const router = express.Router()
const projectController = require('../controllers/ProjectController')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/add', checkAuth, projectController.createProject)
router.post('/add', checkAuth, projectController.createProjectSave)
router.get('/dashboard', checkAuth, projectController.dashboard)
router.post('/remove', checkAuth, projectController.removeProject)

router.get('/', projectController.showProjects)

module.exports = router