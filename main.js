
let cart = [];
let selectedSize = null; // Variable para almacenar el tamaño seleccionado

// Cargar el carrito desde localStorage al iniciar
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Guardar el carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Agregar un producto al carrito
function addToCart(product, quantity = 1) {
    if (product.name && product.price && quantity > 0 && product.size) {
        const existingProduct = cart.find(item => item.name === product.name && item.size === product.size);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            product.quantity = quantity;
            cart.push(product);
        }
        saveCart();
        updateCart();
    } else {
        console.error("El producto debe tener un nombre, un precio válidos, una cantidad mayor que cero y un tamaño seleccionado.");
    }
}

// Eliminar un producto del carrito
function removeFromCart(productName, productSize) {
    cart = cart.filter(item => !(item.name === productName && item.size === productSize));
    saveCart();
    updateCart();
}

// Vaciar el carrito
function emptyCart() {
    cart = []; // Vaciar el array del carrito
    saveCart(); // Guardar el carrito vacío en localStorage
    updateCart(); // Actualizar la interfaz del carrito
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Limpiar el contenido actual

    if (cart.length === 0) {
        document.getElementById('cart-count').style.display = 'none';
        document.getElementById('cart').style.display = 'none'; // Ocultar el menú del carrito
    } else {
        cart.forEach(item => {
            const li = document.createElement('li');
        
            const removeButton = document.createElement('button');
            removeButton.className = 'cart-item-button'; // Agregar la clase para estilos
        
            // Crear el ícono
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-delete-left'; // Clases de Font Awesome
        
            removeButton.appendChild(icon); // Agregar el ícono al botón
            removeButton.onclick = () => removeFromCart(item.name, item.size); // Asegúrate de que se llame correctamente
        
            li.appendChild(removeButton); // Agregar el botón antes del texto
            li.appendChild(document.createTextNode(`${item.name} (${item.size}) - $${item.price.toFixed(2)} x ${item.quantity}`)); // Incluye el tamaño
        
            cartItemsContainer.appendChild(li);
        });
        

        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        document.getElementById('total-price').textContent = `Total: $${totalPrice.toFixed(2)}`;
        document.getElementById('cart-count').textContent = cart.length;
        document.getElementById('cart-count').style.display = 'block'; // Mostrar el conteo
        document.getElementById('cart').style.display = 'block'; // Mostrar el menú del carrito

        // Agregar botón de "Vaciar Carrito" solo si no está vacío
        if (!document.getElementById('empty-cart-button')) {
            const emptyCartButton = document.createElement('button');
            emptyCartButton.id = 'empty-cart-button'; // Asignar un id único
            emptyCartButton.textContent = 'Vaciar Carrito';
            emptyCartButton.onclick = emptyCart; // Llama a la función para vaciar el carrito
            cartItemsContainer.appendChild(emptyCartButton);
        }
    }
}


// Función para mostrar el menú del carrito
function toggleCartMenu() {
    const cartMenu = document.getElementById('cart');
    if (cart.length === 0) {
        cartMenu.classList.remove('show'); // Ocultar si está vacío
    } else {
        cartMenu.classList.toggle('show'); // Alternar la clase 'show' para mostrar/ocultar
    }
}

// Asignar evento al botón del carrito
document.getElementById('cart-toggle').onclick = toggleCartMenu;

// Llamar a loadCart al cargar la página
window.onload = function() {
    loadCart();

    // Asignar eventos a los botones de tamaño en las páginas de productos
    const sizeButtons = document.querySelectorAll('.size-button');
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            sizeButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            selectedSize = this.getAttribute('data-size');
        });
    });

    // Asignar evento al botón "Agregar al Carrito" en las páginas de productos
    const addToCartButton = document.getElementById('add-to-cart');
    if (addToCartButton) {
        addToCartButton.onclick = function() {
            if (!selectedSize) {
                alert("Por favor, selecciona un tamaño.");
                return;
            }
            const quantity = parseInt(document.getElementById('quantity-input').value);
            if (isNaN(quantity) || quantity <= 0) {
                alert("Por favor, selecciona una cantidad válida.");
                return;
            }
            const product = {
                name: document.querySelector('.product-info h1').textContent,
                price: parseFloat(document.querySelector('.price-value').textContent.replace('$', '').replace('.', '')),
                size: selectedSize
            };
            addToCart(product, quantity);
        };
    }
};

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const modalId = this.getAttribute('data-modal');
            console.log('Botón clickeado:', productName, productPrice, modalId); // Agregar log
            openModal(modalId, productName, productPrice);
        });
    });
});

