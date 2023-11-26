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
