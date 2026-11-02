const products = {
  bread: { name: "Bánh mì", price: 10000, emoji: window.GlassUI.productIcon("bread") },
  egg: { name: "Trứng gà", price: 3000, emoji: window.GlassUI.productIcon("egg") },
  bag: { name: "Túi giấy", price: 1000, emoji: window.GlassUI.productIcon("bag") },
  ice: { name: "Đá viên", price: 5000, emoji: window.GlassUI.productIcon("ice") },
  candy: { name: "Kẹo lẻ", price: 2000, emoji: window.GlassUI.productIcon("candy") },
  tissue: { name: "Khăn giấy", price: 3000, emoji: window.GlassUI.productIcon("tissue") },
  milk: { name: "Sữa tươi", price: 8000, emoji: window.GlassUI.productIcon("milk") },
  coffee: { name: "Cà phê", price: 12000, emoji: window.GlassUI.productIcon("coffee") },
  sugar: { name: "Đường", price: 6000, emoji: window.GlassUI.productIcon("sugar") },
  oil: { name: "Dầu ăn", price: 25000, emoji: window.GlassUI.productIcon("oil") },
  rice: { name: "Gạo", price: 18000, emoji: window.GlassUI.productIcon("rice") },
  apple: { name: "Táo", price: 7000, emoji: window.GlassUI.productIcon("apple") },
  banana: { name: "Chuối", price: 6000, emoji: window.GlassUI.productIcon("banana") },
  orange: { name: "Cam", price: 9000, emoji: window.GlassUI.productIcon("orange") },
  yogurt: { name: "Sữa chua", price: 5000, emoji: window.GlassUI.productIcon("yogurt") },
  sausage: { name: "Xúc xích", price: 9000, emoji: window.GlassUI.productIcon("sausage") },
  soap: { name: "Xà phòng", price: 11000, emoji: window.GlassUI.productIcon("soap") },
  shampoo: { name: "Dầu gội", price: 22000, emoji: window.GlassUI.productIcon("shampoo") },
  noodles: { name: "Mì Hảo Hảo", price: 5000, emoji: window.GlassUI.productIcon("noodles") },
  water: { name: "Lavie 500ml", price: 5000, emoji: window.GlassUI.productIcon("water") }
};

const cartStorageKey = "sales-cart";
const list = document.querySelector("#review-list");
const totalElement = document.querySelector("#review-total");
const countElement = document.querySelector("#review-count");
const paymentBackdrop = document.querySelector("#payment-backdrop");
const toast = document.querySelector("#cart-toast");

const formatPrice = (price) => `${price.toLocaleString("vi-VN")}đ`;

function getCart() {
  const saved = window.localStorage.getItem(cartStorageKey);
  if (!saved) return [];
  try {
    const cart = JSON.parse(saved);
    return Array.isArray(cart)
      ? cart.filter((item) => products[item.id] && Number.isInteger(item.quantity) && item.quantity > 0)
      : [];
  } catch {
    return [];
  }
}

function renderReview() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + products[item.id].price * item.quantity, 0);

  countElement.textContent = `${count} món`;
  totalElement.textContent = formatPrice(total);
  document.querySelector("#payment-count").textContent = `${count} món`;
  document.querySelector("#payment-total").textContent = formatPrice(total);
  document.querySelector("#qr-amount").textContent = formatPrice(total);

  list.innerHTML = cart.length
    ? cart.map((item) => {
      const product = products[item.id];
      return `
        <article class="review-item">
          <span class="product-emoji" aria-hidden="true">${product.emoji}</span>
          <div class="review-info">
            <strong>${product.name}</strong>
            <small>${formatPrice(product.price)} / món</small>
          </div>
          <span class="review-quantity">x${item.quantity}</span>
          <strong class="review-price">${formatPrice(product.price * item.quantity)}</strong>
        </article>
      `;
    }).join("")
    : '<p class="empty-review">Chưa có sản phẩm trong giỏ hàng.</p>';
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

document.querySelector("#back-to-sales").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.querySelector("#open-payment").addEventListener("click", () => {
  if (!getCart().length) {
    showToast("Giỏ hàng đang trống");
    return;
  }
  paymentBackdrop.hidden = false;
});

document.querySelector("#close-payment").addEventListener("click", () => {
  paymentBackdrop.hidden = true;
});

document.querySelectorAll(".payment-option").forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelectorAll(".payment-option").forEach((item) => item.classList.remove("is-selected"));
    option.classList.add("is-selected");
    document.querySelector("#cash-panel").classList.toggle("is-visible", option.dataset.payment === "cash");
    document.querySelector("#qr-panel").classList.toggle("is-visible", option.dataset.payment === "qr");
  });
});

const cashReceived = document.querySelector("#cash-received");
const cashChange = document.querySelector("#cash-change");

function updateCashChange() {
  const total = getCart().reduce((sum, item) => sum + products[item.id].price * item.quantity, 0);
  const received = Number(cashReceived.value) || 0;
  cashChange.textContent = formatPrice(Math.max(0, received - total));
}

cashReceived.addEventListener("input", updateCashChange);
document.querySelectorAll("[data-cash]").forEach((button) => {
  button.addEventListener("click", () => {
    cashReceived.value = button.dataset.cash;
    updateCashChange();
  });
});

document.querySelector("#confirm-cash").addEventListener("click", () => {
  const total = getCart().reduce((sum, item) => sum + products[item.id].price * item.quantity, 0);
  const received = Number(cashReceived.value) || total;
  window.localStorage.setItem("payment-record", JSON.stringify({
    method: "Tiền mặt",
    total,
    received,
    change: Math.max(0, received - total),
    items: getCart()
  }));
  window.location.href = "success.html";
});

document.querySelector("#confirm-qr").addEventListener("click", () => {
  const total = getCart().reduce((sum, item) => sum + products[item.id].price * item.quantity, 0);
  window.localStorage.setItem("payment-record", JSON.stringify({
    method: "VietQR",
    total,
    received: total,
    change: 0,
    items: getCart()
  }));
  window.location.href = "success.html";
});

renderReview();
