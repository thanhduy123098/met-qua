(() => {
  const ui = window.AdminPrototype;
  const demo=window.AdminDemo;
  const today=demo.orders.get().filter(o=>o.status==='completed' && demo.dayKey(new Date(o.createdAt))===demo.dayKey());
  document.querySelector('#home-revenue').textContent=ui.money(today.reduce((sum,o)=>sum+o.total,0));
  document.querySelector('#home-order-count').textContent=today.length;
  const products = ui.getProducts();
  const out = products.filter((p) => p.stock === 0).length;
  document.querySelector('#inventory-title').textContent = out ? `${out} sản phẩm đang hết hàng` : 'Tất cả sản phẩm đều còn hàng';
  document.querySelector('#inventory-description').textContent = `${products.length} sản phẩm trong danh mục minh họa. Kiểm tra và cập nhật tồn kho tại đây.`;
  const resetDialog = document.querySelector('#reset-dialog');
  document.querySelector('#reset-demo').addEventListener('click', () => resetDialog.showModal());
  document.querySelector('#confirm-reset').addEventListener('click', () => {
    if (ui.save(ui.cloneSeed()) && demo.staff.save(demo.staff.reset()) && demo.orders.save(demo.orders.reset())) {
      resetDialog.close();
      location.reload();
    }
  });
})();
