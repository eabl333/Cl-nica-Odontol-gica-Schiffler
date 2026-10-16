/* ============================================================
   CONFIGURAÇÃO CENTRAL: edite aqui números e mensagens
   ============================================================ */
const CONFIG = {
  whatsapp: "5516997580120",          // WhatsApp para solicitações
  telefone: "+5516997375161",         // Telefone do Google Maps
  mensagemGeral:
    "Olá! Conheci o site da Clínica Odontológica Schiffler e gostaria de obter mais informações.",
};

const waLink = (texto) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

/* ---------- Links gerais de WhatsApp ---------- */
document.querySelectorAll('[data-wa="geral"]').forEach((el) => {
  el.href = waLink(CONFIG.mensagemGeral);
  el.target = "_blank";
  el.rel = "noopener";
});

/* ---------- Ano no rodapé ---------- */
document.getElementById("ano").textContent = new Date().getFullYear();

/* ---------- Imagens de fundo (com fallback em degradê) ---------- */
document.querySelectorAll("[data-img]").forEach((el) => {
  const src = el.dataset.img;
  const img = new Image();
  img.onload = () => (el.style.backgroundImage = `url("${src}")`);
  img.src = src; // se não existir, mantém o degradê
});

/* ---------- Menu mobile ---------- */
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const fecharMenu = () => {
  nav.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Abrir menu");
};
menuBtn.addEventListener("click", () => {
  const aberto = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(aberto));
  menuBtn.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
});
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", fecharMenu));
document.addEventListener("keydown", (e) => e.key === "Escape" && fecharMenu());

/* ---------- Animações de entrada ---------- */
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ---------- Botões "Tenho interesse" ---------- */
const selectTrat = document.getElementById("tratamento");
document.querySelectorAll("[data-treat]").forEach((btn) => {
  btn.addEventListener("click", () => {
    selectTrat.value = btn.dataset.treat;
    clearError(selectTrat);
    document.getElementById("consulta").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.getElementById("nome").focus({ preventScroll: true }), 700);
  });
});

/* ---------- Formulário → WhatsApp ---------- */
const form = document.getElementById("formConsulta");
const nome = document.getElementById("nome");

function setError(input, msg) {
  const field = input.closest(".field");
  field.classList.add("invalid");
  field.querySelector(".error").textContent = msg;
  input.setAttribute("aria-invalid", "true");
}
function clearError(input) {
  const field = input.closest(".field");
  field.classList.remove("invalid");
  const err = field.querySelector(".error");
  if (err) err.textContent = "";
  input.removeAttribute("aria-invalid");
}
[nome, selectTrat].forEach((i) => i.addEventListener("input", () => clearError(i)));

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const valorNome = nome.value.trim();
  const tratamento = selectTrat.value;
  const dia = document.getElementById("dia").value;
  const periodo = document.getElementById("periodo").value;

  let ok = true;
  if (valorNome.length < 2) {
    setError(nome, "Informe seu nome.");
    ok = false;
  }
  if (!tratamento) {
    setError(selectTrat, "Selecione um tratamento de interesse.");
    ok = false;
  }
  if (!ok) {
    (form.querySelector('[aria-invalid="true"]') || nome).focus();
    return;
  }

  const mensagem = `Olá, Dra.! Acessei o site da Clínica Odontológica Schiffler e gostaria de solicitar uma consulta.

Nome: ${valorNome}
Tratamento de interesse: ${tratamento}
Dia de preferência: ${dia}
Período de preferência: ${periodo}

Entendo que minhas preferências não representam um horário confirmado. Aguardo o contato para verificar a disponibilidade.

Obrigado(a)!`;

  // Nada é armazenado: os dados só montam a URL.
  window.open(waLink(mensagem), "_blank", "noopener");
});

/* ---------- Política de privacidade ---------- */
const dlg = document.getElementById("dlgPrivacidade");
document.getElementById("abrirPrivacidade").addEventListener("click", () => dlg.showModal());
document.getElementById("fecharPrivacidade").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", (e) => e.target === dlg && dlg.close());