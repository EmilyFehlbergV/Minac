
let compra = JSON.parse(localStorage.getItem("petshopCompra"));

let metodoPagamento = "cartao";
let tipoEntrega = "entrega";
let pixConfirmado = false;

const campoQuantidade = document.getElementById("quantidade");
const camposEndereco = document.getElementById("campos-endereco");
const dadosCartao = document.getElementById("dados-cartao");
const areaPix = document.getElementById("area-pix");

const botaoCartao = document.getElementById("opcao-cartao");
const botaoPix = document.getElementById("opcao-pix");

const camposCartao = [
    document.getElementById("numero-cartao"),
    document.getElementById("validade-cartao"),
    document.getElementById("nome-cartao"),
    document.getElementById("cvv-cartao")
];

const camposEnderecoLista = [
    document.getElementById("cep"),
    document.getElementById("rua"),
    document.getElementById("numero"),
    document.getElementById("bairro"),
    document.getElementById("cidade")
];

function formatarValor(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",");
}


function carregarCompra() {
    const listaProdutos = document.getElementById("lista-produtos");

    if (!compra || !compra.produtos || compra.produtos.length === 0) {
        listaProdutos.textContent = "Nenhum produto encontrado.";
        document.getElementById("comprar").disabled = true;
        document.getElementById("mensagem").textContent =
            "Volte ao carrinho e selecione seus produtos.";
        return;
    }

    listaProdutos.innerHTML = "";

    for (let i = 0; i < compra.produtos.length; i++) {
        let produto = compra.produtos[i];

        let item = document.createElement("div");
        item.className = "produto-compra";

        let imagem = document.createElement("img");
        imagem.className = "produto-imagem";
        imagem.src = produto.imagem;
        imagem.alt = produto.nome;

        let informacoes = document.createElement("div");
        informacoes.className = "produto-info";

        let nome = document.createElement("div");
        nome.className = "produto-nome";
        nome.textContent = produto.nome;

        let detalhes = document.createElement("div");
        detalhes.className = "produto-detalhes";
        detalhes.textContent =
            formatarValor(Number(produto.preco)) +
            " | Quantidade: " + produto.quantidade;

        informacoes.appendChild(nome);
        informacoes.appendChild(detalhes);

        item.appendChild(imagem);
        item.appendChild(informacoes);

        listaProdutos.appendChild(item);
    }

    atualizarValores();
}


function atualizarValores() {
    let subtotal = Number(compra.subtotal);
    let desconto = Number(compra.desconto);
    let frete = Number(compra.frete);

    let total = subtotal - desconto + frete;

    document.getElementById("valor-subtotal").textContent =
        formatarValor(subtotal);

    document.getElementById("valor-desconto").textContent =
        "Desconto: " + formatarValor(desconto);

    document.getElementById("valor-desconto").hidden = desconto <= 0;

    if (frete === 0) {
        document.getElementById("valor-frete").textContent =
            "Frete: GRÁTIS";
    } else {
        document.getElementById("valor-frete").textContent =
            "Frete: " + formatarValor(frete);
    }

    document.getElementById("valor-total").textContent =
        "Total: " + formatarValor(total);
}


function configurarEntrega() {
    let retirar = tipoEntrega === "retirada";

    camposEndereco.hidden = retirar;

    for (let i = 0; i < camposEnderecoLista.length; i++) {
        camposEnderecoLista[i].disabled = retirar;
        camposEnderecoLista[i].required = !retirar;

        if (retirar) {
            camposEnderecoLista[i].value = "";
        }
    }

    compra.retiradaNaLoja = retirar;

    if (retirar) {
        compra.frete = 0;
    } else {
        compra.frete = 20;
    }

    atualizarValores();
    localStorage.setItem("petshopCompra", JSON.stringify(compra));
}

document.querySelectorAll('input[name="tipo-entrega"]').forEach(function (opcao) {
    opcao.addEventListener("change", function () {
        tipoEntrega = this.value;
        configurarEntrega();
    });
});


function selecionarCartao() {
    metodoPagamento = "cartao";
    pixConfirmado = false;

    botaoCartao.classList.add("selecionado");
    botaoPix.classList.remove("selecionado");

    dadosCartao.hidden = false;
    areaPix.hidden = true;

    for (let i = 0; i < camposCartao.length; i++) {
        camposCartao[i].disabled = false;
        camposCartao[i].required = true;
    }

    document.getElementById("mensagem").textContent = "";
}

function selecionarPix() {
    metodoPagamento = "pix";
    pixConfirmado = false;

    botaoPix.classList.add("selecionado");
    botaoCartao.classList.remove("selecionado");

    dadosCartao.hidden = true;
    areaPix.hidden = false;

    for (let i = 0; i < camposCartao.length; i++) {
        camposCartao[i].disabled = true;
        camposCartao[i].required = false;
    }

    gerarQRCode();

    document.getElementById("mensagem").textContent = "";
}

botaoCartao.addEventListener("click", selecionarCartao);
botaoPix.addEventListener("click", selecionarPix);


function gerarQRCode() {
    const areaQR = document.getElementById("qrcode");

    areaQR.innerHTML = "";

    if (typeof QRCode === "undefined") {
        areaQR.textContent = "Não foi possível carregar o QR Code.";
        return;
    }

    let codigoPix = "PETSHOP-MINAC-PIX-SIMULADO-" + Date.now();

    window.codigoPixSimulado = codigoPix;

    new QRCode(areaQR, {
        text: codigoPix,
        width: 160,
        height: 160
    });
}


