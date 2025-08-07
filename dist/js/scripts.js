document.addEventListener("DOMContentLoaded", function () {
  // === VERIFICAR SESIÓN Y MOSTRAR USUARIO ===
  function verificarYMostrarUsuario() {
    const sesion = localStorage.getItem('sesionActiva') || sessionStorage.getItem('sesionActiva');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (sesion) {
      const usuario = JSON.parse(sesion);
      const navbar = document.querySelector('.navbar .container');
      const navbarBrand = navbar.querySelector('.navbar-brand');
      
      // Crear elemento de bienvenida si no existe
      let welcomeElement = document.getElementById('welcomeUser');
      if (!welcomeElement) {
        welcomeElement = document.createElement('span');
        welcomeElement.id = 'welcomeUser';
        welcomeElement.className = 'navbar-text ms-3';
        welcomeElement.style.color = '#0D3B66';
        welcomeElement.style.fontWeight = '600';
        welcomeElement.innerHTML = `¡Bienvenido, ${usuario.nombre}!`;
        
        // Insertar después del navbar-brand
        navbarBrand.parentNode.insertBefore(welcomeElement, navbarBrand.nextSibling);
      }
      
      // Mostrar botón de cerrar sesión
      if (logoutBtn) {
        logoutBtn.style.display = 'inline-block';
      }
    } else {
      // Ocultar botón de cerrar sesión si no hay sesión
      if (logoutBtn) {
        logoutBtn.style.display = 'none';
      }
    }
  }
  
  // === FUNCIÓN PARA CERRAR SESIÓN ===
  function cerrarSesion() {
    // Eliminar datos de sesión
    localStorage.removeItem('sesionActiva');
    sessionStorage.removeItem('sesionActiva');
    
    // Redirigir a la página de login
    window.location.href = '../index.html';
  }
  
  // Llamar la función al cargar la página
  verificarYMostrarUsuario();
  
  // === EVENT LISTENER PARA CERRAR SESIÓN ===
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', cerrarSesion);
  }
  
  // === SUSCRIPCIÓN CON ALERTA ===
  const subscriptionForm = document.getElementById("subscriptionForm");
  const alertContainer = document.getElementById("alertContainer");

  if (subscriptionForm) {
    subscriptionForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alertContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
          <strong>¡Gracias por suscribirte!</strong> Te mantendremos informado sobre nuestras promociones y ofertas.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>`;
      subscriptionForm.reset();
      setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance(
          document.querySelector(".alert")
        );
        alert.close();
      }, 3000);
    });
  }

  // === CONTACTO CON ALERTA ===
  const contactForm = document.getElementById("contactForm");
  const contactAlertContainer = document.getElementById(
    "contactAlertContainer"
  );

  if (contactForm && contactAlertContainer) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      contactAlertContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
          <strong>¡Gracias por escribirnos!</strong> Nos pondremos en contacto contigo a la brevedad posible.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>`;
      contactForm.reset();
      setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance(
          contactAlertContainer.querySelector(".alert")
        );
        alert.close();
      }, 3000);
    });
  }
  // === VARIABLES CARRITO ===
  const abrirCarritoBtn = document.getElementById("abrirCarrito");
  const cerrarCarritoBtn = document.getElementById("cerrarCarrito");
  const carritoSidebar = document.getElementById("carritoSidebar");
  const carritoItemsContainer = document.getElementById("carritoItems");
  const realizarPedidoBtn = document.getElementById("realizarPedidoBtn");
  const formularioPedidoContainer = document.getElementById(
    "formularioPedidoContainer"
  );
  const formularioPedido = document.getElementById("formularioPedido");
  const overlayCarrito = document.getElementById("overlayCarrito");
  const carritoNotificacion = document.getElementById("carritoNotificacion");

  // === FUNCIONES DEL CARRITO ===
  function actualizarNotificacionCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    carritoNotificacion.style.display = totalCantidad > 0 ? "flex" : "none";
    carritoNotificacion.textContent = totalCantidad;
  }
  function cargarCarrito() {
  carritoItemsContainer.innerHTML = "";
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const vaciarBtn = document.getElementById('vaciarCarritoBtn'); // Referencia al botón

  if (carrito.length === 0) {
    carritoItemsContainer.innerHTML = '<p class="text-muted">Tu carrito está vacío.</p>';
    if (vaciarBtn) vaciarBtn.style.display = 'none'; // Oculta el botón si no hay productos
    actualizarNotificacionCarrito();
    return;
  }
  // Si hay productos, muestra el botón
  if (vaciarBtn) vaciarBtn.style.display = 'block';

    let total = 0;
    carrito.forEach((item, index) => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;
      const div = document.createElement("div");
      div.classList.add(
        "d-flex",
        "align-items-center",
        "mb-2",
        "gap-2",
        "justify-content-between"
      );
      div.innerHTML = `
        <img src="${item.img}" alt="${
        item.nombre
      }" width="50" height="50" style="object-fit: cover;">
        <div class="flex-grow-1 ms-2">
          <p class="mb-0">${item.nombre}</p>
          <p class="">${item.id}</p>
          <small>Cantidad: ${item.cantidad}</small><br>
          <small>Subtotal: $${subtotal.toLocaleString("es-CL")}</small>
        </div>
        <button class="btn btn-sm btn-danger" data-index="${index}">&times;</button>
      `;
      carritoItemsContainer.appendChild(div);
    });

    const totalDiv = document.createElement("div");
    totalDiv.classList.add("mt-3", "fw-bold", "text-end");
    totalDiv.textContent = `Total: $${total.toLocaleString("es-CL")}`;
    carritoItemsContainer.appendChild(totalDiv);

    actualizarNotificacionCarrito();
  }

  // === FUNCIÓN PARA VACIAR EL CARRITO ===
