const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const filePaths = [
    path.join(__dirname, "../../products.json"),
    path.join(__dirname, "../../sales.json"),
    path.join(__dirname, "../../suppliers.json"),
    path.join(__dirname, "../../count.json")
];

let products = new Map();
let sales = new Map();
let suppliers = new Map();
let counts = new Map();

const fileNames = [products, sales, suppliers, counts];

for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i]
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]', 'utf8');
    }

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        
        if (data.trim() !== '') {
            const jsonData = JSON.parse(data);
            fileNames[i] = new Map(Object.entries(jsonData));
            console.log(fileNames[i]);
        } else {
            console.log(`El archivo ${filePath} está vacío.`);
            console.log(fileNames[i]);
        }
    } catch (parseError) {
        console.error(`Error al parsear el archivo JSON ${filePath}:`, parseError);
    }
    
}

const exists = (id, fileMap) => Array.from(fileMap.values()).some(obj => obj.id === id)


const update = (fileIndex, fileMap) => {
    try {
        const jsonData = JSON.stringify(Array.from(fileMap.values()))
        fs.writeFileSync(filePaths[fileIndex], jsonData, 'utf8')
        const index = filePaths.indexOf(filePaths[fileIndex])
        if (index !== -1) {
            fileNames[index] = new Map(fileMap)
        }
        console.log(fileNames[fileIndex])
    } catch (error) {
        console.error(`Error al actualizar el archivo: ${filePaths[fileIndex]}`, error)
    }
}





router.get('/', (req, res) => res.render('index', { title: 'Inicio' }))
router.get('/products', (req, res) => res.render('products', { title: 'Productos', product: fileNames[0] }))
router.get('/sales', (req, res) => res.render('sales', { title: 'Facturacion', sale: fileNames[1] }))
router.get('/suppliers', (req, res) => res.render('suppliers', { title: 'Proveedores', supplier: fileNames[2] }))
router.get('/counts', (req, res) => res.render('count', { title: 'Cuentas', count: fileNames[3] }))

router.post('/products', (req, res) => {
    const { id, name, price, stock } = req.body;
    if (!exists(id, fileNames[0])) {
        const newProductId = fileNames[0].size;
        fileNames[0].set(newProductId, {
            id: id,
            name: name,
            price: price,
            stock: stock
        });
        
        if (filePaths[0]) {
            update(0, fileNames[0]);
        } else {
            console.error('Error: filePaths[0] no está definido.');
        }
    } else {

        const existingProduct = Array.from(fileNames[0].values()).find(product => product.id === id)
        existingProduct.name = name
        existingProduct.price = price
        existingProduct.stock = stock

        if (filePaths[0]) {
            update(0, fileNames[0])
        } else {
            console.error('Error: filePaths[0] no está definido.')
        }
    }
})

router.post('/suppliers', (req, res) => {
    const { id, name, number, email } = req.body;
    if (!exists(id, fileNames[2])) {
        const newProductId = fileNames[2].size;
        fileNames[2].set(newProductId, {
            id: id,
            name: name,
            number: number,
            email: email
        });
        
        if (filePaths[2]) {
            update(2, fileNames[2]);
        } else {
            console.error('Error: filePaths[2] no está definido.');
        }
    } else {

        const existingProduct = Array.from(fileNames[2].values()).find(product => product.id === id)
        existingProduct.name = name
        existingProduct.number = number
        existingProduct.email = email

        if (filePaths[2]) {
            update(2, fileNames[2])
        } else {
            console.error('Error: filePaths[2] no está definido.')
        }
    }
})









module.exports = router;
