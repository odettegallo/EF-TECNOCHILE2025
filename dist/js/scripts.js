document.addEventListener("DOMContentLoaded", function () {
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
    if (carrito.length === 0) {
      carritoItemsContainer.innerHTML =
        '<p class="text-muted">Tu carrito está vacío.</p>';
      actualizarNotificacionCarrito();
      return;
    }

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

  const productosGrid = document.getElementById("productosGrid");
  const btnPagina1 = document.getElementById("pagina1");
  const btnPagina2 = document.getElementById("pagina2");

  if (productosGrid) {
    fetch("../src/data/productos.json")
      .then((response) => response.json())
      .then((data) => {
        const itemsPorPagina = 9;
        let paginaActual = 1;

        function mostrarProductosPagina(pagina) {
          productosGrid.innerHTML = "";
          const inicio = (pagina - 1) * itemsPorPagina;
          const fin = inicio + itemsPorPagina;
          const productosPagina = data.slice(inicio, fin);

          productosPagina.forEach((producto) => {
            const card = document.createElement("div");
            card.classList.add("col-md-4", "mb-3");
            card.innerHTML = `
            <div class="card h-100">
              <img src="${producto.img}" class="card-img-top" alt="${
              producto.nombre
            }">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">${producto.desc}</p>
                <p class="card-text fw-bold text-primary">$${producto.precio.toLocaleString(
                  "es-CL"
                )}</p>
                <a href="#" class="btn btn-primary mt-auto">Comprar</a>
              </div>
            </div>
          `;
            productosGrid.appendChild(card);
          });
        }

        mostrarProductosPagina(paginaActual);

        btnPagina1.addEventListener("click", () => {
          paginaActual = 1;
          mostrarProductosPagina(paginaActual);
          btnPagina1.classList.add("active");
          btnPagina2.classList.remove("active");
        });

        btnPagina2.addEventListener("click", () => {
          paginaActual = 2;
          mostrarProductosPagina(paginaActual);
          btnPagina2.classList.add("active");
          btnPagina1.classList.remove("active");
        });

        btnPagina1.classList.add("active");
      })
      .catch((error) => {
        console.error("Error al cargar productos:", error);
        productosGrid.innerHTML = `<p class="text-danger">No se pudieron cargar los productos. Intenta nuevamente más tarde.</p>`;
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
      carrito.push({ nombre, img, precio, cantidad });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));

    e.target.textContent = "Agregado";
    e.target.disabled = true;
    setTimeout(() => {
      e.target.textContent = "Comprar";
      e.target.disabled = false;
    }, 1500);

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

// === INICIALIZAR BADGE DEL CARRITO AL CARGAR ===
actualizarNotificacionCarrito();
// ANIMACIÓN FADE RÁPIDA EN EL BODY
requestAnimationFrame(() => {
  document.body.classList.add("fade-in");
});

// === ANIMACIÓN FADE EN MAIN ===
const main = document.querySelector("main");
if (main) {
  main.classList.add("fade-in");
}

// === CARGA Y PAGINACIÓN DE PRODUCTOS ===
const productosGrid = document.getElementById("productosGrid");
const pagina1Btn = document.getElementById("pagina1");
const pagina2Btn = document.getElementById("pagina2");

if (productosGrid) {
  let productosData = [];

  function cargarProductos(pagina) {
    productosGrid.innerHTML = "";
    const inicio = pagina === 1 ? 0 : 9;
    const fin = pagina === 1 ? 9 : 12;
    const productosMostrar = productosData.slice(inicio, fin);

    productosMostrar.forEach((producto) => {
      const card = document.createElement("div");
      card.classList.add("col-md-4");

      card.innerHTML = `
          <div class="card h-100">
            <img src="${producto.img}" class="card-img-top" alt="${producto.nombre}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text">${producto.desc}</p>
              <a href="#" class="btn btn-primary mt-auto">Comprar</a>
            </div>
          </div>
        `;

      productosGrid.appendChild(card);
    });
  }

  fetch("../src/data/productos.json")
    .then((response) => response.json())
    .then((data) => {
      productosData = data;
      cargarProductos(1); // Mostrar los primeros 9 productos al cargar
    })
    .catch((error) => {
      console.error("Error al cargar productos:", error);
      productosGrid.innerHTML = `<p class="text-danger">No se pudieron cargar los productos. Inténtalo nuevamente más tarde.</p>`;
    });

  if (pagina1Btn && pagina2Btn) {
    pagina1Btn.addEventListener("click", () => {
      cargarProductos(1);
      pagina1Btn.classList.add("active");
      pagina2Btn.classList.remove("active");
    });

    pagina2Btn.addEventListener("click", () => {
      cargarProductos(2);
      pagina2Btn.classList.add("active");
      pagina1Btn.classList.remove("active");
    });
  }
}
