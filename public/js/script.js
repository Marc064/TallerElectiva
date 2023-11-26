function saveProduct() {
    const id = document.getElementById('idProduct').value
    const name = document.getElementById('nameProduct').value
    const price = document.getElementById('priceProduct').value
    const stock = '0'

    if (id !== "" && name !== "" && price !== "") {

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/products", true);
        xhr.onreadystatechange = () => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    
                }
            }
        }
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        const data = `id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}&stock=${encodeURIComponent(stock)}`;

        xhr.send(data);
        window.location.reload();
    } else {
        alert('Se deben diligenciar todos los campos');
    }
}

function saveSupplier() {
    const id = document.getElementById('idSupplier').value;
    const name = document.getElementById('nameSupplier').value;
    const number = document.getElementById('numberProduct').value;
    const email = document.getElementById('emailSupplier').value;

    if (id !== "" && name !== "" && number !== "" && email !== "") {

        const xhr = new XMLHttpRequest()
        xhr.open("POST", "/suppliers", true)
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
            }
        }
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        const data = `id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&number=${encodeURIComponent(number)}&email=${encodeURIComponent(email)}`;

        xhr.send(data);
        window.location.reload();
    } else {
        alert('Se deben diligenciar todos los campos');
    }
}



function savePurchase() {
    const selectedOption = document.getElementById('selectProducto').value
    const supplierId = document.getElementById('selectProveedor').value
    const quantity = document.getElementById('Cantidad').value
    const price = document.getElementById('Valor').value
    const typeSale = 'purchase'
    const [productId, productStock] = selectedOption.split(':')
    if (productId !== "Seleccione un producto" && supplierId !== "Seleccione un proveedor" && quantity !== "" && price !== "") {
        if(Number(productStock)+Number(quantity) <=100){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/sales", true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
               
                console.log('Compra registrada con éxito');
               
                $('#registrarCompraModal').modal('hide');
            }
        }
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        const data = `productId=${encodeURIComponent(productId)}&supplierId=${encodeURIComponent(supplierId)}&quantity=${encodeURIComponent(quantity)}&price=${encodeURIComponent(price)}&typeSale=${encodeURIComponent(typeSale)}`;

        xhr.send(data);
        window.location.reload();
    }else{
        alert("No se puede superar el limite del invetario de maximo 100 por producto")
    }
    } else {
        alert('Se deben diligenciar todos los campos');
    }
}

function saveSale() {
    const selectedOption = document.getElementById('productoSale').value;
    const quantity = document.getElementById('CantidadSale').value;
    const typeSale = 'sale';
    const [productId, productStock] = selectedOption.split(':')
    const selectedProduct = document.getElementById

    if (productId !== "Seleccione un producto" && quantity !== "") {
        if (selectedProduct && Number(quantity) <= Number(productStock)) {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/sales", true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    console.log('Venta registrada con éxito');
                    $('#registrarCompraModal').modal('hide');
                    
                }
            }
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            const data = `productId=${encodeURIComponent(productId)}&supplierId=${encodeURIComponent("")}&quantity=${encodeURIComponent(quantity)}&price=${encodeURIComponent("")}&typeSale=${encodeURIComponent(typeSale)}`;

            xhr.send(data);
            window.location.reload();
        } else {
            alert('La cantidad ingresada supera la cantidad disponible en el inventario.');
        }
    } else {
        alert('Se deben diligenciar todos los campos');
    }
}
async function descargarPDF() {
    try {
        const response = await fetch('/descargar-pdf');
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'historial_ventas.pdf';
        link.click();
    } catch (error) {
        console.error('Error al descargar PDF:', error);
    }
}

async function descargarExcel() {
    try {
        const response = await fetch('/descargar-excel');
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'historial_ventas.xlsx';
        link.click();
    } catch (error) {
        console.error('Error al descargar Excel:', error);
    }
}

async function generarInformeWord() {
    try {
        const response = await fetch('/generar-informe-word');
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'informe_ventas.docx';
        link.click();
    } catch (error) {
        console.error('Error al generar informe en Word:', error);
    }
}

function imprimirInforme() {
  
    window.print();
}

