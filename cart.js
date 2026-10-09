let cart = JSON.parse(localStorage.getItem('promaxpak_cart')) || [];
const NP_API_KEY = '7dbda2a14b42158ebef8066b2f396262'; // Ваш API-ключ Нової Пошти

function injectCartHTML() {
    if (document.getElementById('cartModal')) return; 

    const cartHTML = `
    <style>
        .cart-modal { position: fixed !important; z-index: 2000 !important; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); align-items: center; justify-content: center; }
        .cart-modal-content-large { background-color: #F8F9FA; color: #1F2937; width: 100%; max-width: 750px; border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); position: relative; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; }
        .checkout-top-bar { display: flex; justify-content: space-between; align-items: center; background-color: #FFFFFF; padding: 20px 25px; border-bottom: 1px solid #E5E7EB; }
        .checkout-top-bar h2 { font-size: 1.4rem; color: #111827; margin: 0; }
        .close-cart { background: none; border: none; font-size: 24px; cursor: pointer; color: #6B7280; padding: 0; }
        .close-cart:hover { color: #111827; }
        .checkout-scroll-body { padding: 25px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }

        .product-modal-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 20px; align-items: start; }
        .product-modal-img-box { background: #FFFFFF; padding: 15px; border-radius: 8px; border: 1px solid #E5E7EB; text-align: center; overflow: hidden; width: 100%; box-sizing: border-box; flex-shrink: 0; min-height: 250px; display: flex; align-items: center; justify-content: center; }
        
        /* Стилі для Нової Пошти */
        .autocomplete-wrapper { position: relative; width: 100%; }
        .autocomplete-list { position: absolute; top: 100%; left: 0; right: 0; background: #fff; border: 1px solid #E5E7EB; border-radius: 8px; max-height: 250px; overflow-y: auto; z-index: 1000; list-style: none; padding: 0; margin: 4px 0 0 0; box-shadow: 0 10px 25px rgba(0,0,0,0.15); display: none; }
        .autocomplete-list li { padding: 12px 15px; cursor: pointer; border-bottom: 1px solid #F3F4F6; font-size: 0.95rem; color: #374151; transition: background 0.2s; }
        .autocomplete-list li:hover { background-color: #F3F4F6; color: #3B71CA; }
        .autocomplete-list li:last-child { border-bottom: none; }
        
        select.np-select { width: 100%; padding: 14px 15px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 1rem; background-color: #FFFFFF; color: #1F2937; cursor: pointer; appearance: auto; }
        select.np-select:disabled { background-color: #F3F4F6; color: #9CA3AF; cursor: not-allowed; }

        @media (max-width: 768px) {
            .product-modal-grid { display: flex !important; flex-direction: column !important; gap: 15px !important; }
            .cart-modal-content-large { max-width: 100% !important; height: 100vh; max-height: 100vh; border-radius: 0 !important; }
            .checkout-scroll-body { padding: 15px; }
        }
    </style>

    <div class="cart-modal" id="cartModal" style="display: none;">
        <div class="cart-modal-content-large" style="max-width: 750px;">
            
            <div class="checkout-top-bar">
                <h2>Оформлення замовлення</h2>
                <button class="close-cart" onclick="closeCartModal()">&times;</button>
            </div>

            <div class="checkout-scroll-body">
                
                <!-- ЕТАП 1: Кошик -->
                <div id="cartStep1">
                    <div class="section-title-num">🛒 Ваш кошик замовлень</div>
                    <div class="cart-items-list" id="cartItemsList"></div>
                    
                    <div class="cart-footer-box">
                        <div class="cart-total">
                            <span>Разом до сплати:</span>
                            <span id="cartTotalPrice">0 ₴</span>
                        </div>
                        <div class="free-shipping-notice">
                            🎁 Доставка безкоштовна!
                        </div>
                        <div class="cart-actions-grid">
                            <button class="btn-continue-cart" onclick="closeCartModal()">Продовжити замовлення</button>
                            <button class="btn-checkout-primary" onclick="goToCheckout()">Перейти до оформлення</button>
                        </div>
                    </div>
                </div>

                <!-- ЕТАП 2: Форма оформлення -->
                <div id="cartStep2" style="display: none;">
                    
                    <div class="checkout-section-box">
                        <div class="step-title-row">
                            <span class="step-badge">1</span>
                            <h3>Контактні дані</h3>
                        </div>
                        <div class="checkout-grid-2">
                            <div class="form-group-pro">
                                <label>Телефон *</label>
                                <input type="tel" id="orderPhone" placeholder="+38 (0__) ___-__-__">
                            </div>
                            <div class="form-group-pro">
                                <label>Прізвище *</label>
                                <input type="text" id="orderLastName" placeholder="Введіть прізвище кирилицею">
                            </div>
                            <div class="form-group-pro">
                                <label>Ім'я *</label>
                                <input type="text" id="orderFirstName" placeholder="Введіть ім'я кирилицею">
                            </div>
                        </div>
                    </div>

                    <div class="checkout-section-box">
                        <div class="step-title-row">
                            <span class="step-badge">2</span>
                            <h3>Доставка *</h3>
                        </div>
                        
                        <label class="delivery-card-option">
                            <input type="radio" name="deliveryType" checked>
                            <div class="delivery-card-info">
                                <div class="delivery-card-header">
                                    <span class="delivery-name">🔴 Нова Пошта</span>
                                    <span class="badge-free">Безкоштовно</span>
                                </div>
                                <p class="delivery-desc">У відділення або поштомат по Україні</p>
                            </div>
                        </label>

                        <div class="checkout-grid-2" style="margin-top: 15px;">
                            <div class="form-group-pro autocomplete-wrapper">
                                <label>Населений пункт (Місто) *</label>
                                <input type="text" id="orderCity" placeholder="Почніть вводити назву міста..." autocomplete="off">
                                <ul id="citySearchResults" class="autocomplete-list"></ul>
                                <input type="hidden" id="orderCityRef">
                            </div>
                            <div class="form-group-pro">
                                <label>Відділення або поштомат *</label>
                                <select id="orderWarehouse" class="np-select" disabled>
                                    <option value="">Спочатку оберіть місто</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="checkout-section-box">
                        <div class="step-title-row">
                            <span class="step-badge">3</span>
                            <h3>Оплата *</h3>
                        </div>
                        
                        <div class="payment-options-grid">
                            <label class="payment-card">
                                <input type="radio" name="orderPayment" value="Післяплата" checked>
                                <div class="payment-card-content">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                                    <span>Післяплата</span>
                                </div>
                            </label>

                            <label class="payment-card">
                                <input type="radio" name="orderPayment" value="Оплата на рахунок">
                                <div class="payment-card-content">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    <span>Оплата на рахунок</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div class="checkout-section-box">
                        <div class="form-group-pro">
                            <label>Коментар до замовлення</label>
                            <textarea id="orderComment" placeholder="Додаткові побажання до замовлення..." rows="2"></textarea>
                        </div>
                    </div>

                    <div class="checkout-bottom-actions">
                        <button class="btn-back-cart" onclick="backToCart()">Назад до кошика</button>
                        <button class="btn-checkout-primary" onclick="submitOrder()">Підтвердити замовлення</button>
                    </div>

                </div>

            </div>
        </div>
    </div>
    
    <!-- Адаптивне модальне вікно продукту -->
    <div id="productModal" class="cart-modal" style="display: none;">
        <div class="cart-modal-content-large" style="max-width: 750px;">
            <div class="checkout-top-bar">
                <h2 id="modalProductTitle" style="font-size: 1.15rem; font-weight: 700;">Деталі товару</h2>
                <button class="close-cart" onclick="closeProductModal()">&times;</button>
            </div>
            <div class="checkout-scroll-body product-modal-grid">
                
                <div class="product-modal-img-box">
                    <img id="modalProductImg" src="" alt="" style="max-height: 250px; max-width: 100%; border-radius: 6px; object-fit: contain; transition: transform 0.4s ease; cursor: zoom-in; transform-origin: center center; user-select: none; -webkit-user-drag: none;" 
                         onmouseenter="this.style.transform='scale(1.6)'" 
                         onmouseleave="this.style.transform='scale(1)'">
                </div>
                
                <div>
                    <div style="color: #059669; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">✔ Готово до відправки</div>
                    <div id="modalProductSku" style="font-size: 0.85rem; color: #9CA3AF; margin-bottom: 10px;"></div>
                    <div id="modalProductDesc" style="font-size: 0.9rem; color: #4B5563; line-height: 1.5; margin-bottom: 15px;"></div>
                    <div id="modalProductSpecs" style="background: #FFFFFF; padding: 12px; border-radius: 8px; border: 1px solid #E5E7EB; margin-bottom: 15px; font-size: 0.9rem; color: #374151;"></div>
                    <div style="display: flex; justify-content: space-between; align-items: center; background: #FFFFFF; padding: 12px 15px; border-radius: 8px; border: 1px solid #E5E7EB;">
                        <div id="modalProductPrice" style="font-size: 1.2rem; font-weight: 700; color: #111827;"></div>
                        <button id="modalBuyBtn" class="btn-buy" style="padding: 10px 20px; font-size: 0.95rem; width: auto; background-color: #3B71CA; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Купити</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', cartHTML);
    initNovaPoshtaAPI(); // Запуск інтеграції Нової Пошти після рендеру
}

function saveCart() {
    localStorage.setItem('promaxpak_cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(name, pricePerItem, boxQty, sku = '') {
    let existingItem = cart.find(item => item.name === name || (item.sku === sku && sku !== ''));
    if (existingItem) {
        existingItem.boxes += 1;
    } else {
        cart.push({ name: name, pricePerItem: pricePerItem, boxQty: boxQty, boxes: 1, sku: sku });
    }
    saveCart();
    openCartModal();
}

function changeQuantity(index, delta) {
    cart[index].boxes += delta;
    if (cart[index].boxes <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
}

function updateCartUI() {
    let totalBoxes = cart.reduce((sum, item) => sum + item.boxes, 0);
    let badge = document.getElementById('cart-badge');
    if (badge) badge.innerText = totalBoxes;

    let listContainer = document.getElementById('cartItemsList');
    let totalPriceElem = document.getElementById('cartTotalPrice');
    
    if (!listContainer || !totalPriceElem) return; 

    if (cart.length === 0) {
        listContainer.innerHTML = '<div class="empty-cart-msg">Ваш кошик наразі порожній</div>';
        totalPriceElem.innerText = '0 ₴';
        return;
    }

    let html = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        let boxPrice = item.pricePerItem * item.boxQty;
        let itemTotal = boxPrice * item.boxes;
        let totalPieces = item.boxQty * item.boxes;
        totalPrice += itemTotal;

        let skuDisplay = item.sku ? `<span style="color: #6B7280; font-size: 0.85rem; margin-left: 8px;">(Код: ${item.sku})</span>` : '';

        html += `
            <div class="cart-item-row">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name} ${skuDisplay}</div>
                    <div class="cart-item-specs-sub">В ящику: ${item.boxQty} шт (всього: ${totalPieces} шт)</div>
                    <div class="cart-item-price">${boxPrice} ₴ за ящик × ${item.boxes} ящ. = <strong>${itemTotal} ₴</strong></div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                    <span style="font-weight:600; font-size:0.9rem;">${item.boxes} ящ.</span>
                    <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                    <button class="remove-btn" onclick="removeItem(${index})">Видалити</button>
                </div>
            </div>
        `;
    });

    listContainer.innerHTML = html;
    totalPriceElem.innerText = totalPrice + ' ₴';
}

function openCartModal() {
    let modal = document.getElementById('cartModal');
    if (modal) {
        backToCart();
        updateCartUI();
        modal.style.display = 'flex';
    }
}

function closeCartModal() {
    let modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function goToCheckout() {
    if (cart.length === 0) {
        alert('Ваш кошик порожній!');
        return;
    }
    document.getElementById('cartStep1').style.display = 'none';
    document.getElementById('cartStep2').style.display = 'block';
}

function backToCart() {
    document.getElementById('cartStep2').style.display = 'none';
    document.getElementById('cartStep1').style.display = 'block';
}

function submitOrder() {
    let phone = document.getElementById('orderPhone').value.trim();
    let lastName = document.getElementById('orderLastName').value.trim();
    let firstName = document.getElementById('orderFirstName').value.trim();
    let city = document.getElementById('orderCity').value.trim();
    
    // Отримуємо обране відділення
    let warehouseSelect = document.getElementById('orderWarehouse');
    let warehouseRef = warehouseSelect.value;
    let warehouseName = warehouseSelect.options[warehouseSelect.selectedIndex]?.text || '';
    
    let comment = document.getElementById('orderComment').value.trim();
    let payment = document.querySelector('input[name="orderPayment"]:checked').value;

    if (!phone || !lastName || !firstName || !city || !warehouseRef) {
        alert('Будь ласка, заповніть усі обов’язкові поля та оберіть відділення Нової Пошти!');
        return;
    }

    let orderDetailsList = cart.map(item => {
        let boxPrice = item.pricePerItem * item.boxQty;
        return `📦 ${item.name} (Код: ${item.sku || 'Немає'})\n    ${item.boxes} ящ. x ${boxPrice} ₴ = ${item.boxes * boxPrice} ₴`;
    }).join('\n');

    let totalPrice = cart.reduce((sum, item) => sum + (item.pricePerItem * item.boxQty * item.boxes), 0);
    let commentText = comment ? `\nКоментар: ${comment}` : '';

    // В майбутньому ми будемо відправляти "warehouseRef" в CRM (API SalesDrive)
    let finalMessage = `✅ НОВЕ ЗАМОВЛЕННЯ\n\n` +
                        `👤 Клієнт: ${lastName} ${firstName}\n` +
                        `📞 Телефон: ${phone}\n` +
                        `🚚 Доставка: ${city}, ${warehouseName}\n` +
                        `💳 Оплата: ${payment}${commentText}\n\n` +
                        `🛒 ТОВАРИ:\n${orderDetailsList}\n\n` +
                        `💰 ЗАГАЛЬНА СУМА: ${totalPrice} ₴`;

    alert(finalMessage);
    
    cart = [];
    saveCart();
    closeCartModal();
}

function openProductModalFromCard(element) {
    let title = element.getAttribute('data-title');
    let price = element.getAttribute('data-price');
    let boxQty = element.getAttribute('data-boxqty');
    let sku = element.getAttribute('data-sku');
    let img = element.getAttribute('data-img');
    let desc = element.getAttribute('data-desc');
    let advantagesStr = element.getAttribute('data-advantages');
    let specs = element.getAttribute('data-specs');

    let imgElem = document.getElementById('modalProductImg');
    imgElem.style.transform = 'scale(1)';
    imgElem.src = img;

    document.getElementById('modalProductTitle').innerText = title;
    document.getElementById('modalProductPrice').innerHTML = price + ' грн <span style="font-size:0.75rem; color:#6B7280;">/ шт</span>';
    document.getElementById('modalProductSku').innerHTML = 'Код: <b>' + sku + '</b>';

    let fullDescHtml = '<p style="margin-bottom: 10px;">' + desc + '</p>';
    if (advantagesStr) {
        fullDescHtml += '<div style="font-weight: 600; margin-bottom: 5px; color: #111827;">Переваги:</div><ul style="margin: 0; padding-left: 18px; color: #4B5563;">';
        advantagesStr.split('|').forEach(adv => {
            if(adv.trim() !== "") {
                fullDescHtml += '<li style="margin-bottom: 3px;">' + adv.trim() + '</li>';
            }
        });
        fullDescHtml += '</ul>';
    }
    document.getElementById('modalProductDesc').innerHTML = fullDescHtml;
    
    let specsHtml = '<div style="font-weight: 600; margin-bottom: 6px; color: #111827;">Характеристики:</div>';
    if (specs) {
        specs.split('|').forEach(sp => {
            if(sp.trim() !== "") {
                specsHtml += '<p style="margin-bottom: 4px;">• ' + sp.trim() + '</p>';
            }
        });
    }
    specsHtml += '<p style="margin-bottom: 0; margin-top: 4px;">📦 В ящику: <b>' + boxQty + ' шт</b></p>';
    document.getElementById('modalProductSpecs').innerHTML = specsHtml;

    let buyBtn = document.getElementById('modalBuyBtn');
    buyBtn.onclick = function() {
        addToCart(title, Number(price), Number(boxQty), sku);
        closeProductModal();
    };

    document.getElementById('productModal').style.display = 'flex';
}

function closeProductModal() {
    let modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

window.onclick = function(event) {
    let cartModal = document.getElementById('cartModal');
    let productModal = document.getElementById('productModal');
    
    if (event.target === cartModal) {
        closeCartModal();
    }
    if (event.target === productModal) {
        closeProductModal();
    }
}

// ==========================================
// ЛОГІКА ІНТЕГРАЦІЇ НОВОЇ ПОШТИ
// ==========================================
let npSearchTimeout = null;

function initNovaPoshtaAPI() {
    const cityInput = document.getElementById('orderCity');
    if (!cityInput) return;

    // Слухаємо ввід тексту в поле "Місто"
    cityInput.addEventListener('input', function() {
        clearTimeout(npSearchTimeout);
        const query = this.value.trim();
        const resultsList = document.getElementById('citySearchResults');
        
        if (query.length < 2) {
            resultsList.style.display = 'none';
            document.getElementById('orderWarehouse').disabled = true;
            document.getElementById('orderWarehouse').innerHTML = '<option value="">Спочатку оберіть місто</option>';
            return;
        }

        // Затримка перед відправкою запиту (щоб не спамити API при швидкому друку)
        npSearchTimeout = setTimeout(() => {
            fetchNovaPoshtaCities(query);
        }, 500);
    });

    // Ховаємо випадаючий список міст, якщо клікнули поза ним
    document.addEventListener('click', function(e) {
        if (e.target.id !== 'orderCity') {
            const resultsList = document.getElementById('citySearchResults');
            if (resultsList) resultsList.style.display = 'none';
        }
    });
}

// Запит міст до API Нової Пошти
async function fetchNovaPoshtaCities(query) {
    const url = 'https://api.novaposhta.ua/v2.0/json/';
    const body = {
        apiKey: NP_API_KEY,
        modelName: "Address",
        calledMethod: "searchSettlements",
        methodProperties: {
            CityName: query,
            Limit: "50"
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        
        if (data.success && data.data.length > 0 && data.data[0].Addresses.length > 0) {
            renderCityResults(data.data[0].Addresses);
        } else {
            document.getElementById('citySearchResults').style.display = 'none';
        }
    } catch (error) {
        console.error("Помилка завантаження міст НП:", error);
    }
}

// Відображення списку знайдених міст
function renderCityResults(addresses) {
    const list = document.getElementById('citySearchResults');
    list.innerHTML = '';
    
    addresses.forEach(address => {
        const li = document.createElement('li');
        li.textContent = address.Present; // Наприклад: "м. Київ, Київська обл."
        // При кліку зберігаємо Ref міста
        li.onclick = () => selectNovaPoshtaCity(address.DeliveryCity, address.Present);
        list.appendChild(li);
    });
    
    list.style.display = 'block';
}

// Дія при виборі міста
function selectNovaPoshtaCity(cityRef, presentName) {
    document.getElementById('orderCity').value = presentName;
    document.getElementById('orderCityRef').value = cityRef;
    document.getElementById('citySearchResults').style.display = 'none';
    
    // Одразу шукаємо відділення для цього міста
    fetchNovaPoshtaWarehouses(cityRef);
}

// Запит відділень до API Нової Пошти
async function fetchNovaPoshtaWarehouses(cityRef) {
    const warehouseSelect = document.getElementById('orderWarehouse');
    warehouseSelect.innerHTML = '<option value="">Завантаження відділень...</option>';
    warehouseSelect.disabled = true;

    const url = 'https://api.novaposhta.ua/v2.0/json/';
    const body = {
        apiKey: NP_API_KEY,
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: {
            CityRef: cityRef
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            warehouseSelect.innerHTML = '<option value="">Оберіть відділення або поштомат</option>';
            data.data.forEach(warehouse => {
                const option = document.createElement('option');
                option.value = warehouse.Ref; // Системний код для CRM
                option.textContent = warehouse.Description;
                warehouseSelect.appendChild(option);
            });
            warehouseSelect.disabled = false;
        } else {
            warehouseSelect.innerHTML = '<option value="">У цьому місті немає відділень</option>';
        }
    } catch (error) {
        console.error("Помилка завантаження відділень НП:", error);
        warehouseSelect.innerHTML = '<option value="">Помилка завантаження</option>';
    }
}

// ==========================================
// ЛОГІКА ДЛЯ ЧАТУ ТА МЕСЕНДЖЕРІВ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    injectCartHTML();
    updateCartUI();

    if (!sessionStorage.getItem('chatClosedByUser')) {
        setTimeout(() => {
            const chatWindow = document.getElementById('chatWindow');
            if (chatWindow) chatWindow.style.display = 'flex';
        }, 5000); 
    }
});

function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    if (chatWindow) {
        if (chatWindow.style.display === 'flex') {
            closeChat(); 
        } else {
            chatWindow.style.display = 'flex';
            const chatInput = document.getElementById('chatInput');
            if (chatInput) chatInput.focus();
        }
    }
}

function closeChat() {
    const chatWindow = document.getElementById('chatWindow');
    if (chatWindow) {
        chatWindow.style.display = 'none';
        sessionStorage.setItem('chatClosedByUser', 'true');
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const chatBody = document.getElementById('chatBody');
    if (!chatBody) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.textContent = text;
    chatBody.appendChild(userMsg);

    input.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
        const supportMsg = document.createElement('div');
        supportMsg.className = 'chat-message support';
        supportMsg.textContent = 'Дякуємо! Ваше повідомлення надіслано менеджеру. Скоро ми відповімо.';
        chatBody.appendChild(supportMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
}

function handleChatPress(e) {
    if (e.key === 'Enter') sendChatMessage();
}

function toggleMessengerMenu(e) {
    e.stopPropagation(); 
    const menu = document.getElementById('messengerMenu');
    if (menu) {
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    }
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('messengerMenu');
    if (menu && menu.style.display === 'flex' && !e.target.closest('.messenger-menu-wrapper')) {
        menu.style.display = 'none';
    }
});
