const express = require('express')
const router = express.Router()
const { authController } = require('../controllers')

router.post('/login', authController.loginUser)
router.post('/signup', authController.signUp)

module.exports = router
