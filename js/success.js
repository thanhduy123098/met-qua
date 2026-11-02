const formatPrice = (price) => `${price.toLocaleString("vi-VN")}đ`;
const paymentRecord = (() => {
  try {
    return JSON.parse(window.localStorage.getItem("payment-record")) || {};
  } catch {
    return {};
  }
})();

const orderCode = paymentRecord.orderCode || `DEMO-${String(Date.now()).slice(-3)}`;
const orderHistoryKey = "sales-order-history";

function getHistory() {
  try {
    const history = JSON.parse(window.sessionStorage.getItem(orderHistoryKey));
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
}

const history = getHistory();
if (paymentRecord.total && !history.some((order) => order.code === orderCode)) {
  history.unshift({
    ...paymentRecord,
    code: orderCode,
    createdAt: new Date().toISOString()
  });
  window.sessionStorage.setItem(orderHistoryKey, JSON.stringify(history));
}
if (paymentRecord.total && !paymentRecord.orderCode) {
  paymentRecord.orderCode = orderCode;
  window.localStorage.setItem("payment-record", JSON.stringify(paymentRecord));
}

document.querySelector("#order-code").textContent = orderCode;
document.querySelector("#success-total").textContent = formatPrice(paymentRecord.total || 0);
document.querySelector("#payment-method").textContent = paymentRecord.method || "Tiền mặt";
document.querySelector("#cash-received").textContent = formatPrice(paymentRecord.received || 0);
document.querySelector("#cash-change").textContent = formatPrice(paymentRecord.change || 0);

document.querySelector("#new-order").addEventListener("click", () => {
  window.localStorage.removeItem("sales-cart");
  window.localStorage.removeItem("payment-record");
  window.location.href = "index.html";
});
