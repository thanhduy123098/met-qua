/* Retain the return path while exploring the existing mock employee pages.
 * The query parameter is navigation only; it does not implement permissions. */
(() => {
  let checkoutReturn = false;
  try {
    checkoutReturn = location.pathname.endsWith('/success.html') && sessionStorage.getItem('webpos-ui-trial-checkout-return') === 'manager';
    if (checkoutReturn) sessionStorage.removeItem('webpos-ui-trial-checkout-return');
  } catch { /* The navigation context is optional when session storage is blocked. */ }
  if (new URLSearchParams(location.search).get('from') !== 'manager' && !checkoutReturn) return;
  const navigation = {
    'menu-button':'manager.html',
    'view-cart':'cart.html?from=manager',
    'back-to-sales':'index.html?from=manager',
    'new-order':'index.html?from=manager'
  };
  Object.entries(navigation).forEach(([id,target]) => {
    const button = document.getElementById(id);
    if (!button) return;
    button.addEventListener('click', (event) => {
      event.preventDefault(); event.stopImmediatePropagation();
      // Preserve the original mock new-order cleanup without replacing checkout.
      if (id === 'new-order') {
        localStorage.removeItem('sales-cart');
        localStorage.removeItem('payment-record');
      }
      location.href=target;
    }, true);
  });
  document.querySelectorAll('a[href="menu.html"]').forEach((link) => { link.href='manager.html'; });
  document.querySelectorAll('a[href="history.html"]').forEach((link) => { link.href='history.html?from=manager'; });
  // Remember only the return destination; the original mock payment handlers
  // still create their records and navigate to the success page themselves.
  if (location.pathname.endsWith('/cart.html')) {
    ['confirm-cash','confirm-qr'].forEach((id) => {
      document.getElementById(id)?.addEventListener('click', () => {
        try { sessionStorage.setItem('webpos-ui-trial-checkout-return','manager'); } catch { /* optional */ }
      }, true);
    });
  }
})();
