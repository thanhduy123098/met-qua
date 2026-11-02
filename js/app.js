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

let cart = [
  { id: "noodles", quantity: 2 },
  { id: "water", quantity: 1 },
  { id: "bread", quantity: 1 }
];

const savedCart = window.localStorage.getItem(cartStorageKey);
if (savedCart) {
  try {
    const parsedCart = JSON.parse(savedCart);
    if (Array.isArray(parsedCart) && parsedCart.every((item) => products[item.id] && Number.isInteger(item.quantity) && item.quantity > 0)) {
      cart = parsedCart;
    }
  } catch {
    window.localStorage.removeItem(cartStorageKey);
  }
}

const cartList = document.querySelector("#cart-list");
const cartTotal = document.querySelector("#cart-total");
const cartItemCount = document.querySelector("#cart-item-count");
const toast = document.querySelector("#toast");

const formatPrice = (price) => `${price.toLocaleString("vi-VN")}đ`;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function renderCart() {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + products[item.id].price * item.quantity, 0);

  cartItemCount.textContent = `(${itemCount} món)`;
  cartTotal.textContent = formatPrice(total);
  window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));

  if (!cart.length) {
    cartList.innerHTML = '<div class="empty-cart">Giỏ hàng đang trống. Hãy chọn một sản phẩm ở mục “Thêm nhanh”.</div>';
    return;
  }

  cartList.innerHTML = cart.map((item) => {
    const product = products[item.id];
    return `
      <article class="cart-item" data-id="${item.id}">
        <span class="product-emoji" aria-hidden="true">${product.emoji}</span>
        <div class="cart-product-info">
          <strong>${product.name}</strong>
          <small>${formatPrice(product.price)}</small>
        </div>
        <div class="quantity-control" aria-label="Số lượng ${product.name}">
          <button type="button" data-action="decrease" aria-label="Giảm số lượng">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="increase" aria-label="Tăng số lượng">+</button>
        </div>
        <strong class="cart-item-total">${formatPrice(product.price * item.quantity)}</strong>
        <button class="delete-button" type="button" data-action="delete" aria-label="Xóa ${product.name}">${window.GlassUI.icon('trash')}</button>
      </article>
    `;
  }).join("");
}

function addToCart(id) {
  const item = cart.find((entry) => entry.id === id);
  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }
  renderCart();
  showToast(`Đã thêm ${products[id].name} vào giỏ hàng`);
}

document.querySelector("#quick-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-product]");
  if (button) addToCart(button.dataset.product);
});

cartList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const item = cart.find((entry) => entry.id === button.closest(".cart-item").dataset.id);
  if (!item) return;

  if (button.dataset.action === "increase") item.quantity += 1;
  if (button.dataset.action === "decrease") item.quantity -= 1;
  if (button.dataset.action === "delete" || item.quantity < 1) {
    cart = cart.filter((entry) => entry.id !== item.id);
  }
  renderCart();
});

document.querySelector("#clear-cart").addEventListener("click", () => {
  cart = [];
  renderCart();
  showToast("Đã xóa toàn bộ giỏ hàng");
});

document.querySelector("#view-cart").addEventListener("click", () => {
  window.location.href = "cart.html";
});

document.querySelector("#menu-button").addEventListener("click", () => {
  window.location.href = "menu.html";
});

document.querySelector("#scan-button").addEventListener("click", () => {
  const scanLabel = document.querySelector("#scan-label");
  scanLabel.textContent = "Đang quét mã...";
  window.setTimeout(() => {
    scanLabel.textContent = "Đang chờ quét";
    showToast("Chưa phát hiện mã sản phẩm");
  }, 1200);
});

document.querySelector("#camera-switch").addEventListener("click", () => {
  showToast("Đã chuyển camera");
});

document.querySelector("#search-form").addEventListener("submit", (event) => event.preventDefault());
document.querySelector("#product-search").addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();
  const status = document.querySelector("#search-status");
  const buttons = [...document.querySelectorAll(".quick-product")];
  let visibleCount = 0;

  buttons.forEach((button) => {
    const isVisible = button.textContent.toLowerCase().includes(query);
    button.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });
  status.textContent = query && !visibleCount ? "Không tìm thấy sản phẩm phù hợp." : "";
});

renderCart();
