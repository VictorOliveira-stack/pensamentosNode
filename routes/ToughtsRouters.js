const express = require('express')
const router = express.Router()

const ToughtController = require('../controllers/ToughtController')

//helpers
const checkAuth = require('../helpers/auth.js').checkAuth

router.get('/add', checkAuth, ToughtController.createTougths)
router.post('/add', checkAuth, ToughtController.createTougthsSave)
router.get('/edit/:id', checkAuth, ToughtController.updateTougths)
router.post('/edit', checkAuth, ToughtController.updateTougthsSave)
router.get('/dashboard', checkAuth, ToughtController.dashboard)
router.post('/remove', checkAuth, ToughtController.removeThought )
router.get('/', ToughtController.showThoughts)

module.exports = router