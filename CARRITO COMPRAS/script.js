document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const carrito = [];
    const productos = [
        { id: 1, nombre: 'Smartphone X', precio: 599.99, categoria: 'electronica' },
        { id: 2, nombre: 'Camiseta Premium', precio: 29.99, categoria: 'ropa' },
        { id: 3, nombre: 'Juego de Sábanas', precio: 89.99, categoria: 'hogar' },
        { id: 4, nombre: 'Auriculares Inalámbricos', precio: 199.99, categoria: 'electronica' }
    ];
    
    // Elementos del DOM
    const tablaCarrito = document.getElementById('tabla-carrito').getElementsByTagName('tbody')[0];
    const totalCarrito = document.getElementById('total-carrito');
    const btnVaciar = document.getElementById('vaciar-carrito');
    const btnFinalizar = document.getElementById('finalizar-compra');
    const btnImprimir = document.getElementById('imprimir-ticket');
    const filtroCategoria = document.getElementById('categoria-filtro');
    const productosGrid = document.querySelector('.productos-grid');
    
    // Event Listeners
    document.querySelectorAll('.agregar-carrito').forEach(btn => {
        btn.addEventListener('click', agregarAlCarrito);
    });
    
    btnVaciar.addEventListener('click', vaciarCarrito);
    btnFinalizar.addEventListener('click', finalizarCompra);
    btnImprimir.addEventListener('click', imprimirTicket);
    filtroCategoria.addEventListener('change', filtrarProductos);
    
    // Funciones
    function agregarAlCarrito(e) {
        const idProducto = parseInt(e.target.dataset.id);
        const producto = productos.find(p => p.id === idProducto);
        
        const productoEnCarrito = carrito.find(item => item.id === idProducto);
        
        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        
        actualizarCarrito();
    }
    
    function actualizarCarrito() {
        // Limpiar tabla
        tablaCarrito.innerHTML = '';
        
        // Rellenar tabla
        carrito.forEach(producto => {
            const fila = document.createElement('tr');
            
            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td><input type="number" class="cantidad-input" value="${producto.cantidad}" min="1" data-id="${producto.id}"></td>
                <td>$${(producto.precio * producto.cantidad).toFixed(2)}</td>
                <td><button class="eliminar-producto" data-id="${producto.id}">Eliminar</button></td>
            `;
            
            tablaCarrito.appendChild(fila);
        });
        
        // Actualizar total
        const total = carrito.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
        totalCarrito.textContent = `$${total.toFixed(2)}`;
        
        // Agregar eventos a los nuevos elementos
        document.querySelectorAll('.eliminar-producto').forEach(btn => {
            btn.addEventListener('click', eliminarProducto);
        });
        
        document.querySelectorAll('.cantidad-input').forEach(input => {
            input.addEventListener('change', cambiarCantidad);
        });
    }
    
    function eliminarProducto(e) {
        const idProducto = parseInt(e.target.dataset.id);
        const index = carrito.findIndex(item => item.id === idProducto);
        
        if (index !== -1) {
            carrito.splice(index, 1);
            actualizarCarrito();
        }
    }
    
    function cambiarCantidad(e) {
        const idProducto = parseInt(e.target.dataset.id);
        const cantidad = parseInt(e.target.value);
        
        if (cantidad < 1) {
            e.target.value = 1;
            return;
        }
        
        const productoEnCarrito = carrito.find(item => item.id === idProducto);
        
        if (productoEnCarrito) {
            productoEnCarrito.cantidad = cantidad;
            actualizarCarrito();
        }
    }
    
    function vaciarCarrito() {
        carrito.length = 0;
        actualizarCarrito();
    }
    
    function finalizarCompra() {
        if (carrito.length === 0) {
            alert('El carrito está vacío. Agrega productos antes de finalizar la compra.');
            return;
        }
        
        const total = carrito.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
        alert(`¡Compra finalizada!\nTotal a pagar: $${total.toFixed(2)}\nGracias por su compra.`);
        vaciarCarrito();
    }
    
    function imprimirTicket() {
        if (carrito.length === 0) {
            alert('El carrito está vacío. No hay nada que imprimir.');
            return;
        }
        
        window.print();
    }
    
    function filtrarProductos() {
        const categoria = filtroCategoria.value;
        const productosDOM = document.querySelectorAll('.producto');
        
        productosDOM.forEach(producto => {
            if (categoria === 'todos' || producto.dataset.categoria === categoria) {
                producto.style.display = 'block';
            } else {
                producto.style.display = 'none';
            }
        });
    }
});