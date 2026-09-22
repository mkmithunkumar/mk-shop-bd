const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbztb6e3qOUbLVAtbhCY99zERZKxiolhSOxsU2it2fzocx_yAjDkh_Zkr321feTDvtWh/exec";
const WHATSAPP='8801722838801';
const products={
 rice:{name:'চালের গুঁড়া',price:120,image:'images/rice-powder.jpg'},
 'date-powder':{name:'খেজুরের গুড়ের গুঁড়া',price:280,image:'images/date-jaggery-powder.jpg'},
 'liquid-jaggery':{name:'খেজুরের ঝোলা গুড়',price:300,image:'images/liquid-jaggery.jpg'},
 patali:{name:'খেজুরের পাটালি গুড়',price:320,image:'images/patali-jaggery.jpg'}
};
let cart=JSON.parse(localStorage.getItem('mkshop_cart')||'{}');
const money=n=>'৳'+Number(n).toLocaleString('bn-BD');
function save(){localStorage.setItem('mkshop_cart',JSON.stringify(cart));renderCart()}
function add(id){cart[id]=(cart[id]||0)+1;save();openCart()}
function change(id,delta){cart[id]=(cart[id]||0)+delta;if(cart[id]<=0)delete cart[id];save()}
function total(){return Object.entries(cart).reduce((s,[id,q])=>s+products[id].price*q,0)}
function renderCart(){
 const box=document.getElementById('cartItems'),empty=document.getElementById('cartEmpty');box.innerHTML='';let count=0;
 Object.entries(cart).forEach(([id,q])=>{const p=products[id];count+=q;box.insertAdjacentHTML('beforeend',`<div class="cart-row"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><p>${money(p.price)} × ${q} = <strong>${money(p.price*q)}</strong></p><div class="qty"><button onclick="change('${id}',-1)">−</button><span>${q}</span><button onclick="change('${id}',1)">+</button><button class="remove" onclick="change('${id}',-${q})">মুছুন</button></div></div><span></span></div>`)});
 document.getElementById('cartCount').textContent=count;document.getElementById('cartTotal').textContent=money(total());empty.style.display=count?'none':'block';
}
function openCart(){document.getElementById('cartPanel').classList.add('open');document.getElementById('overlay').classList.add('show')}
function closeCart(){document.getElementById('cartPanel').classList.remove('open');document.getElementById('overlay').classList.remove('show')}
document.querySelectorAll('.add-btn').forEach(btn=>btn.addEventListener('click',e=>add(e.target.closest('.product-card').dataset.id)));
document.getElementById('cartBtn').addEventListener('click',openCart);document.getElementById('closeCart').addEventListener('click',closeCart);document.getElementById('overlay').addEventListener('click',closeCart);
document.getElementById('orderBtn').addEventListener('click',()=>{if(!Object.keys(cart).length){alert('আগে অন্তত একটি পণ্য কার্টে যোগ করুন।');return}let lines=['হ্যালো MK Shop BD, আমি নিচের পণ্যগুলো অর্ডার করতে চাই:', ''];Object.entries(cart).forEach(([id,q])=>{const p=products[id];lines.push(`• ${p.name} — ${q} কেজি — ${money(p.price*q)}`)});lines.push('',`মোট পণ্য মূল্য: ${money(total())}`,'নাম: ','ঠিকানা: ','মোবাইল: ','');window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`,'_blank')});
document.getElementById('year').textContent=new Date().getFullYear();renderCart();