function openModal(modalId, productName, productPrice) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error('Modal no encontrado:', modalId); // Agregar log
        return;
    }
    modal.style.display = "block";
    console.log('Modal abierto:', modalId); // Agregar log

    const modalProductName = modal.querySelector(".modal-product-name");
    const modalProductPrice = modal.querySelector(".modal-product-price");
    const addToCartButton = modal.querySelector("#add-to-cart-confirm");
    const sizeSelect = modal.querySelector("select"); // Seleccionar el dropdown
    const quantityInput = modal.querySelector('#quantity-input');

    if (modalProductName && modalProductPrice) {
        modalProductName.textContent = productName;
        modalProductPrice.textContent = `$${productPrice}`;
    }

    // Reiniciar la selección de tamaño
    sizeSelect.selectedIndex = 0; // Resetea el dropdown

    addToCartButton.onclick = function() {
        const selectedSize = sizeSelect.value; // Obtener el valor del dropdown

        if (!selectedSize) {
            alert("Por favor, selecciona un tamaño.");
            return;
        }

        const quantity = parseInt(quantityInput.value);
        if (isNaN(quantity) || quantity <= 0) {
            alert("Por favor, selecciona una cantidad válida.");
            return;
        }

        const product = {
            name: productName,
            price: productPrice,
            size: selectedSize
        };

        addToCart(product, quantity);
        closeModal(modal); // Cerrar el modal después de agregar al carrito
    };
}

// Cerrar modales al hacer clic en el botón de cerrar (X)
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.modal .close').forEach(closeButton => {
        closeButton.addEventListener('click', function() {
            const modal = closeButton.closest('.modal');
            console.log('Cerrando modal:', modal);
            closeModal(modal); // Cerrar el modal más cercano
        });
    });
    
});

function setupModal(modalId, productName, productPrice) {
    const modal = document.getElementById(modalId);
    modal.querySelector(".modal-product-name").textContent = productName;
    modal.querySelector(".modal-product-price").textContent = `$${productPrice.toFixed(2)}`;
    
    // Configurar el botón de agregar al carrito
    const addToCartButton = modal.querySelector(`#add-to-cart-confirm-${modalId}`);
    addToCartButton.onclick = function() {
        const selectedSize = modal.querySelector(`#size-select-${modalId}`).value;
        const quantity = parseInt(modal.querySelector(`#quantity-input-${modalId}`).value);

        if (!selectedSize) {
            alert("Por favor, selecciona un tamaño.");
            return;
        }
        if (isNaN(quantity) || quantity <= 0) {
            alert("Por favor, selecciona una cantidad válida.");
            return;
        }

        const product = {
            name: productName,
            price: productPrice,
            size: selectedSize
        };

        addToCart(product, quantity);
        closeModal(modal);
    };
}



// Cerrar el modal al hacer clic fuera de él
window.onclick = function(event) {
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target === modal) {
            console.log('Cerrando modal al hacer clic fuera:', modal);
            closeModal(modal);
        }
    });
};

// Función para cerrar el modal
function closeModal(modal) {
    console.log('Modal cerrado:', modal);
    modal.style.display = "none"; // Ocultar el modal
}

// Agregar eventos a los botones de "Agregar al carrito" en las tarjetas
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.getAttribute('data-name');
        const productPrice = parseFloat(this.getAttribute('data-price'));
        const modalId = this.getAttribute('data-modal');
        openModal(modalId, productName, productPrice);
    });
});

