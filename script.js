let cart = JSON.parse(localStorage.getItem('cart')) || [];

// -----------------------------
// Добавление товара
// -----------------------------
function addToCart(name, price, imgSrc){
  const existing = cart.find(i => i.name === name);
  if(existing){
    existing.qty++;
  } else {
    cart.push({name:name, price:price, qty:1, img: imgSrc});
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

// -----------------------------
// Летящий товар в корзину
// -----------------------------
function buyAnimation(btnElement, name, price){
  const productDiv = btnElement.parentElement;
  const img = productDiv.querySelector('img');
  const flyingImg = img.cloneNode(true);

  const rect = img.getBoundingClientRect();
  flyingImg.style.position = 'fixed';
  flyingImg.style.left = rect.left + 'px';
  flyingImg.style.top = rect.top + 'px';
  flyingImg.style.width = rect.width + 'px';
  flyingImg.style.height = rect.height + 'px';
  flyingImg.style.transition = 'all 0.8s ease-in-out';
  flyingImg.style.zIndex = 1000;
  document.body.appendChild(flyingImg);

  const cartIcon = document.querySelector('.nav a[href="cart.html"]');
  const cartRect = cartIcon.getBoundingClientRect();

  setTimeout(() => {
    flyingImg.style.left = cartRect.left + 'px';
    flyingImg.style.top = cartRect.top + 'px';
    flyingImg.style.width = '20px';
    flyingImg.style.height = '20px';
    flyingImg.style.opacity = '0.3';
  }, 50);

  setTimeout(() => {
    document.body.removeChild(flyingImg);
    const imgSrc = img.src;
    addToCart(name, price, imgSrc);
  }, 850);
}

// -----------------------------
// Изменение количества
// -----------------------------
function changeQty(index, delta){
  cart[index].qty += delta;
  if(cart[index].qty <= 0){
    cart.splice(index,1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

// -----------------------------
// Обновление корзины
// -----------------------------
function updateCart(){
  const c = document.getElementById('cart');
  if(!c) return;
  c.innerHTML = '';
  let total = 0;
  cart.forEach((item,index)=>{
    total += item.price * item.qty;
    c.innerHTML += `<div class="cart-item">
      <img src="${item.img}">
      <div>${item.name}</div>
      <div>${item.price} ₸ x ${item.qty}</div>
      <div>
        <button onclick="changeQty(${index},1)">+</button>
        <button onclick="changeQty(${index},-1)">-</button>
      </div>
    </div>`;
  });
  if(cart.length>0){
    c.innerHTML += `<strong>Итого: ${total} ₸</strong>`;
  } else {
    c.innerHTML = '<p>Корзина пуста</p>';
  }
}

// -----------------------------
// WhatsApp заказ
// -----------------------------
 function sendWhatsAppOrder(phone){
  if(cart.length===0){alert('Корзина пуста!'); return;}
  
  let msg = 'Сәлеметсіз бе, тапсырыс бергім келеді / Здравствуйте, хочу заказать:\n';
  cart.forEach(i=>{
    msg += `${i.name} — ${i.price} ₸ x${i.qty}\n`;
  });

  let address = prompt("Введите ваш адрес / мекенжайыңызды енгізіңіз:");
  if(!address) address = "Не указан";
  msg += `Адрес: ${address}`;

  // Кодируем текст для URL
  const encodedMsg = encodeURIComponent(msg);
  window.open(`https://wa.me/${+77058058106}?text=${encodedMsg}`, '_blank');
}



// -----------------------------
// Fade-in анимация
// -----------------------------
document.addEventListener("DOMContentLoaded", function(){
  document.querySelectorAll('.fade-in').forEach(el=>{
    el.style.opacity = 0;
    setTimeout(()=>{el.style.transition = "opacity 1s"; el.style.opacity = 1;},100);
  });
});

// -----------------------------
// Скролл наверх
// -----------------------------
function scrollTopFn(){window.scrollTo({top:0,behavior:'smooth'});}

// -----------------------------
// Переключение языков
// -----------------------------
const translations={
  ru:{home:"Главная",shop:"Магазин",about:" О нас",delivery:"Доставка",contacts:"Контакты",heroTitle:"Стильные футболки SkyStyle",heroText:"Минимализм и качество",goShop:"Перейти в магазин",cartTitle:"Корзина"},
  kz:{home:"Басты бет",shop:"Дүкен",about:"Біз туралы",delivery:"Жеткізу",contacts:"Байланыс",heroTitle:"Стильді футболкалар SkyStyle",heroText:"Минимализм және сапа",goShop:"Дүкенге өту",cartTitle:"Себет"},
  en:{home:"Home",shop:"Shop",about:"About",delivery:"Delivery",contacts:"Contacts",heroTitle:"Stylish T-Shirts SkyStyle",heroText:"Minimalism & Quality",goShop:"Go to Shop",cartTitle:"Cart"}
};

document.querySelectorAll('[data-lang-btn]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const lang=btn.dataset.langBtn;
    document.querySelectorAll('[data-lang]').forEach(el=>{
      const key=el.dataset.lang;
      if(translations[lang][key]) el.innerText=translations[lang][key];
    });
  });
});

// -----------------------------
// Инициализация корзины при старте
// -----------------------------
updateCart()    