function vaciarCarrito() {
  if (confirm("¿Estás seguro de que quieres vaciar todo el carrito?")) {
    localStorage.removeItem("carrito");
    cargarCarrito(); // Esto actualizará automáticamente la vista
  }
}

  // === EVENTOS DEL CARRITO ===
  abrirCarritoBtn?.addEventListener("click", () => {
    carritoSidebar.classList.add("abierto");
    overlayCarrito.classList.add("activo");
    cargarCarrito();
  });

  cerrarCarritoBtn?.addEventListener("click", cerrarCarrito);
  overlayCarrito?.addEventListener("click", cerrarCarrito);

  function cerrarCarrito() {
    carritoSidebar.classList.remove("abierto");
    overlayCarrito.classList.remove("activo");
    formularioPedidoContainer.style.display = "none";
  }

  carritoItemsContainer?.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const index = e.target.getAttribute("data-index");
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      carrito.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      cargarCarrito();
    }
  });

  realizarPedidoBtn?.addEventListener("click", () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito.length === 0) {
      alert(
        "Tu carrito está vacío. Agrega productos antes de realizar un pedido."
      );
      return;
    }
    formularioPedidoContainer.style.display =
      formularioPedidoContainer.style.display === "none" ? "block" : "none";
  });

   // === EVENTO PARA VACIAR CARRITO ===
  document.getElementById('vaciarCarritoBtn')?.addEventListener('click', vaciarCarrito);

  formularioPedido?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(
      "¡Pedido realizado!, te daremos seguimiento a través de tu correo. Si tienes dudas o consultas adicionales, no dudes en contactarnos."
    );
    formularioPedido.reset();
    formularioPedidoContainer.style.display = "none";
    localStorage.removeItem("carrito");
    cargarCarrito();
    cerrarCarrito();
  });

  // === FILTRADO, CARGA Y PAGINACIÓN DE PRODUCTOS ===
  const productosGrid = document.getElementById("productosGrid");
  const pagina1Btn = document.getElementById("pagina1");
  const pagina2Btn = document.getElementById("pagina2");
  const filtroInput = document.getElementById("filtroProductos"); // Agregamos el input de filtro

  if (productosGrid) {
    let productosData = []; // Guardará todos los productos
    let productosFiltrados = []; // Guardará los productos que coinciden con la búsqueda

    function mostrarProductosEnGrid(productos, pagina) {
      productosGrid.innerHTML = "";
  if (productos.length === 0) {
    // Si no hay productos, mostrar el mensaje de "No se encontraron productos"
    productosGrid.innerHTML = `
      <div class="col-12 text-center">
        <p class="h4 text-muted">No se encontraron productos que coincidan con la búsqueda. 😥</p>
      </div>
    `;
    return; // Salir de la función para no intentar renderizar nada
  }

      const itemsPorPagina = 9;
      const inicio = (pagina - 1) * itemsPorPagina;
      const fin = inicio + itemsPorPagina;
      const productosMostrar = productos.slice(inicio, fin);

      productosMostrar.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("col-md-4", "mb-3");
        card.innerHTML = `
          <div class="card h-100">
            <img src="${producto.img}" class="card-img-top" alt="${producto.nombre}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="small data-id">ID: ${producto.id}</p>
              <p class="card-text">${producto.desc}</p>
              <p class="card-text fw-bold text-primary">$${producto.precio.toLocaleString("es-CL")}</p>
              <a href="#" class="btn btn-primary mt-auto">Comprar</a>
            </div>
          </div>
        `;
        productosGrid.appendChild(card);
      });
    }

    function actualizarPaginacion(productos) {
      const totalPaginas = Math.ceil(productos.length / 9); // Asumiendo 9 productos por página
      pagina1Btn.style.display = "block";
      pagina2Btn.style.display = totalPaginas > 1 ? "block" : "none";

      if (totalPaginas <= 1) {
        pagina1Btn.classList.add("active");
      }
    }

    // ... (código anterior)

