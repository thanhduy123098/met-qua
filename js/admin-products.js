(() => {
  const ui = window.AdminPrototype;
  const list = document.querySelector('#product-list');
  const search = document.querySelector('#admin-search');
  const sort = document.querySelector('#product-sort');
  const drawer = document.querySelector('#product-drawer');
  const form = document.querySelector('#product-form');
  const deleteDialog = document.querySelector('#delete-dialog');
  let filter = new URLSearchParams(location.search).get('filter') === 'out' ? 'out' : 'all';
  let editingId = null;
  let deletingId = null;
  let savedTrigger = null;
  const collator = new Intl.Collator('vi', {sensitivity:'base',numeric:true});

  function render() {
    const products = ui.getProducts();
    const query = ui.normalize(search.value);
    document.querySelector('#search-clear').hidden = !search.value;
    const counts = {all:products.length,out:products.filter((p) => p.stock === 0).length,quick:products.filter((p) => p.isQuickAdd).length};
    document.querySelectorAll('[data-filter]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
      button.querySelector('.filter-count').textContent = counts[button.dataset.filter];
    });
    const visible = products.filter((p) => (filter !== 'out' || p.stock === 0) &&
      (filter !== 'quick' || p.isQuickAdd) && (!query || ui.normalize(p.name).includes(query) || ui.normalize(p.barcode).includes(query)));
    visible.sort((a,b) => {
      if (sort.value === 'stock') return a.stock-b.stock || collator.compare(a.name,b.name);
      if (sort.value === 'price-low') return a.price-b.price || collator.compare(a.name,b.name);
      if (sort.value === 'price-high') return b.price-a.price || collator.compare(a.name,b.name);
      return collator.compare(a.name,b.name);
    });
    document.querySelector('#result-count').textContent = `Hiển thị ${visible.length} / ${products.length} sản phẩm`;
    document.querySelector('#catalog-end').hidden = !visible.length;
    document.querySelector('#catalog-heading').hidden = !visible.length;
    if (!visible.length) {
      list.innerHTML = `<div class="empty-state"><span class="empty-icon">${ui.icon('search')}</span><h2>${products.length ? 'Không tìm thấy sản phẩm' : 'Danh mục đang trống'}</h2><p>${products.length ? 'Thử tên, mã khác hoặc bỏ bộ lọc đang chọn.' : 'Thêm sản phẩm đầu tiên để xem thử bố cục.'}</p><button class="button" id="empty-action" type="button">${products.length ? 'Bỏ tìm kiếm và bộ lọc' : 'Thêm sản phẩm'}</button></div>`;
      document.querySelector('#empty-action').addEventListener('click', () => {
        if (!products.length) openForm();
        else { search.value=''; filter='all'; render(); search.focus(); }
      });
      return;
    }
    list.innerHTML = visible.map((p) => `<article class="product-row" data-id="${ui.escape(p.id)}">
      <div class="product-main"><span class="product-mark" data-tone="${ui.escape(p.tone)}">${ui.icon('box')}</span><div class="product-copy"><h2>${ui.escape(p.name)}</h2><div class="product-meta"><span class="barcode-text">${ui.escape(p.barcode)}</span>${p.isQuickAdd ? `<span class="quick-badge">${ui.icon('bolt')}Thêm nhanh</span>` : ''}</div></div></div>
      <div class="price-cell"><span class="sr-only">Giá bán: </span>${ui.money(p.price)}</div>
      <div class="stock-cell">${p.stock === 0 ? '<span class="stock-out">Hết hàng</span>' : `Còn <strong>${p.stock}</strong>`}</div>
      <details class="row-actions"><summary class="icon-button" aria-label="Thao tác với ${ui.escape(p.name)}">${ui.icon('more')}</summary><div class="action-menu"><button type="button" data-action="edit">${ui.icon('edit')}Chỉnh sửa</button><button class="danger-text" type="button" data-action="delete">${ui.icon('trash')}Xóa sản phẩm</button></div></details>
    </article>`).join('');
  }
  search.addEventListener('input', render);
  sort.addEventListener('change', render);
  document.querySelector('#search-clear').addEventListener('click', () => { search.value=''; render(); search.focus(); });
  document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => { filter=button.dataset.filter; render(); }));
  document.addEventListener('click', (event) => {
    document.querySelectorAll('.row-actions[open]').forEach((details) => {
      if (!details.contains(event.target)) details.open=false;
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.row-actions[open]').forEach((details) => { details.open=false; details.querySelector('summary').focus(); });
  });
  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const row = button.closest('[data-id]');
    const product = ui.getProducts().find((p) => p.id === row.dataset.id);
    if (!product) return;
    savedTrigger = row.querySelector('summary');
    row.querySelector('details').open=false;
    if (button.dataset.action === 'edit') openForm(product);
    if (button.dataset.action === 'delete') {
      deletingId = product.id;
      document.querySelector('#delete-name').textContent = product.name;
      deleteDialog.showModal();
    }
  });
  const fields = ['name','barcode','price','stock'];
  function clearErrors() {
    fields.forEach((name) => {
      document.querySelector(`#field-${name}`).removeAttribute('aria-invalid');
      document.querySelector(`#error-${name}`).textContent='';
    });
  }
  function openForm(product) {
    editingId = product ? product.id : null;
    form.reset();
    clearErrors();
    document.querySelector('#form-title').textContent = product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm';
    document.querySelector('#save-label').textContent = product ? 'Lưu thay đổi' : 'Lưu sản phẩm';
    if (product) {
      fields.forEach((name) => { document.querySelector(`#field-${name}`).value=product[name]; });
      document.querySelector('#field-quick').checked=product.isQuickAdd;
    }
    drawer.showModal();
  }
  document.querySelector('#add-product').addEventListener('click', () => {
    savedTrigger=document.querySelector('#add-product'); openForm();
  });
  [drawer,deleteDialog].forEach((dialog) => dialog.addEventListener('close', () => {
    if (savedTrigger?.isConnected) savedTrigger.focus();
    else document.querySelector('#add-product').focus();
  }));
  form.addEventListener('submit', (event) => {
    event.preventDefault(); clearErrors();
    const name = document.querySelector('#field-name').value.trim();
    const barcode = document.querySelector('#field-barcode').value.trim();
    const rawPrice = document.querySelector('#field-price').value;
    const rawStock = document.querySelector('#field-stock').value;
    const price = Number(rawPrice), stock = Number(rawStock);
    const errors = {};
    if (!name || name.length > 150) errors.name='Nhập tên sản phẩm, tối đa 150 ký tự.';
    if (!barcode || barcode.length > 64) errors.barcode='Nhập mã sản phẩm, tối đa 64 ký tự.';
    else if (ui.getProducts().some((p) => p.id !== editingId && ui.normalize(p.barcode) === ui.normalize(barcode))) errors.barcode='Mã này đã được dùng cho một sản phẩm khác.';
    if (!rawPrice || !Number.isSafeInteger(price) || price < 0) errors.price='Nhập giá bán nguyên, từ 0đ trở lên.';
    if (!rawStock || !Number.isSafeInteger(stock) || stock < 0) errors.stock='Nhập số lượng nguyên, từ 0 trở lên.';
    if (Object.keys(errors).length) {
      Object.entries(errors).forEach(([key,message]) => {
        document.querySelector(`#error-${key}`).textContent=message;
        document.querySelector(`#field-${key}`).setAttribute('aria-invalid','true');
      });
      document.querySelector(`#field-${Object.keys(errors)[0]}`).focus();
      return;
    }
    const previous = ui.getProducts().find((p) => p.id === editingId);
    const item = {id:editingId || `trial-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,name,barcode,price,stock,isQuickAdd:document.querySelector('#field-quick').checked,tone:previous?.tone || 'sand'};
    const next = editingId ? ui.getProducts().map((p) => p.id === editingId ? item : p) : [...ui.getProducts(),item];
    if (!ui.save(next)) return;
    render(); drawer.close();
    ui.toast(editingId ? 'Đã lưu thay đổi trong bản thử.' : 'Đã thêm sản phẩm vào bản thử.');
  });
  document.querySelector('#confirm-delete').addEventListener('click', () => {
    const next = ui.getProducts().filter((p) => p.id !== deletingId);
    if (!ui.save(next)) return;
    render(); deleteDialog.close();
    ui.toast('Đã xóa sản phẩm khỏi bản thử.');
  });
  render();
})();
