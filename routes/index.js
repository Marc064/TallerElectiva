const express = require("express")
const router = express.Router()
const path = require("path")
const fs = require("fs")

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

const filePath = path.join(__dirname, '../../Persistencia/products.json')
let products = ""

fs.readFile(filePath, 'utf8', (err, data) => {
    try {
        const jsonData = JSON.parse(data)
        products = new Map(Object.entries(jsonData))
        console.log(products)
    } catch (parseError) {
        console.error('Error al parsear el archivo JSON', parseError)
    }
})

console.log(products);
products = "Si"
router.get('/', (req, res) => res.render('index', { title: 'Inicio' }))
router.get('/products', (req, res) => res.render('products', { title : 'Productos', product: products}))
router.get('/sales', (req, res) => res.render('sales', {title:'Facturacion'}))
router.get('/users', (req, res) => res.render('users', {title:'Usuarios'}))
router.get('/suppliers', (req, res) => res.render('suppliers', {title:'Proveedores'}))

module.exports = router