// Función auxiliar para eliminar acentos de una cadena
function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filtrarProductos(terminoBusqueda) {
  if (!terminoBusqueda) {
    productosFiltrados = productosData;
  } else {
    // Normalizar el término de búsqueda
    const terminoNormalizado = removeAccents(terminoBusqueda.toLowerCase());

    productosFiltrados = productosData.filter((producto) => {
      // Normalizar el nombre y la descripción de cada producto
      const nombreNormalizado = removeAccents(producto.nombre.toLowerCase());
      const descNormalizada = removeAccents(producto.desc.toLowerCase());

      return (
        nombreNormalizado.includes(terminoNormalizado) ||
        descNormalizada.includes(terminoNormalizado)
      );
    });
  }
  actualizarPaginacion(productosFiltrados);
  mostrarProductosEnGrid(productosFiltrados, 1);
}

// ... (código posterior)
    // Carga inicial de productos
    fetch("../src/data/productos.json")
      .then((response) => response.json())
      .then((data) => {
        productosData = data;
        productosFiltrados = data;
        mostrarProductosEnGrid(productosData, 1); // Mostrar los primeros 9 productos al cargar
        actualizarPaginacion(productosData);
      })
      .catch((error) => {
        console.error("Error al cargar productos:", error);
        productosGrid.innerHTML = `<p class="text-danger">No se pudieron cargar los productos. Inténtalo nuevamente más tarde.</p>`;
      });

    // Eventos de paginación
    pagina1Btn.addEventListener("click", () => {
      mostrarProductosEnGrid(productosFiltrados, 1);
      pagina1Btn.classList.add("active");
      pagina2Btn.classList.remove("active");
    });

    pagina2Btn.addEventListener("click", () => {
      mostrarProductosEnGrid(productosFiltrados, 2);
      pagina2Btn.classList.add("active");
      pagina1Btn.classList.remove("active");
    });

    // Evento para el filtro
    filtroInput.addEventListener("input", (e) => {
      const termino = e.target.value;
      filtrarProductos(termino);
    });
  }
});

// === AGREGAR PRODUCTO AL CARRITO DESDE BOTÓN COMPRAR ===
document.addEventListener("click", (e) => {
  if (
    e.target.matches(".btn.btn-primary") &&
    e.target.textContent.trim() === "Comprar"
  ) {
    e.preventDefault();
    const card = e.target.closest(".card");
    const nombre = card.querySelector(".card-title").textContent;
    const img = card.querySelector("img").getAttribute("src");
    const precioText = card.querySelector(".fw-bold").textContent;
    const precio = parseInt(precioText.replace(/\D/g, ""));
    const id = card.querySelector(".data-id").textContent;  

    let cantidad = prompt("¿Cuántas unidades deseas agregar?", "1");
    cantidad = parseInt(cantidad);
    if (isNaN(cantidad) || cantidad <= 0) {
      alert("Cantidad inválida.");
      return;
    }

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const indexExistente = carrito.findIndex((item) => item.nombre === nombre);
    if (indexExistente >= 0) {
      carrito[indexExistente].cantidad += cantidad;
    } else {
carrito.push({ id, nombre, img, precio, cantidad });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));

    e.target.textContent = "Agregado";
    e.target.disabled = true;
    setTimeout(() => {
      e.target.textContent = "Comprar";
      e.target.disabled = false;
    }, 1500);
// AGREGA ESTAS 2 LÍNEAS AL FINAL DEL EVENTO:
    if (carritoSidebar.classList.contains("abierto")) {
      cargarCarrito(); // Actualiza el carrito si está abierto
    }
    actualizarNotificacionCarrito();
  }
});

const darkModeToggle = document.getElementById("darkModeToggle");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Cargar preferencia previa
if (
  localStorage.getItem("dark-mode") === "enabled" ||
  (!localStorage.getItem("dark-mode") && prefersDarkScheme.matches)
) {
  document.body.classList.add("dark-mode");
}

darkModeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("dark-mode", "enabled");
  } else {
    localStorage.setItem("dark-mode", "disabled");
  }
});


requestAnimationFrame(() => {
  document.body.classList.add("fade-in");
});

// === ANIMACIÓN FADE EN MAIN ===
const main = document.querySelector("main");
if (main) {
  main.classList.add("fade-in");
}


actualizarNotificacionCarrito();