// Manejo de la búsqueda de productos
const products = [
    {
        name: 'Campera Tachas Negras',
        url: '../../assets/products/campera-tachas-negras.html',
        description: 'La elección perfecta para quienes buscan un look audaz y moderno.',
        price: 110407,
        image: '../../assets/clothes/campm.webp',
        category: 'camperas', // Cambiado a 'camperas'
        modalId: 'tachasModal'
    },
    {
        name: 'Zapatillas Jaguar 8575',
        url: '../../assets/products/zapatillas-jaguar-8575.html',
        description: 'Ofrecen un diseño robusto y un confort excepcional.',
        price: 23843,
        image: '../../assets/clothes/zapm.webp',
        category: 'calzado',
        modalId: 'jaguarModal'
    },
    {
        name: 'Kentucky John L. Cook',
        url: '../../assets/products/kentucky-john-l-cook.html',
        description: 'Perfecta para quienes buscan un estilo clásico y elegante.',
        price: 66663,
        image: '../../assets/clothes/camim.webp',
        category: 'camisas',
        modalId: 'kentuckyModal'
    },
    {
        name: 'Mao Lisa Entallada',
        url: '../../assets/products/mao-lisa-entallada.html',
        description: 'Diseñada para quienes buscan una combinación entre elegancia y comodidad.',
        price: 34987,
        image: '../../assets/clothes/cami.webp',
        category: 'camisas',
        modalId: 'maolisaModal'
    },
    {
        name: 'Mockba By Farenheite Gentto Azul',
        url: '../../assets/products/mockba-by-farenheite-gentto-azul.html',
        description: 'Prenda de estilo único.',
        price: 39987,
        image: '../../assets/clothes/camp.webp',
        category: 'camperas', // Cambiado a 'camperas'
        modalId: 'mockbaModal'
    },
    {
        name: 'Stone Premium Tsumeb Jeans',
        url: '../../assets/products/pantalones-stone-premium-tsumeb-jeans.html',
        description: 'Combinan estilo y comodidad.',
        price: 23931,
        image: '../../assets/clothes/pant.webp',
        category: 'jeans',
        modalId: 'stoneModal'
    },
    {
        name: 'Zapatillas Urbana Livanas',
        url: '../../assets/products/zapatillas-urbana-livanas.html',
        description: 'Perfectas para un estilo moderno y cómodo.',
        price: 17590,
        image: '../../assets/clothes/zap.webp',
        category: 'calzado',
        modalId: 'urbanaModal'
    },
    {
        name: 'Wideleg Elastizado',
        url: '../../assets/products/pantalones-wideleg-elastizado.html',
        description: 'Ofrecen un ajuste cómodo y moderno.',
        price: 38999,
        image: '../../assets/clothes/pantm.webp',
        category: 'jeans',
        modalId: 'widelegModal'
    }
];



