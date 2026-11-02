const accountNameElement = document.querySelector("#account-name");
const accountStorageKey = "sales-account-name";

const queryName = new URLSearchParams(window.location.search).get("email");
const storedName = window.sessionStorage.getItem(accountStorageKey);
const accountName = (queryName || storedName || "BẠN").split("@")[0].trim();

if (accountName) {
  const displayName = accountName.toLocaleUpperCase("vi-VN");
  accountNameElement.textContent = displayName;
  window.sessionStorage.setItem(accountStorageKey, displayName);
}

document.querySelector("#logout-button").addEventListener("click", () => {
  window.sessionStorage.clear();
  window.localStorage.removeItem("sales-cart");
  window.localStorage.removeItem("payment-record");
  window.location.href = "login.html";
});
