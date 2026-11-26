
const produtos = [
  {
    id: 1,
    title: "Ração Premium Cães Adultos Frango e Arroz 15kg",
    price: 189.90,
    category: "Rações",
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    title: "Arranhador Torre para Gatos com Playground",
    price: 249.90,
    category: "Brinquedos",
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    title: "Coleira Peitoral Ergonômica Ajustável",
    price: 79.90,
    category: "Acessórios",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 4,
    title: "Shampoo Neutro para Cães e Gatos 500ml",
    price: 34.90,
    category: "Higiene",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 5,
    title: "Brinquedo Mordedor de Borracha Resistente",
    price: 29.90,
    category: "Brinquedos",
    image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 6,
    title: "Cama Nuvem Almofada Redonda Lavável G",
    price: 139.90,
    category: "Acessórios",
    image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 7,
    title: "Petisco Snacks Saudáveis para Gatos Sabores 50g",
    price: 12.50,
    category: "Petiscos",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 8,
    title: "Caixa de Transporte para Viagem Tamanho M",
    price: 119.90,
    category: "Acessórios",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9,
    title: "Comedouro Duplo de Inox com Suporte de Madeira",
    price: 95.00,
    category: "Acessórios",
    image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 10,
    title: "Areia Sanitária Silica Premium para Gatos 1,6kg",
    price: 54.90,
    category: "Higiene",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 11,
    title: "Antipulgas e Carrapatos Bravecto para Cães 10-20kg",
    price: 239.90,
    category: "Remédios",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 12,
    title: "Vermífugo Oral Drontal Plus para Cães 4 Comprimidos",
    price: 89.90,
    category: "Remédios",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 13,
    title: "Bolinha Interativa Dispensadora de Petiscos",
    price: 45.00,
    category: "Brinquedos",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 14,
    title: "Ossinho Natural de Cálcio para Cães 10 Unidades",
    price: 19.90,
    category: "Petiscos",
    image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 15,
    title: "Vitamina Suplemento Nutricional em Pasta para Gatos",
    price: 62.00,
    category: "Remédios",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60"
  }
];



const FRETE_FIXO = 20;

let categoriaSelecionada = "todos";
let carrinho = JSON.parse(localStorage.getItem("petshopCarrinho")) || [];

const $ = (seletor) => document.querySelector(seletor);

const produtosContainer = $("#produtos-container");
const destaqueContainer = $("#destaque-container");
const ofertasContainer = $("#ofertas-container");

const categoryGrid = $("#category-grid");
const categoryFilter = $("#category-filter");

const searchInput = $("#search");
const searchSuggestions = $("#search-suggestions");
const headerSearchForm = $(".search-box");

const sortFilter = $("#sort-filter");
const clearFiltersButton = $("#clear-filters");

const ofertasCount = $("#offers-count");



