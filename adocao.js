const params = new URLSearchParams(window.location.search);

const nomePet = decodeURIComponent(params.get("pet") || "");
const imagemPet = decodeURIComponent(params.get("img") || "");

const imgEl = document.getElementById("imagemPet");
const nomeEl = document.getElementById("nomePet");
const btnFavorito = document.getElementById("favoritoPet");
const toast = document.getElementById("toast-favorito");
const form = document.getElementById("formAdocao");

// ================= EXIBE PET =================
if (nomeEl) {
    nomeEl.textContent = nomePet ? `🐾 Você está adotando: ${nomePet}` : "";
}

if (imgEl && imagemPet) {
    imgEl.src = imagemPet;
}

// ================= LOCALSTORAGE =================
function getFavoritos() {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
}

function salvarFavoritos(lista) {
    localStorage.setItem("favoritos", JSON.stringify(lista));
}

// ID ÚNICO (resolve 100% duplicidade e bug do coração vermelho)
const petId = `${nomePet}|${imagemPet}`;

// ================= SINCRONIZA CORAÇÃO =================
function sincronizarCoracao() {
    if (!btnFavorito) return;

    const favoritos = getFavoritos();

    const existe = favoritos.some(f => f.id === petId);

    btnFavorito.classList.toggle("ativo", existe);
}

// ================= TOGGLE FAVORITO =================
function alternarFavorito() {
    let favoritos = getFavoritos();

    const index = favoritos.findIndex(f => f.id === petId);

    if (index !== -1) {
        favoritos.splice(index, 1);
    } else {
        favoritos.push({
            id: petId,
            nome: nomePet,
            img: imagemPet,
            link: window.location.href
        });

        // toast
        if (toast) {
            toast.classList.add("mostrar");
            setTimeout(() => toast.classList.remove("mostrar"), 2000);
        }
    }

    salvarFavoritos(favoritos);
    sincronizarCoracao();
}

// ================= EVENTO =================
if (btnFavorito) {
    btnFavorito.addEventListener("click", alternarFavorito);
    sincronizarCoracao(); // estado correto ao entrar
}

// ================= FORM =================
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value;

        alert(
            `Obrigado, ${nome}! 🐾 Sua solicitação para adotar ${nomePet} foi enviada com sucesso.`
        );

        document.body.style.opacity = "0";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 700);
    });
}