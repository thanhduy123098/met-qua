/* Presentation only. No network, credentials or transaction handling. */
(()=>{
const paths={"store": "<path d=\"M3 10v11h18V10M2 10l2-7h16l2 7M2 10a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0M9 21v-7h6v7\"/>", "search": "<circle cx=\"10.5\" cy=\"10.5\" r=\"6.5\"/><path d=\"m16 16 5 5\"/>", "scan": "<path d=\"M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5M7 8v8M10 8v8M14 8v8M17 8v8\"/>", "back": "<path d=\"M20 12H4m6-6-6 6 6 6\"/>", "arrow": "<path d=\"M4 12h16m-6-6 6 6-6 6\"/>", "rotate": "<path d=\"M20 8a8 8 0 1 0 0 8M20 3v5h-5\"/>", "star": "<path d=\"m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z\"/>", "box": "<path d=\"m12 3 9 5v9l-9 5-9-5V8l9-5ZM3 8l9 5 9-5M12 13v9M7.5 5.5l9 5\"/>", "bottle": "<path d=\"M9 3h6v5l3 4v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-8l3-4V3ZM9 6h6M6 14h12M6 18h12\"/>", "bread": "<path d=\"M4 13C2 8 9 2 15 3c5 1 8 5 5 10l-4 6c-2 3-9 3-12-1l0-5ZM9 6l3 3M14 5l3 3M6 10l3 3\"/>", "egg": "<path d=\"M20 14a8 8 0 1 1-16 0C4 8 9 2 12 2s8 6 8 12Z\"/>", "bag": "<path d=\"M5 7h14l2 14H3L5 7ZM8 8V6a4 4 0 0 1 8 0v2\"/>", "coffee": "<path d=\"M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8ZM17 9h2a3 3 0 0 1 0 6h-2M7 3v2M11 2v3M15 3v2\"/>", "noodles": "<path d=\"M3 11h18l-3 10H6L3 11ZM7 11V5M11 11V3M15 11V4M7 7h11M3 15h18\"/>", "tissue": "<path d=\"M3 10h18v11H3V10ZM7 10l-2-6h10l4 6M9 14h6\"/>", "cart": "<path d=\"M2 3h3l3 13h11l3-9H6M9 21h.01M18 21h.01\"/><circle cx=\"9\" cy=\"20\" r=\"1\"/><circle cx=\"18\" cy=\"20\" r=\"1\"/>", "trash": "<path d=\"M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7\"/>", "orders": "<path d=\"M5 3h14v19l-4-2-3 2-3-2-4 2V3ZM9 8h6M9 12h6M9 16h3\"/>", "user": "<circle cx=\"12\" cy=\"7\" r=\"4\"/><path d=\"M4 22v-3a8 8 0 0 1 16 0v3\"/>", "lock": "<rect x=\"5\" y=\"10\" width=\"14\" height=\"11\" rx=\"3\"/><path d=\"M8 10V7a4 4 0 0 1 8 0v3M12 14v3\"/>", "qr": "<path d=\"M3 3h6v6H3V3ZM15 3h6v6h-6V3ZM3 15h6v6H3v-6ZM15 15h2v2h-2v-2ZM19 15h2v6h-6v-2\"/>", "money": "<rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"3\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M6 12h.01M18 12h.01\"/>"};
const productNames={bread:'bread',egg:'egg',bag:'bag',water:'bottle',milk:'bottle',oil:'bottle',shampoo:'bottle',coffee:'coffee',noodles:'noodles',tissue:'tissue'};
const icon=name=>'<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+(paths[name]||paths.box)+'</svg>';
window.GlassUI={icon,productIcon:id=>icon(productNames[id]||'box')};
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-ui-icon]').forEach(el=>{el.innerHTML=icon(el.dataset.uiIcon)});
 const backdrop=document.getElementById('payment-backdrop');
 if(!backdrop)return;
 const open=document.getElementById('open-payment'),close=document.getElementById('close-payment');
 open?.addEventListener('click',()=>{if(!backdrop.hidden){document.body.classList.add('payment-open');close.focus()}});
 const dismiss=()=>{backdrop.hidden=true;document.body.classList.remove('payment-open');open?.focus()};
 close?.addEventListener('click',dismiss);
 backdrop.addEventListener('click',event=>{if(event.target===backdrop)dismiss()});
 document.addEventListener('keydown',event=>{
  if(backdrop.hidden)return;
  if(event.key==='Escape'){event.preventDefault();dismiss()}
  if(event.key==='Tab'){
   const controls=[...backdrop.querySelectorAll('button,input,select,a[href]')].filter(el=>!el.disabled&&el.getClientRects().length);
   const first=controls[0],last=controls.at(-1);
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
 });
});
})();