// Función para mostrar productos
function displayProducts(filter = 'all') {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = ''; // Limpiar el contenedor

    const filteredProducts = filter === 'all' ? products : products.filter(product => product.category === filter);

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.margin = '5px'; // Ajustar el margen de las tarjetas
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <div class="price-button-container">
                <span>$${product.price}</span>
                <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}" data-modal="${product.modalId}">Agregar al Carrito</button>
            </div>
        `;
        productContainer.appendChild(card);
    });

    // Ajustar el número de columnas en el Grid
    adjustGridColumns(filter);
}

// Función para ajustar columnas
function adjustGridColumns(filter) {
    const productContainer = document.getElementById('product-container');
    if (window.innerWidth <= 992) {
        productContainer.style.gridTemplateColumns = `repeat(2, 1fr)`; // 2 columnas para pantallas <= 768px
    } else if (filter === 'all') {
        productContainer.style.gridTemplateColumns = `repeat(4, 1fr)`; // 4 columnas
    } else {
        productContainer.style.gridTemplateColumns = `repeat(2, 1fr)`; // 2 columnas para otros filtros
    }

    // Centrar el contenedor siempre
    productContainer.style.justifyContent = 'center';
}

// Escuchar el evento de redimensionamiento para ajustar las columnas en tiempo real
window.addEventListener('resize', () => displayProducts());

// Delegación de eventos para manejar clics en "Agregar al Carrito"
document.getElementById('product-container').addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart')) {
        const productName = event.target.getAttribute('data-name');
        const productPrice = parseFloat(event.target.getAttribute('data-price'));
        const modalId = event.target.getAttribute('data-modal');
        openModal(modalId, productName, productPrice);
    }
});

// Inicializa los productos al cargar la página
displayProducts();




// Manejar filtros
document.querySelectorAll('.filter').forEach(button => {
    button.addEventListener('click', function() {
        const filterValue = this.getAttribute('data-filter');
        displayProducts(filterValue);
    });
});


const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchWrapper = document.getElementById('search-wrapper');
const searchIcon = document.getElementById('search-icon');

searchIcon.addEventListener('click', () => {
    searchInput.style.display = searchInput.style.display === 'none' ? 'block' : 'none';
    searchResults.style.display = 'none'; // Ocultar resultados al abrir el input
});


searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    searchResults.innerHTML = ''; // Limpiar resultados
    if (query) {
        const filteredProducts = products.filter(product => product.name.toLowerCase().includes(query));
        filteredProducts.forEach(product => {
            const resultItem = document.createElement('div');
            resultItem.textContent = product.name;
            resultItem.onclick = () => {
                window.location.href = product.url; // Redirigir al hacer clic
            };
            searchResults.appendChild(resultItem);
        });
        searchResults.style.display = filteredProducts.length > 0 ? 'block' : 'none'; // Mostrar resultados si hay coincidencias
    } else {
        searchResults.style.display = 'none'; // Ocultar si no hay entrada
    }
});


// Función para mostrar/ocultar el menú del usuario
function toggleUserMenu() {
    const dropdown = document.querySelector('.user-icon .dropdown');
    dropdown.classList.toggle('show'); // Alternar la clase 'show'
}

// Asignar evento al ícono de usuario
document.querySelector('.user-icon a').onclick = function(event) {
    event.preventDefault(); // Evitar el comportamiento predeterminado del enlace
    toggleUserMenu(); // Llama a la función para mostrar/ocultar el menú
};

// Añadir eventos a los enlaces del menú del usuario para evitar que cierren el menú
document.querySelectorAll('.user-icon .dropdown a').forEach(function(link) {
    link.addEventListener('click', function(event) {
        event.stopPropagation(); // Evitar la propagación del evento de click
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.getElementById('search-icon');
    const searchWrapper = document.getElementById('search-wrapper');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
  
    searchIcon.addEventListener('click', function() {
      if (searchWrapper.style.display === 'none' || searchWrapper.style.display === '') {
        searchWrapper.style.display = 'block';
        searchInput.style.display = 'block';
        searchResults.style.display = 'block';
      } else {
        searchWrapper.style.display = 'none';
        searchInput.style.display = 'none';
        searchResults.style.display = 'none';
      }
    });
  });
  

// Manejar el menú del usuario
const userIcon = document.querySelector('.user-icon');
const userDropdown = document.querySelector('.user-icon .dropdown');
const cartIcon = document.querySelector('.cart-icon');
const cartDropdown = document.querySelector('.cart-dropdown');

userIcon.addEventListener('click', function(event) {
    event.preventDefault(); // Evita el comportamiento por defecto del enlace
    userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
    cartDropdown.style.display = 'none'; // Cierra el menú del carrito si está abierto
});

// Manejar el menú del carrito
cartIcon.addEventListener('click', function(event) {
    event.preventDefault(); // Evita el comportamiento por defecto del enlace
    cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
    userDropdown.style.display = 'none'; // Cierra el menú del usuario si está abierto
});

document.querySelector('.navbar-cart').addEventListener('click', function() {
    const dropdown = this.querySelector('.dropdown');
    dropdown.classList.toggle('show'); // Alternar la clase para mostrar/ocultar
});

// script.js


document.addEventListener('DOMContentLoaded', function() {
    const toggleMenu = document.getElementById('toggle-menu');
    const navbarLinks = document.querySelectorAll('.navbar-link');

    toggleMenu.addEventListener('change', function() {
        navbarLinks.forEach(link => {
            if (toggleMenu.checked) {
                link.style.display = 'block';
            } else {
                link.style.display = 'none';
            }
        });
    });
});



  
  
  
  
