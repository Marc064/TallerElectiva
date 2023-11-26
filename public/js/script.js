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
    const productId = document.getElementById('selectProducto').value
    const supplierId = document.getElementById('selectProveedor').value
    const quantity = document.getElementById('Cantidad').value
    const price = document.getElementById('Valor').value
    const typeSale = 'purchase'
    if (productId !== "Seleccione un producto" && supplierId !== "Seleccione un proveedor" && quantity !== "" && price !== "") {

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
    } else {
        alert('Se deben diligenciar todos los campos');
    }
}

function saveSale() {
    const productId = document.getElementById('productoSale').value
    const quantity = document.getElementById('CantidadSale').value
    const typeSale = 'sale'
    if (productId !== "Seleccione un producto" && quantity !== "") {

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
        alert('Se deben diligenciar todos los campos');
    }
}