function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function escaparHTML(valor = "") {
  return String(valor).replace(/[&<>"']/g, caractere => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[caractere]);
}

function normalizarTexto(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function criarCardProduto(produto, destaque = false) {
  return `
    <article class="product-card ${destaque ? "featured-card" : ""}">

      <div class="product-image">
        <img
          src="${escaparHTML(produto.image)}"
          alt="${escaparHTML(produto.title)}"
          loading="lazy"
          onerror="this.classList.add('image-unavailable'); this.alt='Imagem indisponível';"
        >
      </div>

      <span class="product-category">
        ${escaparHTML(produto.category)}
      </span>

      <h3>${escaparHTML(produto.title)}</h3>

      <strong class="product-price">
        ${formatarPreco(produto.price)}
      </strong>

      <button
        class="product-action"
        type="button"
        data-product-id="${produto.id}"
      >
        Comprar
      </button>

    </article>
  `;
}




function renderizarDestaques() {
  if (!destaqueContainer) return;

  const destaques = produtos.slice(0, 4);

  destaqueContainer.innerHTML = destaques.length
    ? destaques.map(produto => criarCardProduto(produto, true)).join("")
    : '<p class="products-message">Nenhum destaque disponível.</p>';
}



function renderizarOfertas() {
  if (!ofertasContainer) return;

  const idsSelecionados = [1, 4, 5, 7];

  const produtosSelecionados = produtos.filter(produto =>
    idsSelecionados.includes(produto.id)
  );

  ofertasContainer.innerHTML = produtosSelecionados.length
    ? produtosSelecionados.map(produto => criarCardProduto(produto)).join("")
    : '<p class="products-message">Nenhum produto disponível no momento.</p>';

  if (ofertasCount) {
    ofertasCount.textContent =
      `${produtosSelecionados.length} produtos selecionados`;
  }
}




function renderizarCategorias() {
  if (!categoryGrid) return;

  const categorias = [
    ...new Set(produtos.map(produto => produto.category))
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));

  const emojisCategorias = {
    "Acessórios": "🦴",
    "Brinquedos": "🎾",
    "Higiene": "🧴",
    "Petiscos": "🍖",
    "Rações": "🥣",
    "Remédios": "💊"
  };

  const botoes = [
    `
      <button
        type="button"
        class="category-card blue is-selected"
        data-category="todos"
        aria-pressed="true"
      >
        <span class="category-art">🐾</span>
        <span>Todos</span>
      </button>
    `,

    ...categorias.map((categoria, indice) => `
      <button
        type="button"
        class="category-card ${indice % 2 ? "yellow" : "blue"}"
        data-category="${escaparHTML(categoria)}"
        aria-pressed="false"
      >
        <span class="category-art">
          ${emojisCategorias[categoria] || "🐾"}
        </span>

        <span>${escaparHTML(categoria)}</span>
      </button>
    `)
  ];

  categoryGrid.innerHTML = botoes.join("");

  const count = $("#category-count");

  if (count) {
    count.textContent = `${categorias.length} categorias`;
  }
}




function obterProdutosFiltrados() {
  const termo = normalizarTexto(searchInput?.value || "");

  let resultado = produtos.filter(produto => {
    const correspondeCategoria =
      categoriaSelecionada === "todos" ||
      produto.category === categoriaSelecionada;

    const correspondeBusca =
      !termo ||
      normalizarTexto(produto.title).includes(termo) ||
      normalizarTexto(produto.category).includes(termo);

    return correspondeCategoria && correspondeBusca;
  });

  switch (sortFilter?.value) {
    case "price-asc":
      resultado.sort((a, b) => a.price - b.price);
      break;

    case "price-desc":
      resultado.sort((a, b) => b.price - a.price);
      break;

    case "name-asc":
      resultado.sort((a, b) =>
        a.title.localeCompare(b.title, "pt-BR")
      );
      break;
  }

  return resultado;
}


function renderizarCatalogo() {
  if (!produtosContainer) return;

  const filtrados = obterProdutosFiltrados();

  produtosContainer.innerHTML = filtrados.length
    ? filtrados.map(produto => criarCardProduto(produto)).join("")
    : '<p class="products-message">Nenhum produto encontrado. Tente alterar os filtros.</p>';

  const count = $("#catalog-count");

  if (count) {
    count.textContent =
      `${filtrados.length} de ${produtos.length} produtos`;
  }
}


function selecionarCategoria(categoria) {
  categoriaSelecionada = categoria;

  if (categoryFilter) {
    categoryFilter.value = categoria;
  }

  categoryGrid?.querySelectorAll("[data-category]").forEach(botao => {
    const ativo = botao.dataset.category === categoria;

    botao.classList.toggle("is-selected", ativo);
    botao.setAttribute("aria-pressed", String(ativo));
  });

  renderizarCatalogo();
}



categoryGrid?.addEventListener("click", evento => {
  const botao = evento.target.closest("[data-category]");

  if (botao) {
    selecionarCategoria(botao.dataset.category);
  }
});


categoryFilter?.addEventListener("change", evento => {
  selecionarCategoria(evento.target.value);
});


sortFilter?.addEventListener("change", renderizarCatalogo);


clearFiltersButton?.addEventListener("click", () => {
  if (searchInput) searchInput.value = "";
  if (sortFilter) sortFilter.value = "default";

  if (searchSuggestions) {
    searchSuggestions.innerHTML = "";
    searchSuggestions.hidden = true;
  }

  selecionarCategoria("todos");
});




function renderizarSugestoes() {
  if (!searchSuggestions || !searchInput) return;

  const termo = normalizarTexto(searchInput.value);

  if (!termo) {
    searchSuggestions.innerHTML = "";
    searchSuggestions.hidden = true;
    return;
  }

  const resultados = produtos.filter(produto => {
    const nome = normalizarTexto(produto.title);
    const categoria = normalizarTexto(produto.category);

    return nome.includes(termo) || categoria.includes(termo);
  }).slice(0, 8);

  if (!resultados.length) {
    searchSuggestions.innerHTML = `
      <div class="suggestion-empty">
        Nenhum produto encontrado.
      </div>
    `;

    searchSuggestions.hidden = false;
    return;
  }

  searchSuggestions.innerHTML = resultados.map(produto => `
    <button
      type="button"
      class="suggestion-item"
      data-suggestion-id="${produto.id}"
    >
      <img
        src="${escaparHTML(produto.image)}"
        alt=""
        loading="lazy"
      >

      <span class="suggestion-info">
        <strong>${escaparHTML(produto.title)}</strong>
        <span>${formatarPreco(produto.price)}</span>
      </span>
    </button>
  `).join("");

  searchSuggestions.hidden = false;
}


searchInput?.addEventListener("input", () => {
  renderizarSugestoes();
  renderizarCatalogo();
});


headerSearchForm?.addEventListener("submit", evento => {
  evento.preventDefault();

  executarPesquisaCabecalho();

  if (searchSuggestions) {
    searchSuggestions.hidden = true;
  }
});


function executarPesquisaCabecalho() {
  if (!searchInput) return;

  selecionarCategoria("todos");

  $("#todos-produtos")?.scrollIntoView({
    behavior: "smooth"
  });
}


searchSuggestions?.addEventListener("click", evento => {
  const botao = evento.target.closest("[data-suggestion-id]");

  if (!botao) return;

  const produto = produtos.find(item =>
    item.id === Number(botao.dataset.suggestionId)
  );

  if (!produto) return;

  if (searchInput) {
    searchInput.value = produto.title;
  }

  searchSuggestions.hidden = true;

  selecionarCategoria("todos");

  $("#todos-produtos")?.scrollIntoView({
    behavior: "smooth"
  });
});


document.addEventListener("click", evento => {
  if (
    !headerSearchForm?.contains(evento.target) &&
    searchSuggestions
  ) {
    searchSuggestions.hidden = true;
  }
});




const cartItemsContainer = $("#cart-items");
const cartSubtotal = $("#cart-subtotal");
const cartShipping = $("#cart-shipping");
const cartGrandTotal = $("#cart-grand-total");

const clearCartButton = $("#clear-cart");
const checkoutButton = $("#checkout-button");


function renderizarCarrinho() {
  const quantidadeTotal = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  const subtotal = carrinho.reduce(
    (total, item) => total + item.price * item.quantidade,
    0
  );

  const frete = carrinho.length ? FRETE_FIXO : 0;
  const totalCompra = subtotal + frete;

  document.querySelectorAll(".cart-count").forEach(contador => {
    contador.textContent = quantidadeTotal;
  });

  if (!cartItemsContainer) return;

  if (!carrinho.length) {
    cartItemsContainer.innerHTML = `
      <p class="cart-empty">Seu carrinho está vazio.</p>
    `;
  } else {
    cartItemsContainer.innerHTML = carrinho.map(item => `
      <div class="cart-item">

        <div class="mini-product">
          <img
            src="${escaparHTML(item.image)}"
            alt=""
          >
        </div>

        <div class="cart-item-info">
          <strong>${escaparHTML(item.title)}</strong>

          <small>${escaparHTML(item.category)}</small>

          <div class="quantity">

            <button
              type="button"
              data-cart-action="decrease"
              data-product-id="${item.id}"
              aria-label="Diminuir quantidade"
            >−</button>

            <b>${item.quantidade}</b>

            <button
              type="button"
              data-cart-action="increase"
              data-product-id="${item.id}"
              aria-label="Aumentar quantidade"
            >+</button>

          </div>

          <button
            type="button"
            class="remove-cart-item"
            data-cart-action="remove"
            data-product-id="${item.id}"
          >
            Remover
          </button>
        </div>

        <strong class="item-price">
          ${formatarPreco(item.price * item.quantidade)}
        </strong>

      </div>
    `).join("");
  }

  if (cartSubtotal) {
    cartSubtotal.textContent = formatarPreco(subtotal);
  }

  if (cartShipping) {
    cartShipping.textContent = formatarPreco(frete);
  }

  if (cartGrandTotal) {
    cartGrandTotal.textContent = formatarPreco(totalCompra);
  }
}

function adicionarAoCarrinho(id) {
    const produto = produtos.find(item => item.id === id);

    if (!produto) return;

    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            id: produto.id,
            title: produto.title,
            price: produto.price,
            category: produto.category,
            image: produto.image,
            quantidade: 1
        });
    }

    localStorage.setItem("petshopCarrinho", JSON.stringify(carrinho));

    window.location.href = "carrinho.html";
}
function alterarCarrinho(id, acao) {
    const item = carrinho.find(produto => produto.id === id);

    if (!item) return;

    if (acao === "increase") {
        item.quantidade++;
    }

    if (acao === "decrease") {
        item.quantidade--;

        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(produto => produto.id !== id);
        }
    }

    if (acao === "remove") {
        carrinho = carrinho.filter(produto => produto.id !== id);
    }

    localStorage.setItem("petshopCarrinho", JSON.stringify(carrinho));

    renderizarCarrinho();
}


