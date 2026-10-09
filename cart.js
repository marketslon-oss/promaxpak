let cart = JSON.parse(localStorage.getItem('promaxpak_cart')) || [];
const NP_API_KEY = '7dbda2a14b42158ebef8066b2f396262'; 

// ==========================================
// 1. ГЕНЕРАЦІЯ КОШИКА ТА ФОРМИ
// ==========================================
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
        <div class="cart-modal-content-large">
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
                        <div class="free-shipping-notice">🎁 Доставка безкоштовна!</div>
                        <div class="cart-actions-grid">
                            <button class="btn-continue-cart" onclick="closeCartModal()">Продовжити замовлення</button>
                            <button class="btn-checkout-primary" onclick="goToCheckout()">Перейти до оформлення</button>
                        </div>
                    </div>
                </div>

                <!-- ЕТАП 2: Форма оформлення -->
                <div id="cartStep2" style="display: none;">
                    
                    <div class="checkout-section-box">
                        <div class="step-title-row"><span class="step-badge">1</span><h3>Контактні дані</h3></div>
                        <div class="checkout-grid-2">
                            <div class="form-group-pro">
                                <label>Телефон *</label>
                                <input type="tel" id="orderPhone" placeholder="+38 (0__) ___-__-__">
                            </div>
                            <div class="form-group-pro">
                                <label>Email</label>
                                <input type="email" id="orderEmail" placeholder="Ваш email (необов'язково)">
                            </div>
                            <div class="form-group-pro">
                                <label>Прізвище *</label>
                                <input type="text" id="orderLastName" placeholder="Введіть прізвище">
                            </div>
                            <div class="form-group-pro">
                                <label>Ім'я *</label>
                                <input type="text" id="orderFirstName" placeholder="Введіть ім'я">
                            </div>
                        </div>
                    </div>

                    <div class="checkout-section-box">
                        <div class="step-title-row"><span class="step-badge">2</span><h3>Доставка *</h3></div>
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
                        <div class="step-title-row"><span class="step-badge">3</span><h3>Оплата *</h3></div>
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
                    <img id="modalProductImg" src="" alt="" style="max-height: 250px; max-width: 100%; border-radius: 6px; object-fit: contain; transition: transform 0.4s ease; cursor: zoom-in; transform-origin: center center; user-select: none;" onmouseenter="this.style.transform='scale(1.6)'" onmouseleave="this.style.transform='scale(1)'">
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
    initNovaPoshtaAPI();
}

