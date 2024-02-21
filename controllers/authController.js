const jwt = require('jsonwebtoken')
const config = require('../config/config')
const { userModel } = require('../models')
const { userService } = require('../services')

const authController = {
  loginUser: async (req, res) => {
    const { email, password } = req.body

    try {
      const user = await userModel.findOne({
        where: {
          email: email,
        },
      })

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const passwordMatch = await user.authenticate(password)

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const token = jwt.sign({ userId: user.id }, config.auth.secretKey, {
        expiresIn: '24h',
      })

      res.status(200).json({ token })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  signUp: async (req, res, next) => {
    try {
      const userData = req.body
      if (!userData.email || !userData.password)
        return res
          .status(400)
          .json({ error: 'email and password are required' })

      const userById = await userService.getUserById(userData.email)

      if (userById) {
        return res.status(400).json({ message: 'User is already exist' })
      }

      const newUser = await userService.createUser(userData)
      return res.status(201).json({ message: 'User Created Successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },
}

module.exports = authController