document.addEventListener("click", evento => {
  const botaoProduto = evento.target.closest(".product-action");

  if (botaoProduto) {
    adicionarAoCarrinho(Number(botaoProduto.dataset.productId));
    return;
  }

  const botaoCarrinho = evento.target.closest("[data-cart-action]");

  if (botaoCarrinho) {
    alterarCarrinho(
      Number(botaoCarrinho.dataset.productId),
      botaoCarrinho.dataset.cartAction
    );
  }
});


clearCartButton?.addEventListener("click", () => {
  carrinho = [];
  renderizarCarrinho();
});


checkoutButton?.addEventListener("click", () => {
  if (!carrinho.length) {
    alert("Seu carrinho está vazio!");
    return;
  }

  alert(
    "Seu pedido está organizado!\n\n" +
    "Subtotal: " + formatarPreco(
      carrinho.reduce((total, item) =>
        total + item.price * item.quantidade, 0
      )
    ) + "\n" +
    "Frete: " + formatarPreco(FRETE_FIXO) + "\n" +
    "Total: " + formatarPreco(
      carrinho.reduce((total, item) =>
        total + item.price * item.quantidade, 0
      ) + FRETE_FIXO
    ) +
    "\n\nA etapa de pagamento ainda será implementada."
  );
});



const menuNavegacao = $(".main-nav");
const linksMenu = document.querySelectorAll(".main-nav .nav-link");
const indicadorMenu = $(".nav-indicator");


