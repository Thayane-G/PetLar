// ================= MENU =================
let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');
let header = document.querySelector('.header-3');

menu?.addEventListener('click', () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
});

window.addEventListener('scroll', () => {
    menu?.classList.remove('fa-times');
    navbar?.classList.remove('active');

    if (header) {
        header.classList.toggle('active', window.scrollY > 250);
    }
});


// ================= SWIPER =================
new Swiper(".inicio-slider", {
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    loop: true,
});


// ================= HELPERS =================
function getFavoritos() {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
}

function salvarFavoritos(lista) {
    localStorage.setItem("favoritos", JSON.stringify(lista));
    atualizarContador();
}


// normalizador (EVITA BUG DE ACENTO/ESPAÇO)
function normalizar(texto) {
    return texto
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}


// ================= CONTADOR =================
function atualizarContador() {
    const contador = document.getElementById("contadorFavoritos");
    if (!contador) return;

    contador.textContent = getFavoritos().length;
}


// ================= TOGGLE FAVORITO =================
function toggleFavorito(nome, img, link) {

    if (!nome || !img || !link) return;

    const favoritos = getFavoritos();

    const index = favoritos.findIndex(f =>
        normalizar(f.nome) === normalizar(nome)
    );

    if (index !== -1) {
        favoritos.splice(index, 1);
    } else {
        favoritos.push({ nome, img, link });
    }

    salvarFavoritos(favoritos);
}


// ================= CARREGAR FAVORITOS =================
function carregarFavoritos() {

    const lista = document.getElementById("listaFavoritos");
    if (!lista) return;

    lista.innerHTML = "";

    const favoritos = getFavoritos();

    if (favoritos.length === 0) {
        lista.innerHTML = "<p style='font-size:1.5rem'>Nenhum favorito ainda 🐾</p>";
        return;
    }

    favoritos.forEach(f => {

        if (!f.nome || !f.img) return;

        const item = document.createElement("div");
        item.classList.add("item-favorito");

        item.innerHTML = `
            <img src="${f.img}" alt="${f.nome}">
            <span>${f.nome}</span>
        `;

        item.addEventListener("click", () => {
            window.location.href = f.link;
        });

        lista.appendChild(item);
    });
}


// ================= BOTÕES ADOTAR =================
document.querySelectorAll(".adotar-btn").forEach(btn => {

    btn.addEventListener("click", (e) => {
        e.preventDefault();

        const card = btn.closest(".box") || btn.closest(".banner");

        const nome = card?.querySelector("h3")?.textContent?.trim();
        const img = card?.querySelector("img")?.getAttribute("src");
        const link = btn.getAttribute("href");

        if (!nome || !img || !link) return;

        toggleFavorito(nome, img, link);

        document.body.style.opacity = "0";

        setTimeout(() => {
            window.location.href = link;
        }, 500);
    });
});


// ================= PAINEL FAVORITOS =================
const painel = document.getElementById("painelFavoritos");
const abrir = document.getElementById("openFavoritos");
const fechar = document.getElementById("fecharFavoritos");

abrir?.addEventListener("click", (e) => {
    e.preventDefault();
    painel?.classList.add("ativo");
    carregarFavoritos();
});

fechar?.addEventListener("click", () => {
    painel?.classList.remove("ativo");
});


// ================= INIT =================
atualizarContador();