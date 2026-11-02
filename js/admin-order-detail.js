(() => {
  const ui=window.AdminPrototype,demo=window.AdminDemo;
  const query=new URLSearchParams(location.search);
  const orderId=query.get('id');
  const root=document.querySelector('#order-detail');
  const dialog=document.querySelector('#order-action-dialog');
  const back=new URLSearchParams(query.get('back')||'');
  const allowed=new URLSearchParams();
  ['q','status','range','seller','from','to','page'].forEach(key=>{if(back.has(key))allowed.set(key,back.get(key));});
  const backHref=`orders.html${allowed.size?'?'+allowed:''}`;
  document.querySelector('#back-to-orders').href=backHref;
  let action='';
  const getOrder=()=>demo.orders.get().find(o=>o.id===orderId);
  function render() {
    const order=getOrder();
    if (!order) {
      root.innerHTML=`<section class="detail-card empty-state"><span class="empty-icon">${ui.icon('orders')}</span><h1>Không tìm thấy đơn mẫu</h1><p>Đơn có thể đã được khôi phục về dữ liệu ban đầu.</p><a class="button" href="${ui.escape(backHref)}">Về danh sách đơn</a></section>`;
      return;
    }
    const count=order.items.reduce((s,p)=>s+p.quantity,0);
    const items=order.items.map(p=>`<div class="detail-line"><div><strong>${ui.escape(p.name)}</strong><small>${ui.money(p.price)} × ${p.quantity}</small></div><span>${ui.money(p.price*p.quantity)}</span></div>`).join('');
    const paymentInfo=order.method==='cash'?`<dl class="info-list"><div><dt>Tiền khách đưa</dt><dd>${ui.money(order.received)}</dd></div><div><dt>Tiền thừa</dt><dd>${ui.money(Math.max(0,order.received-order.total))}</dd></div></dl>`:`<dl class="info-list"><div><dt>Phương thức</dt><dd>VietQR</dd></div>${order.confirmedAt?`<div><dt>Xác nhận thủ công</dt><dd>${demo.formatDate(order.confirmedAt)}</dd></div>`:''}</dl>`;
    const message=order.status==='pending'?'Đang chờ kiểm tra tiền đã vào tài khoản cửa hàng.':order.status==='completed'?'Đơn đã hoàn tất và được tính vào doanh thu minh họa.':'Đơn đã hủy, không tính vào doanh thu.';
    const qr=order.status==='pending'?`<div class="mock-qr">${ui.icon('scan')}<strong>VietQR minh họa</strong><small>Không phải mã chuyển tiền</small></div><div class="detail-actions"><button class="button button-primary" type="button" data-order-action="complete">Xác nhận đã nhận tiền</button><button class="button button-outline-danger" type="button" data-order-action="cancel">Hủy đơn chờ</button></div>`:'';
    root.innerHTML=`<div class="page-heading detail-heading"><div><p class="eyebrow">CHI TIẾT ĐƠN HÀNG</p><h1>${ui.escape(order.code)}</h1><p class="subtitle">${demo.formatDate(order.createdAt)}</p></div><div class="detail-status">${demo.badge(order.status)}</div></div>
      <div class="detail-grid"><section class="detail-card"><h2>Sản phẩm trong đơn <span class="subtitle">(${count} món)</span></h2>${items}<div class="detail-total"><span>Tổng thanh toán</span><strong>${ui.money(order.total)}</strong></div></section><div><section class="detail-card"><h2>Thông tin đơn</h2><dl class="info-list"><div><dt>Người bán</dt><dd>${ui.escape(order.sellerName)}</dd></div><div><dt>Tên đăng nhập</dt><dd>${ui.escape(order.sellerUsername)}</dd></div><div><dt>Thanh toán</dt><dd>${demo.methodLabel(order.method)}</dd></div><div><dt>Trạng thái</dt><dd>${demo.statusLabel(order.status)}</dd></div></dl></section><section class="detail-card"><h2>Thanh toán</h2><p class="detail-callout ${order.status==='completed'?'success':order.status==='canceled'?'canceled':''}">${message}</p>${paymentInfo}${qr}</section></div></div>`;
  }
  root.addEventListener('click',event=>{
    const button=event.target.closest('[data-order-action]');
    if (!button||getOrder()?.status!=='pending') return;
    action=button.dataset.orderAction;
    document.querySelector('#order-action-title').textContent=action==='complete'?'Xác nhận đã nhận tiền?':'Hủy đơn đang chờ?';
    document.querySelector('#order-action-message').textContent=action==='complete'?'Trong hệ thống thật, cần kiểm tra tiền đã vào tài khoản trước khi xác nhận. Ở bản thử này, thao tác chỉ đánh dấu đơn mẫu là Hoàn tất.':'Đơn mẫu sẽ được đánh dấu Đã hủy. Bản thử chưa mô phỏng hoàn kho.';
    const confirm=document.querySelector('#confirm-order-action');
    confirm.textContent=action==='complete'?'Xác nhận minh họa':'Hủy đơn minh họa';
    confirm.className=`button ${action==='complete'?'button-primary':'button-danger'}`;
    document.querySelector('#order-action-error').textContent='';dialog.showModal();
  });
  document.querySelector('#confirm-order-action').addEventListener('click',()=>{
    const current=getOrder();
    if (!current||current.status!=='pending') {dialog.close();render();return;}
    const status=action==='complete'?'completed':'canceled';
    const next=demo.orders.get().map(o=>o.id===orderId?{...o,status,confirmedAt:status==='completed'?new Date().toISOString():null}:o);
    if (!demo.orders.save(next)) {document.querySelector('#order-action-error').textContent='Chưa lưu được dữ liệu thử. Bạn kiểm tra quyền lưu của trình duyệt.';return;}
    dialog.close();render();ui.toast(status==='completed'?'Đã hoàn tất đơn minh họa.':'Đã hủy đơn minh họa.');
  });
  render();
})();
