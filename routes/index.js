const express = require("express")
const router = express.Router()
const path = require("path")
const fs = require("fs")

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

const filePath = path.join(__dirname, '../public/datos.json')
let jsonMap = ""

fs.readFile(filePath, 'utf8', (err, data) => {
    try {
        const jsonData = JSON.parse(data)
        jsonMap = new Map(Object.entries(jsonData))
        console.log(jsonMap)
    } catch (parseError) {
        console.error('Error al parsear el archivo JSON', parseError)
    }
})

console.log(jsonMap);

router.get('/', (req, res) => res.render('index', { title: 'Taller electiva' }))

module.exports = router