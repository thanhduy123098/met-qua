/* UI prototype only: no API calls, authentication, or production data. */
(() => {
  const paths = {
    store: '<path d="M3 10v10h18V10M2 10l2-7h16l2 7M2 10a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0M9 20v-7h6v7"/>',
    home: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    box: '<path d="m12 3 9 5v9l-9 5-9-5V8l9-5ZM3 8l9 5 9-5M12 13v9M7.5 5.5l9 5"/>',
    orders: '<path d="M6 3h12a1 1 0 0 1 1 1v18l-3-2-4 2-4-2-3 2V4a1 1 0 0 1 1-1ZM9 8h6M9 12h6M9 16h3"/>',
    users: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v3"/>',
    scan: '<path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5M7 8v8M10 8v8M14 8v8M17 8v8"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    logout: '<path d="M9 4H4v16h5M10 12h11M17 8l4 4-4 4"/>',
    money: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    more: '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
    edit: '<path d="m15 4 5 5M4 20l1-6L16 3a2 2 0 0 1 3 0l2 2a2 2 0 0 1 0 3L10 19l-6 1Z"/>',
    trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    sort: '<path d="M4 6h16M4 12h11M4 18h6"/>',
    bolt: '<path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
    unlock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 7-2M12 14v3"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    alert: '<path d="m12 3 10 18H2L12 3ZM12 9v5M12 17h.01"/>'
  };
  const icon = (name) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name] || paths.box}</svg>`;
  document.querySelectorAll('[data-icon]').forEach((element) => {
    element.innerHTML = icon(element.dataset.icon);
  });

  const seed = [
    {id:'p01',name:'Mì Hảo Hảo tôm chua cay',barcode:'8934563138165',price:5000,stock:10,isQuickAdd:true,tone:'rose'},
    {id:'p02',name:'Nước suối Lavie 500 ml',barcode:'8935049500128',price:5000,stock:12,isQuickAdd:true,tone:'blue'},
    {id:'p03',name:'Bánh mì',barcode:'BM001',price:10000,stock:25,isQuickAdd:true,tone:'sand'},
    {id:'p04',name:'Trứng gà',barcode:'TG001',price:3000,stock:18,isQuickAdd:true,tone:'sand'},
    {id:'p05',name:'Khăn giấy',barcode:'KG001',price:3000,stock:0,isQuickAdd:false,tone:'blue'},
    {id:'p06',name:'Dầu ăn 400 ml',barcode:'DA001',price:25000,stock:8,isQuickAdd:false,tone:'sand'},
    {id:'p07',name:'Gạo thơm 1 kg',barcode:'GT001',price:18000,stock:15,isQuickAdd:false,tone:'green'},
    {id:'p08',name:'Đường trắng 500 g',barcode:'DT001',price:6000,stock:0,isQuickAdd:false,tone:'blue'},
    {id:'p09',name:'Sữa tươi không đường',barcode:'ST001',price:8000,stock:20,isQuickAdd:true,tone:'green'},
    {id:'p10',name:'Cà phê hòa tan',barcode:'CP001',price:12000,stock:10,isQuickAdd:true,tone:'sand'},
    {id:'p11',name:'Xà phòng',barcode:'XP001',price:11000,stock:7,isQuickAdd:false,tone:'rose'},
    {id:'p12',name:'Dầu gội',barcode:'DG001',price:22000,stock:6,isQuickAdd:false,tone:'green'}
  ];
  const key = 'webpos-ui-trial-02-products';
  const cloneSeed = () => seed.map((product) => ({...product}));
  const validProducts = (list) => Array.isArray(list) && list.every((item) => item &&
    typeof item.id === 'string' && item.id.length < 100 &&
    typeof item.name === 'string' && item.name.trim() && item.name.length <= 150 &&
    typeof item.barcode === 'string' && item.barcode.trim() && item.barcode.length <= 64 &&
    Number.isSafeInteger(item.price) && item.price >= 0 &&
    Number.isSafeInteger(item.stock) && item.stock >= 0 && typeof item.isQuickAdd === 'boolean') &&
    new Set(list.map((p) => p.id)).size === list.length &&
    new Set(list.map((p) => p.barcode)).size === list.length;
  let products = cloneSeed();
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    if (stored && stored.version === 1 && validProducts(stored.products)) {
      products = stored.products.map((p) => ({
        id:p.id, name:p.name, barcode:p.barcode, price:p.price, stock:p.stock,
        isQuickAdd:p.isQuickAdd, tone:['sand','blue','rose','green'].includes(p.tone) ? p.tone : 'sand'
      }));
    }
  } catch { /* Private browsing or damaged demo data: use the in-memory sample. */ }
  let toastTimer;
  function toast(message) {
    const element = document.querySelector('#admin-toast');
    if (!element) return;
    clearTimeout(toastTimer);
    element.textContent = message;
    toastTimer = setTimeout(() => { element.textContent = ''; }, 3500);
  }
  function save(next) {
    if (!validProducts(next)) return false;
    try {
      localStorage.setItem(key, JSON.stringify({version:1,products:next}));
      products = next;
      return true;
    } catch {
      toast('Trình duyệt chưa cho lưu bản thử. Bạn thử lại hoặc mở bằng trình duyệt khác.');
      return false;
    }
  }
  document.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => button.closest('dialog').close());
  });
  const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  window.AdminPrototype = {
    icon, escape, toast, save, cloneSeed,
    getProducts: () => products,
    money: (value) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`,
    normalize: (value) => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toLowerCase().trim()
  };
})();
