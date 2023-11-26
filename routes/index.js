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
        
        // Verificar si la cadena JSON no está vacía antes de intentar analizarla
        if (data.trim() !== '') {
            const jsonData = JSON.parse(data);
            fileNames[i] = new Map(Object.entries(jsonData));
            console.log(fileNames[i]);
        } else {
            console.log(`El archivo ${filePath} está vacío.`);
        }
    } catch (parseError) {
        console.error(`Error al parsear el archivo JSON ${filePath}:`, parseError);
    }
    
}

const exists = (id, fileMap) => Array.from(fileMap.values()).some(obj => obj.id === id)


const update = (fileIndex, fileMap) => {
    try {
        const jsonData = JSON.stringify(Array.from(fileMap.values()));
        fs.writeFileSync(filePaths[fileIndex], jsonData, 'utf8');
        const index = filePaths.indexOf(filePaths[fileIndex]);
        if (index !== -1) {
            fileNames[index] = new Map(fileMap);
        }
    } catch (error) {
        console.error(`Error al actualizar el archivo: ${filePaths[fileIndex]}`, error);
    }
}


fileNames[0].set('34213', {'dhdhdhd': 4323});
fileNames[0].set('63446', {'dhdhdhd': 'dsfsdf'});
update(0, fileNames[0]);
console.log(fileNames[0]);

router.get('/', (req, res) => res.render('index', { title: 'Inicio' }))
router.get('/products', (req, res) => res.render('products', { title: 'Productos', product: fileNames[0] }))
router.get('/sales', (req, res) => res.render('sales', { title: 'Facturacion', sale: fileNames[1] }))
router.get('/counts', (req, res) => res.render('count', { title: 'Cuentas', count: fileNames[2] }))
router.get('/suppliers', (req, res) => res.render('suppliers', { title: 'Proveedores', supplier: fileNames[3] }))

router.post('/products', (req, res) => {
    const { id, name, price, stock } = req.body;

    if (!exists(id, fileNames[0])) {
        const newProductId = fileNames[0].size + 1;
        fileNames[0].set(newProductId, {
            id: id,
            name: name,
            price: price,
            stock: stock
        });
        update(filePaths[0], fileNames[0])
    } else {
        existingProduct.name = name
        existingProduct.price = price
        existingProduct.stock = stock
        update(filePaths[0], fileNames[0])
    }
});




module.exports = router;
