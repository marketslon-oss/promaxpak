let cart = JSON.parse(localStorage.getItem('promaxpak_cart')) || [];

function injectCartHTML() {
    if (document.getElementById('cartModal')) return; 

    const cartHTML = `
    <div class="cart-modal" id="cartModal" style="display: none;">
        <div class="cart-modal-content-large">
            
            <div class="checkout-top-bar">
                <h2>Оформлення замовлення</h2>
                <button class="close-cart" onclick="closeCartModal()">&times;</button>
            </div>

            <div class="checkout-scroll-body">
                
                <!-- ЕТАП 1: Кошик з двома кнопками -->
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
                                <p class="delivery-desc">У відділення або поштомат Нової Пошти по Україні</p>
                            </div>
                        </label>

                        <div class="checkout-grid-2" style="margin-top: 15px;">
                            <div class="form-group-pro">
                                <label>Населений пункт (Місто) *</label>
                                <input type="text" id="orderCity" placeholder="Наприклад: Кропивницький">
                            </div>
                            <div class="form-group-pro">
                                <label>Номер відділення або поштомату *</label>
                                <input type="text" id="orderWarehouse" placeholder="Наприклад: Відділення №1">
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
    `;
    
    document.body.insertAdjacentHTML('beforeend', cartHTML);
}

function saveCart() {
    localStorage.setItem('promaxpak_cart', JSON.stringify(cart));
    updateCartUI();
}

// ДОБАВЛЕН ПАРАМЕТР sku
function addToCart(name, pricePerItem, boxQty, sku = '') {
    // Ищем товар не только по имени, но и по коду
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

        // Формируем красивый вывод кода товара
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
    let warehouse = document.getElementById('orderWarehouse').value.trim();
    let comment = document.getElementById('orderComment').value.trim();
    let payment = document.querySelector('input[name="orderPayment"]:checked').value;

    if (!phone || !lastName || !firstName || !city || !warehouse) {
        alert('Будь ласка, заповніть усі обов’язкові поля форми!');
        return;
    }

    // Сбор всех товаров из корзины с кодами (SKU)
    let orderDetailsList = cart.map(item => {
        let boxPrice = item.pricePerItem * item.boxQty;
        return `📦 ${item.name} (Код: ${item.sku || 'Немає'})\n   ${item.boxes} ящ. x ${boxPrice} ₴ = ${item.boxes * boxPrice} ₴`;
    }).join('\n');

    let totalPrice = cart.reduce((sum, item) => sum + (item.pricePerItem * item.boxQty * item.boxes), 0);
    
    let commentText = comment ? `\nКоментар: ${comment}` : '';

    // Формируем текст финального сообщения
    let finalMessage = `✅ НОВЕ ЗАМОВЛЕННЯ\n\n` +
                       `👤 Клієнт: ${lastName} ${firstName}\n` +
                       `📞 Телефон: ${phone}\n` +
                       `🚚 Доставка: НП, м. ${city}, ${warehouse}\n` +
                       `💳 Оплата: ${payment}${commentText}\n\n` +
                       `🛒 ТОВАРИ:\n${orderDetailsList}\n\n` +
                       `💰 ЗАГАЛЬНА СУМА: ${totalPrice} ₴`;

    // Пока выводим в Alert. Позже этот текст легко передать в Telegram Bot.
    alert(finalMessage);
    
    // Очистка корзины после успешного оформления
    cart = [];
    saveCart();
    closeCartModal();
}

window.onclick = function(event) {
    let modal = document.getElementById('cartModal');
    if (event.target === modal) {
        closeCartModal();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    injectCartHTML();
    updateCartUI();
});