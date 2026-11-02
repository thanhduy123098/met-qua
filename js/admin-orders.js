(() => {
  const ui=window.AdminPrototype, demo=window.AdminDemo;
  const search=document.querySelector('#order-search');
  const list=document.querySelector('#order-list');
  const filters=document.querySelector('#order-filter-dialog');
  const query=new URLSearchParams(location.search);
  const statuses=['all','completed','pending','canceled'];
  const ranges=['today','7days','30days','all','custom'];
  const state={q:query.get('q')||'',status:statuses.includes(query.get('status'))?query.get('status'):'all',range:ranges.includes(query.get('range'))?query.get('range'):'today',seller:query.get('seller')||'all',from:query.get('from')||demo.dayKey(),to:query.get('to')||demo.dayKey(),page:Math.max(1,Math.min(10000,Number(query.get('page'))||1))};
  const pageSize=6;
  const sellerNames=new Map([['owner','Đỗ Thành Duy'],...demo.staff.get().map(p=>[p.username,p.displayName]),...demo.orders.get().map(o=>[o.sellerUsername,o.sellerName])]);
  if (state.seller!=='all' && !sellerNames.has(state.seller)) state.seller='all';
  if (state.range==='custom' && (!/^\d{4}-\d{2}-\d{2}$/.test(state.from)||!/^\d{4}-\d{2}-\d{2}$/.test(state.to)||state.from>state.to)) state.range='today';
  const rangeNames={today:'Hôm nay','7days':'7 ngày gần đây','30days':'30 ngày gần đây',all:'Tất cả thời gian',custom:'Khoảng ngày tùy chọn'};
  const sellerSelect=document.querySelector('#order-seller');
  sellerNames.forEach((name,username)=>{const option=document.createElement('option'); option.value=username; option.textContent=`${name} · ${username}`; sellerSelect.append(option);});
  search.value=state.q;
  const params=()=>new URLSearchParams({q:state.q,status:state.status,range:state.range,seller:state.seller,from:state.from,to:state.to,page:String(state.page)});
  function inRange(order) {
    const day=demo.dayKey(new Date(order.createdAt));
    if (state.range==='today') return day===demo.dayKey();
    if (state.range==='7days') return day>=demo.shiftDay(-6) && day<=demo.dayKey();
    if (state.range==='30days') return day>=demo.shiftDay(-29) && day<=demo.dayKey();
    if (state.range==='custom') return day>=state.from && day<=state.to;
    return true;
  }
  function render() {
    const q=ui.normalize(state.q);
    const matching=demo.orders.get().filter(o=>inRange(o) && (state.seller==='all'||state.seller===o.sellerUsername) && (!q||ui.normalize(o.code).includes(q)));
    const filtered=matching.filter(o=>state.status==='all'||o.status===state.status).sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt));
    const pages=Math.max(1,Math.ceil(filtered.length/pageSize));
    state.page=Math.min(pages,Math.max(1,Math.floor(state.page)));
    const start=(state.page-1)*pageSize;
    document.querySelector('#order-search-clear').hidden=!state.q;
    document.querySelectorAll('[data-order-status]').forEach(button=>{
      const status=button.dataset.orderStatus;
      button.setAttribute('aria-pressed',String(status===state.status));
      button.querySelector('.filter-count').textContent=status==='all'?matching.length:matching.filter(o=>o.status===status).length;
    });
    document.querySelector('#order-revenue').textContent=ui.money(filtered.filter(o=>o.status==='completed').reduce((s,o)=>s+o.total,0));
    document.querySelector('#filtered-order-count').textContent=filtered.length;
    document.querySelector('#pending-order-count').textContent=`${filtered.filter(o=>o.status==='pending').length} đơn đang chờ`;
    document.querySelector('#order-result-count').textContent=filtered.length?`Hiển thị ${start+1}–${Math.min(start+pageSize,filtered.length)} / ${filtered.length} đơn`:'Không có đơn phù hợp';
    const filterCount=Number(state.range!=='today')+Number(state.seller!=='all');
    document.querySelector('#order-filter-count').textContent=filterCount;
    document.querySelector('#order-filter-count').hidden=!filterCount;
    document.querySelector('#order-filter-description').textContent=`${state.range==='custom'?`${state.from.split('-').reverse().join('/')} – ${state.to.split('-').reverse().join('/')}`:rangeNames[state.range]} · ${state.seller==='all'?'Tất cả người bán':sellerNames.get(state.seller)}`;
    document.querySelector('#clear-order-filters').hidden=!filterCount && state.status==='all' && !state.q;
    document.querySelector('#order-table-head').hidden=!filtered.length;
    document.querySelector('#order-pagination').hidden=!filtered.length;
    document.querySelector('#order-page-label').textContent=`Trang ${state.page} / ${pages}`;
    document.querySelector('#previous-order-page').disabled=state.page===1;
    document.querySelector('#next-order-page').disabled=state.page>=pages;
    try { history.replaceState(null,'',`orders.html?${params()}`); } catch { /* file previews may restrict history */ }
    if (!filtered.length) {
      list.innerHTML=`<div class="empty-state"><span class="empty-icon">${ui.icon('orders')}</span><h2>Chưa có đơn phù hợp</h2><p>Thử thời gian khác, mã khác hoặc bỏ các bộ lọc.</p><button class="button" id="reset-empty-orders" type="button">Bỏ các bộ lọc</button></div>`;
      document.querySelector('#reset-empty-orders').addEventListener('click',resetFilters);
      return;
    }
    list.innerHTML=filtered.slice(start,start+pageSize).map(order=>{
      const href=`order-detail.html?${new URLSearchParams({id:order.id,back:params().toString()})}`;
      return `<a class="order-row" href="${ui.escape(href)}"><div class="order-main"><strong>${ui.escape(order.code)}</strong><time datetime="${ui.escape(order.createdAt)}">${demo.formatDate(order.createdAt)}</time></div><div class="order-person"><span>${ui.escape(order.sellerName)}</span><small>${ui.escape(order.sellerUsername)}</small></div><div class="order-amount"><strong>${ui.money(order.total)}</strong><small>${demo.methodLabel(order.method)}</small></div><div class="order-status">${demo.badge(order.status)}${ui.icon('arrow')}</div></a>`;
    }).join('');
  }
  function resetFilters() {Object.assign(state,{q:'',status:'all',range:'all',seller:'all',page:1}); search.value=''; render();}
  search.addEventListener('input',()=>{state.q=search.value; state.page=1; render();});
  document.querySelector('#order-search-clear').addEventListener('click',()=>{state.q='';search.value='';state.page=1;render();search.focus();});
  document.querySelectorAll('[data-order-status]').forEach(button=>button.addEventListener('click',()=>{state.status=button.dataset.orderStatus;state.page=1;render();}));
  document.querySelector('#clear-order-filters').addEventListener('click',resetFilters);
  document.querySelector('#previous-order-page').addEventListener('click',()=>{state.page--;render();});
  document.querySelector('#next-order-page').addEventListener('click',()=>{state.page++;render();});
  const rangeSelect=document.querySelector('#order-date-range');
  function customVisibility() {document.querySelector('#custom-order-dates').hidden=rangeSelect.value!=='custom';}
  rangeSelect.addEventListener('change',customVisibility);
  document.querySelector('#open-order-filters').addEventListener('click',()=>{
    rangeSelect.value=state.range;sellerSelect.value=state.seller;
    document.querySelector('#order-date-from').value=state.from;
    document.querySelector('#order-date-to').value=state.to;
    document.querySelector('#order-filter-error').textContent='';customVisibility();filters.showModal();
  });
  document.querySelector('#order-filter-form').addEventListener('submit',event=>{
    event.preventDefault();
    const from=document.querySelector('#order-date-from').value,to=document.querySelector('#order-date-to').value;
    if (rangeSelect.value==='custom' && (!from||!to||from>to)) {document.querySelector('#order-filter-error').textContent='Chọn đủ hai ngày và để ngày bắt đầu không sau ngày kết thúc.';return;}
    Object.assign(state,{range:rangeSelect.value,seller:sellerSelect.value,from:from||demo.dayKey(),to:to||demo.dayKey(),page:1});
    render();filters.close();
  });
  render();
})();
