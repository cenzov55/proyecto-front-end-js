let carrito = [];
let total = 0;

const elementoCarrito = document.querySelector("#contenido_carrito");

//DEVUELVE POSICION EN EL CARRITO | -1 SI NO EXISTE
function existeEnCarrito(id) {
  for (let index = 0; index < carrito.length; index++) {
    if (carrito[index].id == id) return index;
  }
  return -1;
}

async function agregarCarrito(e) {
  const id = e.target.dataset.id;
  const producto = await getProducto(id);

  const posicion = existeEnCarrito(producto.id);

  //si no existe en carrito
  if (posicion == -1) {
    producto.cantidad = 1;
    carrito.push(producto);
  } else {
    carrito[posicion].cantidad++;
  }
  total += producto.precio;

  actualizarCarritoHtml();
}

function actualizarCarritoHtml() {
    elementoCarrito.innerHTML = "";
    let p_total = document.createElement("p");
    p_total.innerHTML = `TOTAL A PAGAR: $${total}`;
    carrito.forEach((producto) => {
        // Botón quitar
        let btn_quitar = document.createElement("button");
        btn_quitar.innerHTML = "-";
        btn_quitar.classList.add("btn-quitar");
        btn_quitar.addEventListener("click", quitarDeCarrito);
        btn_quitar.dataset.id = producto.id;

        // Botón agregar
        let btn_agregar = document.createElement("button");
        btn_agregar.innerHTML = "+";
        btn_agregar.classList.add("btn-agregar-chico");
        btn_agregar.addEventListener("click", agregarCarrito);
        btn_agregar.dataset.id = producto.id;

        let parrafo = document.createElement("p");
        parrafo.innerHTML = `${producto.nombre} x${producto.cantidad} = ${
            producto.cantidad * producto.precio
        } `;
        parrafo.append(btn_quitar, btn_agregar);
        elementoCarrito.appendChild(parrafo);
    });
    elementoCarrito.appendChild(p_total);
}

async function quitarDeCarrito(e) {
  const id = e.target.dataset.id;
  const producto = await getProducto(id);

  const posicion = existeEnCarrito(producto.id);
  const cantidadActual = carrito[posicion].cantidad;
  //si no existe en carrito
  if (cantidadActual == 1) {
    carrito.splice(posicion, 1);
    total -= producto.precio;
  } else {
    carrito[posicion].cantidad--;
    total -= producto.precio;
  }

  actualizarCarritoHtml();
}

async function getProductos() {
  const response = await fetch("datos/productos.json");
  return await response.json();
}

async function getProducto(id) {
  const productos = await getProductos();
  return productos.find((producto) => producto.id == id);
}

async function mostrarProductos() {
  const productos = await getProductos();
  const contenedor = document.getElementById("productos");
  const template = document.getElementById("producto-template");

  productos.forEach((producto) => {
    const clon = template.content.cloneNode(true);

    const img = clon.querySelector("img");
    const titulo = clon.querySelector(".titulo");
    const descripcion = clon.querySelector(".descripcion");
    const estrellasDiv = clon.querySelector(".estrellas");
    const btn = clon.querySelector(".btn-agregar");
    const precio = clon.querySelector(".precio");

    img.src += producto.id + ".jpg";
    img.alt = producto.nombre;
    titulo.textContent = producto.nombre;
    descripcion.textContent = producto.descripcion;
    btn.dataset.id = producto.id;
    btn.addEventListener("click", agregarCarrito);
    precio.innerHTML += producto.precio;
    ///estrellas
    estrellasDiv.innerHTML = "";
    for (let i = 0; i < producto.estrellas; i++) {
      const estrella = document.createElement("i");
      estrella.className = "fa-solid fa-star";
      estrellasDiv.appendChild(estrella);
    }

    contenedor.appendChild(clon);
  });
}

mostrarProductos();
