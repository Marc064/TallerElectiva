const express = require("express")
const router = express.Router()
const path = require("path")


router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get('/', (req, res) => res.render('index', { title: 'Taller electiva'}))

module.exports = router