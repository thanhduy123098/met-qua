const historyKey = "sales-order-history";
const list = document.querySelector("#order-list");
const count = document.querySelector("#history-count");
const productNames = {
  bread: "Bánh mì", egg: "Trứng gà", bag: "Túi giấy", ice: "Đá viên",
  candy: "Kẹo lẻ", tissue: "Khăn giấy", milk: "Sữa tươi", coffee: "Cà phê",
  sugar: "Đường", oil: "Dầu ăn", rice: "Gạo", apple: "Táo", banana: "Chuối",
  orange: "Cam", yogurt: "Sữa chua", sausage: "Xúc xích", soap: "Xà phòng",
  shampoo: "Dầu gội", noodles: "Mì Hảo Hảo", water: "Lavie 500ml"
};

const formatPrice = (price) => `${Number(price).toLocaleString("vi-VN")}đ`;
const formatDate = (date) => new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(date));

function getHistory() {
  try {
    const history = JSON.parse(window.sessionStorage.getItem(historyKey));
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
}

const history = getHistory();
count.textContent = `${history.length} đơn trong phiên này`;

if (!history.length) {
  list.innerHTML = '<p class="empty-history">Chưa có đơn hàng hoàn tất trong phiên này.</p>';
} else {
  list.innerHTML = history.map((order, index) => {
    const items = Array.isArray(order.items) && order.items.length
      ? order.items.map((item) => `${productNames[item.id] || item.id} × ${item.quantity}`).join(" · ")
      : "Không có chi tiết sản phẩm";
    return `
      <article class="order-entry" data-order="${index}">
        <div class="order-entry-top">
          <strong>${order.code}</strong>
          <span class="order-date">${formatDate(order.createdAt)}</span>
        </div>
        <div class="order-entry-bottom">
          <span>${order.method} · ${order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} món</span>
          <strong>${formatPrice(order.total)}</strong>
        </div>
        <button class="detail-button" type="button" data-detail="${index}">Xem sản phẩm trong đơn</button>
        <p class="order-items">${items}</p>
      </article>
    `;
  }).join("");
}

list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-detail]");
  if (!button) return;
  button.closest(".order-entry").classList.toggle("is-open");
  button.textContent = button.closest(".order-entry").classList.contains("is-open")
    ? "Ẩn sản phẩm trong đơn"
    : "Xem sản phẩm trong đơn";
});