function moverIndicador(link) {
  if (!link || !menuNavegacao || !indicadorMenu) return;

  indicadorMenu.style.width = `${link.offsetWidth}px`;
  indicadorMenu.style.height = `${link.offsetHeight}px`;

  indicadorMenu.style.transform =
    `translate(${link.offsetLeft}px, ${link.offsetTop}px)`;

  indicadorMenu.style.opacity = "1";
}


function marcarLinkAtivo(linkSelecionado) {
  if (!linkSelecionado) return;

  linksMenu.forEach(link => {
    const ativo = link === linkSelecionado;

    link.classList.toggle("active", ativo);

    if (ativo) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  moverIndicador(linkSelecionado);
}


function obterEndereco(link) {
  try {
    return new URL(link.getAttribute("href"), window.location.href);
  } catch {
    return null;
  }
}


function mesmaPagina(url) {
  if (!url) return false;

  const caminhoAtual = window.location.pathname.replace(/\/$/, "/index.html");
  const caminhoDestino = url.pathname.replace(/\/$/, "/index.html");

  return caminhoAtual === caminhoDestino;
}


function encontrarLinkPaginaAtual() {
  return [...linksMenu].find(link => {
    const destino = obterEndereco(link);

    return destino &&
      mesmaPagina(destino) &&
      !destino.hash;
  });
}


function atualizarMenuPelaRolagem() {
  if (!linksMenu.length) return;

  const linkPaginaAtual = encontrarLinkPaginaAtual();

  if (linkPaginaAtual) {
    marcarLinkAtivo(linkPaginaAtual);
    return;
  }

  let linkAtivo = null;

  linksMenu.forEach(link => {
    const destino = obterEndereco(link);

    if (!destino || !mesmaPagina(destino) || !destino.hash) return;

    const elemento = document.querySelector(destino.hash);

    if (
      elemento &&
      elemento.getBoundingClientRect().top <= 140
    ) {
      linkAtivo = link;
    }
  });
  if (window.scrollY < 100) {
    linkAtivo = [...linksMenu].find(link => {
      const destino = obterEndereco(link);
      return destino && destino.hash === "#inicio";
    });
  }

  const chegouAoFinal =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 5;

  if (chegouAoFinal) {
    const contato = [...linksMenu].find(link => {
      const destino = obterEndereco(link);
      return destino && destino.hash === "#contato";
    });

    if (contato) linkAtivo = contato;
  }

  if (linkAtivo) {
    marcarLinkAtivo(linkAtivo);
  }
}


linksMenu.forEach(link => {
  link.addEventListener("click", () => {
    marcarLinkAtivo(link);
  });
});


window.addEventListener("scroll", atualizarMenuPelaRolagem, {
  passive: true
});

window.addEventListener("resize", atualizarMenuPelaRolagem);

window.addEventListener("hashchange", atualizarMenuPelaRolagem);


menuNavegacao?.addEventListener("scroll", () => {
  const linkAtivo = $(".main-nav .nav-link.active");
  moverIndicador(linkAtivo);
}, { passive: true });




function inicializarLoja() {
  renderizarCategorias();
  renderizarDestaques();
  renderizarCatalogo();
  renderizarOfertas();
  renderizarCarrinho();
  atualizarMenuPelaRolagem();

  requestAnimationFrame(() => {
    atualizarMenuPelaRolagem();
  });
}


if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarLoja);
} else {
  inicializarLoja();
}
