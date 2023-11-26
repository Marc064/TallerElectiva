const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const moment = require('moment');
const { type } = require("os");


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

const getProductById = (productId) => {
    return Array.from(fileNames[0].values()).find(product => product.id === productId)
}

const getSupplierById = (supplierId) => {
    return Array.from(fileNames[2].values()).find(supplier => supplier.id === supplierId)
}

const getTypeofSale = (typeSale) => {
    return Array.from(fileNames[1].values()).find(sale => sale.type === typeSale)

}

const getTotalPurchases = () => {
    const purchases = Array.from(fileNames[1].values()).filter(sale => sale.type === 'purchase');
    return calculateTotalAmount(purchases);
};

const calculateTotalAmount = (transactions) => {
    return transactions.reduce((total, transaction) => {
        return total + Number(transaction.price);
    }, 0);
};
const getTotalSales = () => {
    const sales = Array.from(fileNames[1].values()).filter(sale => sale.type === 'sale');
    return calculateTotalAmount(sales);
};

router.get('/products', (req, res) => {
    const totalStock = Array.from(fileNames[0].values()).reduce((acc, product) => acc + parseInt(product.stock), 0);
    res.render('products', { title: 'Productos', product: fileNames[0], totalStock });
});


router.get('/products', (req, res) => res.render('products', { title: 'Productos', product: fileNames[0] }));


router.get('/', (req, res) => res.render('index', { title: 'Inicio' }))

router.get('/sales', (req, res) => { res.render('sales', { title: 'Facturacion', sale: fileNames[1], product: fileNames[0], supplier: fileNames[2], getProductById, getSupplierById, getTypeofSale }) })
router.get('/suppliers', (req, res) => res.render('suppliers', { title: 'Proveedores', supplier: fileNames[2] }))


router.get('/counts', (req, res) => {
    const totalProducts = fileNames[0].size;
    const totalSuppliers = fileNames[2].size;
    const totalPurchases = getTotalPurchases();
    const totalSales = getTotalSales();

    res.render('count', { title: 'Cuentas', totalProducts, totalSuppliers, totalSales, totalPurchases });

});





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
router.post('/sales', (req, res) => {
    const { productId, supplierId, quantity, price, typeSale } = req.body;

    const timestamp = moment().format('YYYYMMDDHHmmssSSS');
    const newSaleId = `${timestamp}_${fileNames[1].size}`;

    const existingProduct = Array.from(fileNames[0].values()).find(product => product.id === productId);

    if (typeSale === 'purchase' && supplierId !== "" && price !== "") {
        // Compra
        existingProduct.stock = (Number(existingProduct.stock) + Number(quantity)).toString();
        fileNames[1].set(newSaleId, {
            id: newSaleId,
            productId: productId,
            supplierId: supplierId,
            quantity: quantity,
            price: (Number(price) * Number(quantity)).toString(),
            type: typeSale,
            timestamp: timestamp
        });
    } else if (typeSale === 'sale') {
        // Venta
        existingProduct.stock = (Number(existingProduct.stock) - Number(quantity)).toString();
        fileNames[1].set(newSaleId, {
            id: newSaleId,
            productId: productId,
            quantity: quantity,
            price: (Number(existingProduct.price) * Number(quantity)).toString(),
            type: typeSale,
            timestamp: timestamp
        });
    } else {

        return res.status(400).send('Error: Tipo de venta no reconocido o campos faltantes');
    }

    update(0, fileNames[0]);
    update(1, fileNames[1]);
    res.status(200).send('Operación registrada con éxito');
});

router.get('/descargar-pdf', async (req, res) => {
    try {

        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('http://localhost:3000/counts');
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=historial_ventas.pdf');
        res.status(200).send(pdfBuffer);
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error al generar el PDF');
    }
});

router.get('/descargar-excel', (req, res) => {
    try {
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Historial Transacciones');
        worksheet.addRow(['Tipo', 'Producto', 'Cantidad', 'Precio', 'Fecha']);

        // Obtener datos de ventas y compras
        const transacciones = Array.from(fileNames[1].values()).map(transaction => {
            const tipo = transaction.type === 'purchase' ? 'Compra' : 'Venta';
            const producto = getProductById(transaction.productId).name;
            const cantidad = transaction.quantity;
            const precio = transaction.price;
            const fecha = transaction.timestamp;

            return { tipo, producto, cantidad, precio, fecha };
        });

        // Agregar filas al archivo Excel
        transacciones.forEach(transaccion => {
            worksheet.addRow([transaccion.tipo, transaccion.producto, transaccion.cantidad, transaccion.precio, transaccion.fecha]);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=historial_transacciones.xlsx');
        workbook.xlsx.write(res).then(() => res.status(200).end());
    } catch (error) {
        console.error('Error al generar el archivo Excel:', error);
        res.status(500).send('Error al generar el archivo Excel');
    }
});

router.get('/generar-informe-word', (req, res) => {
    try {

        const Docxtemplater = require('docxtemplater');

        const templateContent = fs.readFileSync(path.resolve(__dirname, 'plantilla.docx'), 'binary');

        const template = new Docxtemplater();
        template.loadZip(templateContent);

        const historial = [
            { tipo: 'Compra', detalle: 'Producto 1 - 10 unidades', fecha: '2023-11-26' },
            { tipo: 'Venta', detalle: 'Producto 2 - 5 unidades', fecha: '2023-11-25' },

        ];

        template.setData({
            fecha: '26 de noviembre de 2023',
            historial: historial,
        });

        template.render();
        const outputBuffer = template.getZip().generate({ type: 'nodebuffer' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=informe_ventas.docx');
        res.status(200).send(outputBuffer);
    } catch (error) {
        console.error('Error al generar el informe en Word:', error);
        res.status(500).send('Error al generar el informe en Word');
    }
});

module.exports = router;
