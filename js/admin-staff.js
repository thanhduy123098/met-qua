(() => {
  const ui=window.AdminPrototype,demo=window.AdminDemo;
  const list=document.querySelector('#staff-list');
  const search=document.querySelector('#staff-search');
  const drawer=document.querySelector('#staff-drawer');
  const form=document.querySelector('#staff-form');
  const detailDialog=document.querySelector('#staff-detail-dialog');
  const statusDialog=document.querySelector('#staff-status-dialog');
  const collator=new Intl.Collator('vi',{sensitivity:'base'});
  let status='all',selectedId=null;
  const initials=name=>name.trim().split(/\s+/).filter((p,i,all)=>i===0||i===all.length-1).map(p=>p[0]).join('').toUpperCase();
  function render() {
    const staff=demo.staff.get();
    const q=ui.normalize(search.value);
    const filtered=staff.filter(p=>(status==='all'||p.status===status) && (!q||ui.normalize(p.displayName).includes(q)||ui.normalize(p.username).includes(q))).sort((a,b)=>collator.compare(a.displayName,b.displayName));
    document.querySelector('#staff-search-clear').hidden=!search.value;
    document.querySelectorAll('[data-staff-status]').forEach(button=>{
      const key=button.dataset.staffStatus;
      button.setAttribute('aria-pressed',String(key===status));
      button.querySelector('.filter-count').textContent=key==='all'?staff.length:staff.filter(p=>p.status===key).length;
    });
    document.querySelector('#staff-result-count').textContent=`Hiển thị ${filtered.length} / ${staff.length} nhân viên`;
    if (!filtered.length) {
      list.innerHTML=`<div class="empty-state"><span class="empty-icon">${ui.icon('users')}</span><h2>Không tìm thấy nhân viên</h2><p>Thử tên khác hoặc bỏ bộ lọc đang chọn.</p><button class="button" id="reset-staff-search" type="button">Bỏ tìm kiếm và bộ lọc</button></div>`;
      document.querySelector('#reset-staff-search').addEventListener('click',()=>{search.value='';status='all';render();});
      return;
    }
    list.innerHTML=filtered.map(p=>`<article class="staff-row" data-staff-id="${ui.escape(p.id)}"><button class="staff-main" type="button" data-staff-action="detail" aria-label="Xem nhân viên ${ui.escape(p.displayName)}"><span class="staff-avatar" aria-hidden="true">${ui.escape(initials(p.displayName))}</span><span><strong>${ui.escape(p.displayName)}</strong><small>${ui.escape(p.username)} · Nhân viên</small></span></button>${demo.badge(p.status)}<details class="row-actions"><summary class="icon-button" aria-label="Thao tác với ${ui.escape(p.displayName)}">${ui.icon('more')}</summary><div class="action-menu"><button type="button" data-staff-action="detail">${ui.icon('users')}Xem chi tiết</button><button type="button" class="${p.status==='active'?'danger-text':''}" data-staff-action="status">${ui.icon(p.status==='active'?'lock':'unlock')}${p.status==='active'?'Khóa tài khoản':'Mở khóa'}</button></div></details></article>`).join('');
  }
  search.addEventListener('input',render);
  document.querySelector('#staff-search-clear').addEventListener('click',()=>{search.value='';render();search.focus();});
  document.querySelectorAll('[data-staff-status]').forEach(button=>button.addEventListener('click',()=>{status=button.dataset.staffStatus;render();}));
  document.addEventListener('click',event=>document.querySelectorAll('.row-actions[open]').forEach(details=>{if(!details.contains(event.target))details.open=false;}));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('.row-actions[open]').forEach(details=>{details.open=false;details.querySelector('summary').focus();});});
  list.addEventListener('click',event=>{
    const button=event.target.closest('[data-staff-action]');
    if (!button) return;
    const row=button.closest('[data-staff-id]');
    const person=demo.staff.get().find(p=>p.id===row.dataset.staffId);
    if (!person) return;
    selectedId=person.id;row.querySelector('details').open=false;
    if (button.dataset.staffAction==='detail') {
      document.querySelector('#staff-detail-content').innerHTML=`<div class="staff-detail-person"><span class="staff-avatar" aria-hidden="true">${ui.escape(initials(person.displayName))}</span><div><strong id="staff-detail-title">${ui.escape(person.displayName)}</strong><small>Nhân viên bán hàng</small></div></div>${demo.badge(person.status)}<dl class="info-list staff-detail-list"><div><dt>Tên đăng nhập</dt><dd>${ui.escape(person.username)}</dd></div><div><dt>Vai trò</dt><dd>Nhân viên</dd></div><div><dt>Ngày tạo mẫu</dt><dd>${demo.formatDate(person.createdAt,false)}</dd></div></dl>`;
      detailDialog.showModal();
    } else {
      const locking=person.status==='active';
      document.querySelector('#staff-status-title').textContent=locking?'Khóa tài khoản?':'Mở khóa tài khoản?';
      document.querySelector('#staff-status-message').textContent=`${person.displayName} (${person.username}) sẽ được đánh dấu ${locking?'Đã khóa':'Đang hoạt động'} trong bản thử. Thao tác này chưa gắn với chức năng đăng nhập.`;
      document.querySelector('#staff-status-error').textContent='';
      const confirm=document.querySelector('#confirm-staff-status');
      confirm.textContent=locking?'Khóa tài khoản':'Mở khóa';confirm.className=`button ${locking?'button-danger':'button-primary'}`;
      statusDialog.showModal();
    }
  });
  document.querySelector('#confirm-staff-status').addEventListener('click',()=>{
    const person=demo.staff.get().find(p=>p.id===selectedId);
    if (!person) return;
    const nextStatus=person.status==='active'?'disabled':'active';
    if (!demo.staff.save(demo.staff.get().map(p=>p.id===selectedId?{...p,status:nextStatus}:p))) {document.querySelector('#staff-status-error').textContent='Chưa lưu được dữ liệu thử. Bạn kiểm tra quyền lưu của trình duyệt.';return;}
    render();statusDialog.close();ui.toast(nextStatus==='active'?'Đã mở khóa tài khoản mẫu.':'Đã khóa tài khoản mẫu.');
  });
  const keys=['name','username','password','confirm'];
  function clearErrors() {
    keys.forEach(key=>{document.querySelector(`#staff-${key}`).removeAttribute('aria-invalid');document.querySelector(`#staff-${key}-error`).textContent='';});
    document.querySelector('#staff-save-error').textContent='';
  }
  function hidePassword() {
    ['password','confirm'].forEach(key=>{document.querySelector(`#staff-${key}`).type='password';});
    document.querySelector('#toggle-staff-password').setAttribute('aria-pressed','false');
    document.querySelector('#toggle-staff-password').setAttribute('aria-label','Hiện mật khẩu mẫu');
  }
  document.querySelector('#toggle-staff-password').addEventListener('click',()=>{
    const show=document.querySelector('#staff-password').type==='password';
    ['password','confirm'].forEach(key=>{document.querySelector(`#staff-${key}`).type=show?'text':'password';});
    document.querySelector('#toggle-staff-password').setAttribute('aria-pressed',String(show));
    document.querySelector('#toggle-staff-password').setAttribute('aria-label',show?'Ẩn mật khẩu mẫu':'Hiện mật khẩu mẫu');
  });
  document.querySelector('#add-staff').addEventListener('click',()=>{form.reset();clearErrors();hidePassword();drawer.showModal();});
  drawer.addEventListener('close',()=>{form.reset();clearErrors();hidePassword();document.querySelector('#add-staff').focus();});
  form.addEventListener('submit',event=>{
    event.preventDefault();clearErrors();
    const displayName=document.querySelector('#staff-name').value.trim();
    const username=document.querySelector('#staff-username').value.trim().toLowerCase();
    const password=document.querySelector('#staff-password').value;
    const confirmation=document.querySelector('#staff-confirm').value;
    const errors={};
    if (!displayName||displayName.length>100) errors.name='Nhập tên hiển thị, tối đa 100 ký tự.';
    if (!/^[a-z0-9._-]{3,50}$/.test(username)) errors.username='Dùng 3–50 ký tự a–z, số hoặc dấu . _ -; không dùng @.';
    else if (demo.staff.get().some(p=>p.username===username)||username==='owner') errors.username='Tên đăng nhập mẫu này đã được sử dụng.';
    if (password.length<15||password.length>128) errors.password='Mật khẩu mẫu cần dài 15–128 ký tự.';
    if (password!==confirmation) errors.confirm='Mật khẩu nhập lại chưa khớp.';
    if (Object.keys(errors).length) {
      Object.entries(errors).forEach(([key,message])=>{document.querySelector(`#staff-${key}-error`).textContent=message;document.querySelector(`#staff-${key}`).setAttribute('aria-invalid','true');});
      document.querySelector(`#staff-${Object.keys(errors)[0]}`).focus();return;
    }
    const person={id:`trial-staff-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,displayName,username,status:'active',createdAt:new Date().toISOString()};
    if (!demo.staff.save([...demo.staff.get(),person])) {document.querySelector('#staff-save-error').textContent='Chưa lưu được dữ liệu thử. Bạn kiểm tra quyền lưu của trình duyệt.';return;}
    search.value='';status='all';render();form.reset();hidePassword();drawer.close();ui.toast('Đã thêm nhân viên minh họa. Mật khẩu không được lưu.');
  });
  render();
})();