// ==========================================
// 2. ГЕНЕРАЦІЯ КНОПОК МЕСЕНДЖЕРІВ (БЕЗ ЧАТУ)
// ==========================================
function injectWidgetsHTML() {
    if (document.querySelector('.floating-buttons')) return;

    const widgetsHTML = `
    <!-- Плаваючі кнопки зв'язку -->
    <div class="floating-buttons">
        <div class="messenger-menu-wrapper">
            <button class="float-btn" onclick="toggleMessengerMenu(event)" title="Написати нам у месенджер">
                <svg fill="white" viewBox="0 0 24 24" width="26" height="26">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
            </button>
            <div class="messenger-menu" id="messengerMenu">
                <a href="viber://chat?number=%2B380000000000" target="_blank">
                    <svg class="icon-viber" viewBox="0 0 24 24" width="20" height="20">
                        <path d="M19.14 17.5c-1.5 2.51-4.29 4.14-7.46 3.99-4.73-.23-8.5-4.14-8.5-8.87C3.18 7.82 7.04 3.96 11.82 4c4.66.04 8.5 3.93 8.35 8.61-.06 2.02-.75 3.88-1.89 5.39.81 1.76 2.65 3.19 2.76 3.27.18.14.07.41-.15.42-1.52.07-3.05-.28-4.25-1.07zm-1.63-2.67c.18-.32.06-.72-.25-.92-1.15-.75-2.52-1.07-3.83-.92-.35.04-.63.35-.61.7 0 .34.25.64.6.65 1.04.01 2.13.27 3.03.87.26.17.61.12.79-.17.15-.22.25-.49.27-.78v.57zM9.46 8.58c-.53-1.06-2.18-.46-2.61.64-.81 2.06.63 4.8 2.63 6.01 1.54.92 3.51.52 4.2-.95.34-.73-.24-1.66-1.11-1.39-.77.24-1.58-.2-1.86-.96-.28-.75.05-1.62.8-1.92.83-.34 1.25-1.37.7-2.13-.53-.74-1.28-1.31-2.09-1.63a3.52 3.52 3.52 0 0 0-.66.33z"/>
                    </svg> Viber
                </a>
                <a href="tg://resolve?domain=A_max_N" target="_blank">
                    <svg class="icon-tg" viewBox="0 0 24 24" width="20" height="20">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.62-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg> Telegram
                </a>
                <a href="mailto:info@promaxpak.com.ua">
                    <svg class="icon-mail" viewBox="0 0 24 24" width="20" height="20">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg> Email
                </a>
            </div>
        </div>

        <a href="tel:+380000000000" class="float-btn" title="Зателефонувати нам">
            <svg fill="white" viewBox="0 0 24 24" width="26" height="26">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
        </a>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', widgetsHTML);
}

// ==========================================
// 3. ОСНОВНА ЛОГІКА КОШИКА
// ==========================================
function saveCart() {
    localStorage.setItem('promaxpak_cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(name, pricePerItem, boxQty, sku = '') {
    let existingItem = cart.find(item => item.name === name || (item.sku === sku && sku !== ''));
    if (existingItem) existingItem.boxes += 1;
    else cart.push({ name: name, pricePerItem: pricePerItem, boxQty: boxQty, boxes: 1, sku: sku });
    saveCart();
    openCartModal();
}

function changeQuantity(index, delta) {
    cart[index].boxes += delta;
    if (cart[index].boxes <= 0) cart.splice(index, 1);
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
    if (modal) { backToCart(); updateCartUI(); modal.style.display = 'flex'; }
}

function closeCartModal() {
    let modal = document.getElementById('cartModal');
    if (modal) modal.style.display = 'none';
}

function goToCheckout() {
    if (cart.length === 0) { alert('Ваш кошик порожній!'); return; }
    document.getElementById('cartStep1').style.display = 'none';
    document.getElementById('cartStep2').style.display = 'block';
}

function backToCart() {
    document.getElementById('cartStep2').style.display = 'none';
    document.getElementById('cartStep1').style.display = 'block';
}

function submitOrder() {
    let phone = document.getElementById('orderPhone').value.trim();
    let email = document.getElementById('orderEmail').value.trim();
    let lastName = document.getElementById('orderLastName').value.trim();
    let firstName = document.getElementById('orderFirstName').value.trim();
    let city = document.getElementById('orderCity').value.trim();
    
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
    let emailText = email ? `\n📧 Email: ${email}` : '';

    let finalMessage = `✅ НОВЕ ЗАМОВЛЕННЯ\n\n` +
                        `👤 Клієнт: ${lastName} ${firstName}\n` +
                        `📞 Телефон: ${phone}${emailText}\n` +
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
        advantagesStr.split('|').forEach(adv => { if(adv.trim() !== "") fullDescHtml += '<li style="margin-bottom: 3px;">' + adv.trim() + '</li>'; });
        fullDescHtml += '</ul>';
    }
    document.getElementById('modalProductDesc').innerHTML = fullDescHtml;
    
    let specsHtml = '<div style="font-weight: 600; margin-bottom: 6px; color: #111827;">Характеристики:</div>';
    if (specs) {
        specs.split('|').forEach(sp => { if(sp.trim() !== "") specsHtml += '<p style="margin-bottom: 4px;">• ' + sp.trim() + '</p>'; });
    }
    specsHtml += '<p style="margin-bottom: 0; margin-top: 4px;">📦 В ящику: <b>' + boxQty + ' шт</b></p>';
    document.getElementById('modalProductSpecs').innerHTML = specsHtml;

    let buyBtn = document.getElementById('modalBuyBtn');
    buyBtn.onclick = function() { addToCart(title, Number(price), Number(boxQty), sku); closeProductModal(); };

    document.getElementById('productModal').style.display = 'flex';
}

function closeProductModal() {
    let modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'none';
}

window.onclick = function(event) {
    let cartModal = document.getElementById('cartModal');
    let productModal = document.getElementById('productModal');
    if (event.target === cartModal) closeCartModal();
    if (event.target === productModal) closeProductModal();
}

// ==========================================
// 4. ІНТЕГРАЦІЯ НОВОЇ ПОШТИ
// ==========================================
let npSearchTimeout = null;

function initNovaPoshtaAPI() {
    const cityInput = document.getElementById('orderCity');
    if (!cityInput) return;

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
        npSearchTimeout = setTimeout(() => { fetchNovaPoshtaCities(query); }, 500);
    });

    document.addEventListener('click', function(e) {
        if (e.target.id !== 'orderCity') {
            const resultsList = document.getElementById('citySearchResults');
            if (resultsList) resultsList.style.display = 'none';
        }
    });
}

async function fetchNovaPoshtaCities(query) {
    const url = 'https://api.novaposhta.ua/v2.0/json/';
    const body = { apiKey: NP_API_KEY, modelName: "Address", calledMethod: "searchSettlements", methodProperties: { CityName: query, Limit: "50" } };
    try {
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const data = await response.json();
        if (data.success && data.data.length > 0 && data.data[0].Addresses.length > 0) renderCityResults(data.data[0].Addresses);
        else document.getElementById('citySearchResults').style.display = 'none';
    } catch (error) { console.error("Помилка:", error); }
}

function renderCityResults(addresses) {
    const list = document.getElementById('citySearchResults');
    list.innerHTML = '';
    addresses.forEach(address => {
        const li = document.createElement('li');
        li.textContent = address.Present;
        li.onclick = () => selectNovaPoshtaCity(address.DeliveryCity, address.Present);
        list.appendChild(li);
    });
    list.style.display = 'block';
}

function selectNovaPoshtaCity(cityRef, presentName) {
    document.getElementById('orderCity').value = presentName;
    document.getElementById('orderCityRef').value = cityRef;
    document.getElementById('citySearchResults').style.display = 'none';
    fetchNovaPoshtaWarehouses(cityRef);
}

async function fetchNovaPoshtaWarehouses(cityRef) {
    const warehouseSelect = document.getElementById('orderWarehouse');
    warehouseSelect.innerHTML = '<option value="">Завантаження відділень...</option>';
    warehouseSelect.disabled = true;

    const url = 'https://api.novaposhta.ua/v2.0/json/';
    const body = { apiKey: NP_API_KEY, modelName: "Address", calledMethod: "getWarehouses", methodProperties: { CityRef: cityRef } };

    try {
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const data = await response.json();
        if (data.success && data.data.length > 0) {
            warehouseSelect.innerHTML = '<option value="">Оберіть відділення або поштомат</option>';
            data.data.forEach(warehouse => {
                const option = document.createElement('option');
                option.value = warehouse.Ref;
                option.textContent = warehouse.Description;
                warehouseSelect.appendChild(option);
            });
            warehouseSelect.disabled = false;
        } else {
            warehouseSelect.innerHTML = '<option value="">У цьому місті немає відділень</option>';
        }
    } catch (error) { warehouseSelect.innerHTML = '<option value="">Помилка завантаження</option>'; }
}

// ==========================================
// 5. ІНІЦІАЛІЗАЦІЯ СТОРІНКИ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    injectCartHTML();
    injectWidgetsHTML(); 
    updateCartUI();

    // Автоматичне додавання реклами
    const contentArea = document.querySelector('.content-area');
    if (contentArea && !document.querySelector('.marketslon-promo')) {
        const promoHTML = `
            <div class="marketslon-promo" style="text-align: center; margin-top: 40px; padding: 20px 0; border-top: 1px solid #E5E7EB; font-size: 0.9rem; color: #6B7280;">
                <p>Сайт розроблений компанією <a href="https://marketslon.com.ua" target="_blank" class="promo-highlight" style="text-decoration: none; color: #3B71CA; font-weight: 600;">marketslon.com.ua</a></p>
            </div>
        `;
        contentArea.insertAdjacentHTML('beforeend', promoHTML);
    }
});

function toggleMessengerMenu(e) {
    e.stopPropagation(); 
    const menu = document.getElementById('messengerMenu');
    if (menu) menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('messengerMenu');
    if (menu && menu.style.display === 'flex' && !e.target.closest('.messenger-menu-wrapper')) {
        menu.style.display = 'none';
    }
});