document.getElementById("copiar-pix").addEventListener("click", async function () {
    if (!window.codigoPixSimulado) {
        gerarQRCode();
    }

    try {
        await navigator.clipboard.writeText(window.codigoPixSimulado);

        document.getElementById("mensagem").textContent =
            "Código demonstrativo copiado!";
    } catch {
        document.getElementById("mensagem").textContent =
            "Não foi possível copiar o código.";
    }
});


document.getElementById("confirmar-pix").addEventListener("click", function () {
    if (metodoPagamento === "pix") {
        pixConfirmado = true;

        document.getElementById("mensagem").textContent =
            "Pix simulado! Agora clique em Comprar agora.";
    }
});



document.getElementById("comprar").addEventListener("click", function () {
    const nome = document.getElementById("nome");
    const telefone = document.getElementById("telefone");
    const mensagem = document.getElementById("mensagem");

    if (!compra || !compra.produtos || compra.produtos.length === 0) {
        mensagem.textContent = "Não encontramos sua compra.";
        return;
    }

    if (nome.value.trim() === "" || telefone.value.trim() === "") {
        mensagem.textContent = "Preencha seu nome e telefone.";
        return;
    }

    if (tipoEntrega === "entrega") {
        let enderecoIncompleto = false;

        for (let i = 0; i < camposEnderecoLista.length; i++) {
            if (camposEnderecoLista[i].value.trim() === "") {
                enderecoIncompleto = true;
            }
        }

        if (enderecoIncompleto) {
            mensagem.textContent = "Preencha todos os campos do endereço.";
            return;
        }
    }

    if (metodoPagamento === "cartao") {
        let cartaoIncompleto = false;

        for (let i = 0; i < camposCartao.length; i++) {
            if (camposCartao[i].value.trim() === "") {
                cartaoIncompleto = true;
            }
        }

        if (cartaoIncompleto) {
            mensagem.textContent = "Preencha todos os dados do cartão.";
            return;
        }

        mensagem.textContent =
            "Compra simulada com sucesso! Obrigado por comprar na PetShop Minac.";
    } else {
        if (!pixConfirmado) {
            mensagem.textContent =
                "Confira o QR Code e confirme a simulação do Pix.";
            return;
        }

        mensagem.textContent =
            "Compra simulada com sucesso! Obrigado por comprar na PetShop Minac.";
    }
});


function pegarSomenteNumeros(valor) {
    let resultado = "";

    for (let i = 0; i < valor.length; i++) {
        if (valor[i] >= "0" && valor[i] <= "9") {
            resultado += valor[i];
        }
    }

    return resultado;
}


document.getElementById("telefone").addEventListener("input", function () {
    let telefone = pegarSomenteNumeros(this.value);

    if (telefone.length > 11) {
        telefone = telefone.substring(0, 11);
    }

    if (telefone.length > 6) {
        if (telefone.length === 11) {
            telefone = "(" + telefone.substring(0, 2) + ") " +
                telefone.substring(2, 7) + "-" + telefone.substring(7);
        } else {
            telefone = "(" + telefone.substring(0, 2) + ") " +
                telefone.substring(2, 6) + "-" + telefone.substring(6);
        }
    } else if (telefone.length > 2) {
        telefone = "(" + telefone.substring(0, 2) + ") " +
            telefone.substring(2);
    }

    this.value = telefone;
});



document.getElementById("cep").addEventListener("input", function () {
    let cep = pegarSomenteNumeros(this.value);

    if (cep.length > 8) {
        cep = cep.substring(0, 8);
    }

    if (cep.length > 5) {
        cep = cep.substring(0, 5) + "-" + cep.substring(5);
    }

    this.value = cep;
});



document.getElementById("numero-cartao").addEventListener("input", function () {
    let numero = pegarSomenteNumeros(this.value);

    if (numero.length > 16) {
        numero = numero.substring(0, 16);
    }

    let resultado = "";

    for (let i = 0; i < numero.length; i++) {
        resultado += numero[i];

        if ((i + 1) % 4 === 0 && i !== numero.length - 1) {
            resultado += " ";
        }
    }

    this.value = resultado;
});



document.getElementById("validade-cartao").addEventListener("input", function () {
    let validade = pegarSomenteNumeros(this.value);

    if (validade.length > 4) {
        validade = validade.substring(0, 4);
    }

    if (validade.length > 2) {
        validade = validade.substring(0, 2) + "/" + validade.substring(2);
    }

    this.value = validade;
});



document.getElementById("cvv-cartao").addEventListener("input", function () {
    let cvv = pegarSomenteNumeros(this.value);

    if (cvv.length > 4) {
        cvv = cvv.substring(0, 4);
    }

    this.value = cvv;
});



if (compra && compra.produtos && compra.produtos.length > 0) {
    tipoEntrega = compra.retiradaNaLoja ? "retirada" : "entrega";

    document.querySelector('input[name="tipo-entrega"][value="' + tipoEntrega + '"]').checked = true;

    configurarEntrega();
    carregarCompra();
}

selecionarCartao();
