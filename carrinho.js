document.addEventListener("DOMContentLoaded", function () {

    const CHAVE_CARRINHO = "petshopCarrinho";
    const CHAVE_COMPRA = "petshopCompra";

    const cart = document.querySelector(".cart-section");
    const totalElement = document.querySelector(".total span");
    const selectAll = document.querySelector("#select-all");
    const pickupStore = document.querySelector("#pickup-store");

    const couponEntry = document.querySelector(".coupon-entry");
    const couponInput = document.querySelector("#coupon-input");
    const applyCouponButton = document.querySelector("#apply-coupon");
    const couponMessage = document.querySelector("#coupon-message");

    let couponApplied = false;

    function getCartStorage() {
        try {
            return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];
        } catch (error) {
            return [];
        }
    }

    function saveCartStorage(produtos) {
        localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(produtos));
    }

    function getPrice(product) {
        const priceElement = product.querySelector(".price");

        if (!priceElement) return 0;

        return Number(
            priceElement.textContent
                .replace("R$", "")
                .trim()
                .replace(/\./g, "")
                .replace(",", ".")
        ) || 0;
    }

    function getProductsFromPage() {

        const produtos = [];

        document.querySelectorAll(".product-card").forEach(product => {

            const titulo = product.querySelector("h2");
            const imagem = product.querySelector(".product-image");
            const quantidade = product.querySelector(".quantity input");

            if (!titulo) return;

            produtos.push({
                nome: titulo.textContent.trim(),
                preco: getPrice(product),
                imagem: imagem ? imagem.getAttribute("src") : "",
                quantidade: Math.max(
                    1,
                    Number(quantidade ? quantidade.value : 1) || 1
                )
            });
        });

        return produtos;
    }

    function saveProducts() {
        saveCartStorage(getProductsFromPage());
    }

    function createProduct(productData) {

        const novoProduto = document.createElement("article");

        novoProduto.className = "product-card";

        novoProduto.innerHTML = `
            <img class="product-image" alt="">

            <div class="product-info">
                <h2></h2>
                <p class="price"></p>
            </div>

            <div class="product-actions">

                <input
                    type="checkbox"
                    class="product-select"
                    aria-label="Selecionar produto"
                >

                <div class="quantity">
                    <button type="button" class="minus" aria-label="Diminuir quantidade">-</button>
                    <input type="number" value="1" min="1">
                    <button type="button" class="plus" aria-label="Aumentar quantidade">+</button>
                </div>

                <button type="button" class="remove-product">Excluir</button>

            </div>
        `;

        const imagem = novoProduto.querySelector("img");

        imagem.src = productData.imagem || "";
        imagem.alt = productData.nome;

        novoProduto.querySelector("h2").textContent = productData.nome;

        novoProduto.querySelector(".price").textContent =
            "R$ " + Number(productData.preco).toFixed(2).replace(".", ",");

        novoProduto.querySelector(".quantity input").value =
            Math.max(1, Number(productData.quantidade) || 1);

        return novoProduto;
    }


    function createCouponLink() {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "coupon-link";

        button.innerHTML = `
            <span class="coupon-icon">%</span>
            Adicionar o código do cupom de loja
        `;

        return button;
    }

    function prepareProduct(product) {

        const actions = product.querySelector(".product-actions");

        if (!actions) return;

        const editButton = product.querySelector(".edit-product");

        if (editButton) {
            editButton.remove();
        }

        if (!product.querySelector(".product-select")) {

            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.className = "product-select";
            checkbox.setAttribute("aria-label", "Selecionar produto");

            actions.prepend(checkbox);
        }

        if (!product.querySelector(".remove-product")) {

            const button = document.createElement("button");

            button.type = "button";
            button.className = "remove-product";
            button.textContent = "Excluir";

            actions.appendChild(button);
        }
    }

    function loadCart() {

        if (!cart) return;

        const dadosSalvos = localStorage.getItem(CHAVE_CARRINHO);

        if (dadosSalvos === null) {

            document.querySelectorAll(".product-card").forEach(product => {
                prepareProduct(product);
            });

            saveProducts();
            return;
        }

        const produtosSalvos = getCartStorage();

        const produtosExistentes = [
            ...cart.querySelectorAll(".product-card")
        ];

        const fragment = document.createDocumentFragment();

        produtosSalvos.forEach(productData => {

            let produto = produtosExistentes.find(item => {

                const titulo = item.querySelector("h2");

                return titulo &&
                    titulo.textContent.trim().toLowerCase() ===
                    productData.nome.trim().toLowerCase();
            });

            let couponLink;

            if (produto) {

                const titulo = produto.querySelector("h2");
                const preco = produto.querySelector(".price");
                const imagem = produto.querySelector(".product-image");
                const quantidade = produto.querySelector(".quantity input");

                titulo.textContent = productData.nome;

                preco.textContent =
                    "R$ " + Number(productData.preco).toFixed(2).replace(".", ",");

                if (imagem) {
                    imagem.src = productData.imagem || "";
                    imagem.alt = productData.nome;
                }

                if (quantidade) {
                    quantidade.value = Math.max(
                        1,
                        Number(productData.quantidade) || 1
                    );
                }

                couponLink = produto.nextElementSibling;

                if (!couponLink || !couponLink.classList.contains("coupon-link")) {
                    couponLink = createCouponLink();
                }

                produtosExistentes.splice(
                    produtosExistentes.indexOf(produto),
                    1
                );

            } else {

                produto = createProduct(productData);
                couponLink = createCouponLink();
            }

            prepareProduct(produto);

            fragment.appendChild(produto);
            fragment.appendChild(couponLink);
        });

        cart.querySelectorAll(".product-card, .coupon-link").forEach(element => {
            element.remove();
        });

        const discountSection = cart.querySelector(".discount-section");

        if (discountSection) {
            cart.insertBefore(fragment, discountSection);
        } else {
            cart.appendChild(fragment);
        }
    }


    function updateTotal() {

        const produtosSelecionados = document.querySelectorAll(
            ".product-card .product-select:checked"
        );

        if (produtosSelecionados.length === 0) {

            couponApplied = false;

            if (couponInput) couponInput.value = "";
            if (couponMessage) couponMessage.textContent = "";
            if (couponEntry) couponEntry.hidden = true;
            if (pickupStore) pickupStore.checked = false;
        }

        let subtotal = 0;

        document.querySelectorAll(".product-card").forEach(product => {

            const checkbox = product.querySelector(".product-select");
            const quantityInput = product.querySelector(".quantity input");

            if (!checkbox || !quantityInput || !checkbox.checked) return;

            subtotal += getPrice(product) *
                Math.max(1, Number(quantityInput.value) || 1);
        });

        const discount = couponApplied ? subtotal * 0.10 : 0;
        const subtotalComDesconto = subtotal - discount;
        const frete = pickupStore && pickupStore.checked ? 0 : 20;

        const totalLabel = document.querySelector(".total strong");

        if (totalLabel) {
            totalLabel.textContent = "Subtotal:";
        }

        if (totalElement) {
            totalElement.textContent =
                "R$ " + subtotalComDesconto.toFixed(2).replace(".", ",");
        }

        let discountElement = document.querySelector(".discount-value");

        if (!discountElement) {

            discountElement = document.createElement("p");
            discountElement.className = "discount-value";

            const checkoutBottom = document.querySelector(".checkout-bottom");
            const total = document.querySelector(".total");

            if (checkoutBottom && total) {
                checkoutBottom.insertBefore(discountElement, total);
            }
        }

        if (discountElement) {
            discountElement.textContent =
                couponApplied && subtotal > 0
                    ? "Desconto: - R$ " + discount.toFixed(2).replace(".", ",")
                    : "";
        }

        let freightElement = document.querySelector(".freight-value");

        if (!freightElement) {

            freightElement = document.createElement("p");
            freightElement.className = "freight-value";

            const pickupOption = document.querySelector(".pickup-option");
            const checkoutBottom = document.querySelector(".checkout-bottom");

            if (pickupOption && checkoutBottom) {
                checkoutBottom.insertBefore(freightElement, pickupOption);
            } else if (checkoutBottom) {
                checkoutBottom.appendChild(freightElement);
            }
        }

        if (freightElement) {
            freightElement.textContent =
                frete === 0
                    ? "Frete: Grátis (retirada na loja)"
                    : "Frete: R$ 20,00";
        }
    }


    function updateSelectAll() {

        const checkboxes = document.querySelectorAll(".product-select");
        const selected = [...checkboxes].filter(item => item.checked);

        if (!selectAll) return;

        selectAll.checked =
            checkboxes.length > 0 &&
            selected.length === checkboxes.length;

        selectAll.indeterminate =
            selected.length > 0 &&
            selected.length < checkboxes.length;
    }


    loadCart();

    document.querySelectorAll(".product-select").forEach(checkbox => {
        checkbox.checked = false;
    });


    document.addEventListener("change", function (event) {

        if (event.target.classList.contains("product-select")) {

            updateSelectAll();
            updateTotal();
        }

        if (event.target.matches(".quantity input")) {

            event.target.value = Math.max(
                1,
                Number(event.target.value) || 1
            );

            saveProducts();
            updateTotal();
        }
    });


    document.addEventListener("click", function (event) {

        const product = event.target.closest(".product-card");

        if (!product) return;

        const quantityInput = product.querySelector(".quantity input");

        if (event.target.classList.contains("plus")) {

            if (!quantityInput) return;

            quantityInput.value = Number(quantityInput.value) + 1;

            saveProducts();
            updateTotal();
        }

        if (event.target.classList.contains("minus")) {

            if (!quantityInput) return;

            if (Number(quantityInput.value) > 1) {

                quantityInput.value = Number(quantityInput.value) - 1;

                saveProducts();
                updateTotal();
            }
        }

        if (event.target.classList.contains("remove-product")) {

            if (confirm("Deseja realmente excluir este produto?")) {

                const couponLink = product.nextElementSibling;

                product.remove();

                if (couponLink && couponLink.classList.contains("coupon-link")) {
                    couponLink.remove();
                }

                saveProducts();
                updateSelectAll();
                updateTotal();
            }
        }
    });


    window.adicionarAoCarrinho = function (nome, preco, imagem) {

        let produtos = getCartStorage();

        let produtoExistente = produtos.find(product =>
            product.nome.trim().toLowerCase() === nome.trim().toLowerCase()
        );

        if (produtoExistente) {

            produtoExistente.quantidade =
                Number(produtoExistente.quantidade || 1) + 1;

        } else {

            produtoExistente = {
                nome: nome,
                preco: Number(preco),
                imagem: imagem,
                quantidade: 1
            };

            produtos.push(produtoExistente);
        }

        saveCartStorage(produtos);

        if (cart) {

            const produtoNaTela = [
                ...document.querySelectorAll(".product-card")
            ].find(product => {

                const titulo = product.querySelector("h2");

                return titulo &&
                    titulo.textContent.trim().toLowerCase() ===
                    nome.trim().toLowerCase();
            });

            if (produtoNaTela) {

                const quantidade = produtoNaTela.querySelector(".quantity input");

                if (quantidade) {
                    quantidade.value = produtoExistente.quantidade;
                }

            } else {

                const novoProduto = createProduct(produtoExistente);
                const novoCupom = createCouponLink();

                prepareProduct(novoProduto);

                const discountSection = cart.querySelector(".discount-section");

                if (discountSection) {
                    cart.insertBefore(novoProduto, discountSection);
                    cart.insertBefore(novoCupom, discountSection);
                } else {
                    cart.appendChild(novoProduto);
                    cart.appendChild(novoCupom);
                }
            }

            updateSelectAll();
            updateTotal();

            alert(
                produtoExistente.quantidade > 1
                    ? "Quantidade do produto atualizada!"
                    : nome + " foi adicionado ao carrinho!"
            );
        }
    };


    if (selectAll) {

        selectAll.addEventListener("change", function () {

            document.querySelectorAll(".product-select").forEach(checkbox => {
                checkbox.checked = selectAll.checked;
            });

            selectAll.indeterminate = false;

            updateTotal();
        });
    }


    const editButton = document.querySelector(".edit-button");

    if (editButton) {

        editButton.addEventListener("click", function () {

            document.querySelectorAll(".product-actions").forEach(actions => {
                actions.classList.toggle("editing");
            });
        });
    }


    document.querySelectorAll(".coupon-link").forEach(button => {

        button.addEventListener("click", function () {

            if (couponEntry) {

                couponEntry.hidden = false;

                if (couponInput) {
                    couponInput.focus();
                }
            }
        });
    });


    function applyCoupon() {

        if (!couponInput || !couponMessage) return;

        const produtosSelecionados = document.querySelectorAll(
            ".product-card .product-select:checked"
        );

        if (produtosSelecionados.length === 0) {

            couponMessage.textContent =
                "Selecione pelo menos um produto antes de aplicar o cupom.";

            couponMessage.style.color = "red";
            return;
        }

        const coupon = couponInput.value.trim().toUpperCase();

        if (!coupon) {

            couponMessage.textContent = "Digite um código de cupom.";
            couponMessage.style.color = "red";

            return;
        }

        if (couponApplied) {

            couponMessage.textContent = "O cupom já foi aplicado.";
            couponMessage.style.color = "red";

            return;
        }

        if (coupon === "PET10") {

            couponApplied = true;

            couponMessage.textContent =
                "Cupom aplicado! Você ganhou 10% de desconto.";

            couponMessage.style.color = "green";

            updateTotal();

        } else {

            couponMessage.textContent = "Cupom inválido!";
            couponMessage.style.color = "red";
        }
    }

    if (applyCouponButton) {
        applyCouponButton.addEventListener("click", applyCoupon);
    }

    if (couponInput) {

        couponInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {
                applyCoupon();
            }
        });
    }


    if (pickupStore) {
        pickupStore.addEventListener("change", updateTotal);
    }


    const chatButton = document.querySelector(".chat-button");

    if (chatButton) {

        chatButton.addEventListener("click", function () {
            alert("Bem-vindo ao atendimento PetShop Minac!");
        });
    }


    const continueButton = document.querySelector(".continue-button");

    if (continueButton) {

        continueButton.addEventListener("click", function () {

            const selecionados = [];

            document.querySelectorAll(".product-card").forEach(product => {

                const checkbox = product.querySelector(".product-select");

                if (!checkbox || !checkbox.checked) return;

                const titulo = product.querySelector("h2");
                const imagem = product.querySelector(".product-image");
                const quantidade = product.querySelector(".quantity input");

                selecionados.push({
                    nome: titulo ? titulo.textContent.trim() : "",
                    preco: getPrice(product),
                    imagem: imagem ? imagem.getAttribute("src") : "",
                    quantidade: Math.max(
                        1,
                        Number(quantidade ? quantidade.value : 1) || 1
                    )
                });
            });

            if (selecionados.length === 0) {

                alert("Selecione pelo menos um produto para continuar!");
                return;
            }

            const subtotal = selecionados.reduce((total, product) => {
                return total + product.preco * product.quantidade;
            }, 0);

            const desconto = couponApplied ? subtotal * 0.10 : 0;
            const frete = pickupStore && pickupStore.checked ? 0 : 20;

            const compra = {
                produtos: selecionados,
                subtotal: subtotal,
                desconto: desconto,
                frete: frete,
                total: subtotal - desconto + frete,
                retiradaNaLoja: frete === 0,
                cupom: couponApplied ? "PET10" : null
            };

            localStorage.setItem(CHAVE_COMPRA, JSON.stringify(compra));

            window.location.href = "pagamento.html";
        });
    }


    if (selectAll) {
        selectAll.checked = false;
    }

    updateTotal();
    updateSelectAll();

});