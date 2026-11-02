/* Disposable UI fixtures. No API, accounts, bank transfer or inventory mutation. */
(() => {
  const ui = window.AdminPrototype;
  const dayKey = (date = new Date()) => {
    const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
    const get = (type) => parts.find((p) => p.type === type).value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  };
  const shiftDay = (amount) => dayKey(new Date(new Date(`${dayKey()}T12:00:00+07:00`).getTime()+amount*86400000));
  const stamp = (days,time='09:00') => `${shiftDay(days)}T${time}:00+07:00`;
  const staffSeed = [
    {id:'staff01',username:'nv01',displayName:'Nguyễn Thanh An',status:'active',createdAt:stamp(-15)},
    {id:'staff02',username:'nv02',displayName:'Trần Minh Anh',status:'active',createdAt:stamp(-10)},
    {id:'staff03',username:'nv03',displayName:'Lê Khánh Linh',status:'disabled',createdAt:stamp(-7)},
    {id:'staff04',username:'nv04',displayName:'Phạm Quang Huy',status:'active',createdAt:stamp(-2)}
  ];
  const sellers = {owner:'Đỗ Thành Duy',nv01:'Nguyễn Thanh An',nv02:'Trần Minh Anh',nv03:'Lê Khánh Linh',nv04:'Phạm Quang Huy'};
  const item = (name,price,quantity) => ({name,price,quantity});
  const order = (id,days,time,status,method,sellerUsername,items,received=0) => {
    const total = items.reduce((sum,p) => sum+p.price*p.quantity,0);
    return {id:`order${id}`,code:`DEMO-${String(id).padStart(3,'0')}`,createdAt:stamp(days,time),status,method,sellerUsername,sellerName:sellers[sellerUsername],items,total,received:method==='cash' ? received : total,confirmedAt:status==='completed' ? stamp(days,time) : null};
  };
  const orderSeed = [
    order(1,0,'08:20','completed','cash','nv01',[item('Mì Hảo Hảo tôm chua cay',5000,2),item('Nước suối Lavie 500 ml',5000,1),item('Bánh mì',10000,1)],50000),
    order(2,0,'09:05','completed','vietqr','nv02',[item('Nước suối Lavie 500 ml',5000,3)]),
    order(3,0,'10:15','completed','cash','nv01',[item('Sữa tươi không đường',8000,3),item('Kẹo lẻ',2000,3)],50000),
    order(4,0,'11:40','completed','cash','owner',[item('Bánh mì',10000,2),item('Nước suối Lavie 500 ml',5000,4)],50000),
    order(5,0,'13:10','completed','vietqr','nv04',[item('Mì Hảo Hảo tôm chua cay',5000,3)]),
    order(6,0,'14:00','pending','vietqr','nv01',[item('Nước suối Lavie 500 ml',5000,1)]),
    order(7,0,'14:35','canceled','vietqr','nv02',[item('Bánh mì',10000,1)]),
    order(8,0,'15:10','pending','vietqr','nv04',[item('Gạo thơm 1 kg',18000,1)]),
    order(9,-1,'09:20','completed','cash','nv02',[item('Gạo thơm 1 kg',18000,1)],20000),
    order(10,-1,'16:05','completed','vietqr','nv03',[item('Dầu gội',22000,1)]),
    order(11,-2,'08:55','completed','cash','nv01',[item('Cà phê hòa tan',12000,1)],20000),
    order(12,-3,'14:10','canceled','vietqr','nv03',[item('Sữa tươi không đường',8000,2)]),
    order(13,-6,'11:30','completed','cash','nv04',[item('Dầu ăn 400 ml',25000,1)],50000),
    order(14,-12,'10:15','completed','vietqr','owner',[item('Xà phòng',11000,2)])
  ];
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const validDate = (value) => typeof value==='string' && Number.isFinite(Date.parse(value));
  const validStaff = (list) => Array.isArray(list) && list.every((p) => p && typeof p.id==='string' && typeof p.displayName==='string' && p.displayName.length>0 && p.displayName.length<=100 && /^[a-z0-9._-]{3,50}$/.test(p.username) && ['active','disabled'].includes(p.status) && validDate(p.createdAt)) && new Set(list.map(p=>p.id)).size===list.length && new Set(list.map(p=>p.username)).size===list.length;
  const validOrders = (list) => Array.isArray(list) && list.every((o) => o && typeof o.id==='string' && typeof o.code==='string' && validDate(o.createdAt) && ['completed','pending','canceled'].includes(o.status) && ['cash','vietqr'].includes(o.method) && typeof o.sellerUsername==='string' && typeof o.sellerName==='string' && Array.isArray(o.items) && o.items.length && o.items.every(p=>typeof p.name==='string' && Number.isSafeInteger(p.price) && p.price>=0 && Number.isSafeInteger(p.quantity) && p.quantity>0) && Number.isSafeInteger(o.total) && o.total===o.items.reduce((s,p)=>s+p.price*p.quantity,0) && Number.isSafeInteger(o.received) && o.received>=0 && (o.confirmedAt===null || validDate(o.confirmedAt))) && new Set(list.map(o=>o.id)).size===list.length;
  function store(name,seed,validate,project) {
    const key=`webpos-ui-trial-02-${name}`;
    let state=clone(seed);
    try {
      const loaded=JSON.parse(localStorage.getItem(key));
      if (loaded?.version===1 && validate(loaded.items)) state=loaded.items.map(project);
    } catch { /* Use sample fixtures when storage is unavailable. */ }
    return {
      get:()=>state,
      reset:()=>clone(seed),
      save:(items)=>{
        if (!validate(items)) return false;
        const clean=items.map(project);
        try { localStorage.setItem(key,JSON.stringify({version:1,items:clean})); state=clean; return true; }
        catch { return false; }
      }
    };
  }
  // Explicit field lists ensure passwords can never be persisted in staff fixtures.
  const staff=store('staff',staffSeed,validStaff,p=>({id:p.id,username:p.username,displayName:p.displayName,status:p.status,createdAt:p.createdAt}));
  const orders=store('orders',orderSeed,validOrders,o=>({id:o.id,code:o.code,createdAt:o.createdAt,status:o.status,method:o.method,sellerUsername:o.sellerUsername,sellerName:o.sellerName,items:o.items.map(p=>({name:p.name,price:p.price,quantity:p.quantity})),total:o.total,received:o.received,confirmedAt:o.confirmedAt}));
  const statusLabel = (status) => ({completed:'Hoàn tất',pending:'Chờ thanh toán',canceled:'Đã hủy',active:'Đang hoạt động',disabled:'Đã khóa'}[status] || status);
  const badge = (status) => `<span class="status-badge status-${status}"><span aria-hidden="true"></span>${statusLabel(status)}</span>`;
  const methodLabel = (method) => method==='cash' ? 'Tiền mặt' : 'VietQR';
  const formatDate = (date,withTime=true) => new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',day:'2-digit',month:'2-digit',year:'numeric',...(withTime ? {hour:'2-digit',minute:'2-digit',hour12:false} : {})}).format(new Date(date));
  window.AdminDemo={staff,orders,dayKey,shiftDay,badge,statusLabel,methodLabel,formatDate};
})();
