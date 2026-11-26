const CATS = ["Туристичне спорядження", "Одяг і взуття для активного відпочинку", "Товари для кемпінгу"];
const img = (k, n) => `https://loremflickr.com/400/300/${k}?lock=${n}`;
const P = (id,name,photo,desc,category,maker,material,purpose,weight,price) =>
  ({id,name,photo,desc,category,maker,material,purpose,weight,price});

const DEFAULTS = [
  P(1,"Рюкзак туристичний 65 л","images/backpack-65l.jpg","Місткий рюкзак із жорсткою спинкою та дощовиком для багатоденних походів.",CATS[0],"Deuter","Нейлон Cordura","Похід",2.1,3200),
  P(2,"Бінокль 10x42","images/binoculars-10x42.jpg","Водозахисний бінокль із чітким зображенням для спостережень у горах.",CATS[0],"Bresser","Алюміній, скло","Похід",0.75,2750),
  P(3,"Трекінгові палиці (пара)","images/trekking-poles.jpg","Телескопічні палиці з амортизацією та пробковими рукоятками.",CATS[0],"Black Diamond","Алюміній 7075","Похід",0.5,1450),
  P(4,"Налобний ліхтар 300 лм","images/headlamp-300lm.jpg","Легкий акумуляторний ліхтар з червоним режимом світла.",CATS[0],"Petzl","Пластик ABS","Альпінізм",0.09,980),
  P(5,"Страхувальна система","images/climbing-harness.jpg","Регульована обв'язка для скелелазіння та альпінізму.",CATS[0],"Climbing Technology","Поліестер","Альпінізм",0.45,2100),
  P(6,"Флісова куртка жіноча","images/fleece-jacket-women.jpg","Тепла фліска, що швидко сохне та добре відводить вологу.",CATS[1],"Columbia","Поліестер (фліс)","Похід",0.42,1650),
  P(7,"Мембранна куртка","images/membrane-jacket.jpg","Вітро- та водонепроникна куртка для складних погодних умов.",CATS[1],"The North Face","Gore-Tex","Альпінізм",0.62,6900),
  P(8,"Трекінгові черевики","images/trekking-boots.jpg","Черевики з підошвою Vibram та міцною фіксацією щиколотки.",CATS[1],"Salomon","Шкіра, Gore-Tex","Похід",1.3,4800),
  P(9,"Термобілизна","images/thermal-underwear.jpg","Комплект термобілизни з мериносової вовни на холодну погоду.",CATS[1],"Icebreaker","Вовна мериноса","Кемпінг",0.35,2400),
  P(10,"Гірські черевики","images/mountain-boots.jpg","Жорсткі черевики під кішки для висотних сходжень.",CATS[1],"La Sportiva","Шкіра, Vibram","Альпінізм",1.9,9500),
  P(11,"Намет 3-місний","images/tent-3-person.jpg","Двошаровий намет із тамбуром та герметичними швами.",CATS[2],"Coleman","Поліестер 190T","Кемпінг",3.4,5200),
  P(12,"Спальний мішок -10°C","images/sleeping-bag-minus-10c.jpg","Мішок-кокон із комфортною температурою до -5°C.",CATS[2],"Pinguin","Нейлон, синтепон","Кемпінг",1.5,2300),
  P(13,"Набір туристичного посуду","images/camping-cookware-set.jpg","Казанки, чайник та столові прилади, що складаються докупи.",CATS[2],"Fire-Maple","Анодований алюміній","Кемпінг",1.1,1350),
  P(14,"Газовий пальник","images/gas-burner.jpg","Компактний пальник із п'єзозапалюванням для швидкого кип'ятіння.",CATS[2],"Kovea","Нержавіюча сталь","Похід",0.08,620),
  P(15,"Тент камуфляжний 3x3 м","images/camouflage-tarp.jpg","Універсальний тент із люверсами для укриття від дощу й сонця.",CATS[2],"Mil-Tec","Поліестер з покриттям PU","Риболовля",0.9,780),
];

let products = JSON.parse(localStorage.getItem("rukzak_products_v2") || "null") || DEFAULTS;
const save = () => localStorage.setItem("rukzak_products_v2", JSON.stringify(products));
const $ = id => document.getElementById(id);
let cart = JSON.parse(localStorage.getItem("rukzak_cart") || "[]");
const state = { cat: "", hl: null };
const MIN_ITEMS = 5, MAX_ITEMS = 10;
let uploaded = "";
const count = c => products.filter(p => p.category === c).length;
const FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" fill="#999" font-size="20" text-anchor="middle">Фото відсутнє</text></svg>');
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function fillSelects() {
  const keep = $("maker").value;
  const makers = [...new Set(products.map(p => p.maker))].sort();
  $("maker").innerHTML = '<option value="">Усі</option>' + makers.map(v => `<option>${esc(v)}</option>`).join("");
  $("maker").value = makers.includes(keep) ? keep : "";
  $("purposes").innerHTML = [...new Set(products.map(p => p.purpose))].sort().map(v => `<option value="${esc(v)}">`).join("");
  $("f_cat").innerHTML = CATS.map(c => `<option>${c}</option>`).join("");
}

function renderCats() {
  $("cats").innerHTML = CATS.map(c => {
    const items = products.filter(p => p.category === c);
    return `<div class="card ${state.cat === c ? "active" : ""}" data-cat="${c}">
      <img src="${items[0] ? esc(items[0].photo) : FALLBACK}" alt="" onerror="this.src='${FALLBACK}'">
      <div class="b"><span class="t">${c}</span><span class="meta">Товарів: ${items.length}</span></div></div>`;
  }).join("");
}

function filtered() {
  const q = $("q").value.trim().toLowerCase();
  const min = parseFloat($("pMin").value), max = parseFloat($("pMax").value);
  return products.filter(p =>
    (!state.cat || p.category === state.cat) &&
    (!q || (($("scope").value === "all" ? [p.name, p.category, p.maker] : [p[$("scope").value]]).some(v => v.toLowerCase().includes(q)))) &&
    (isNaN(min) || p.price >= min) && (isNaN(max) || p.price <= max) &&
    (!$("maker").value || p.maker === $("maker").value));
}

function render() {
  renderCats(); updateCartBtn();
  const list = filtered();
  const prices = products.map(p => p.price);
  const mx = Math.max(...prices), mn = Math.min(...prices);
  $("listTitle").textContent = state.cat || "Усі товари";
  $("empty").hidden = list.length > 0;
  $("list").innerHTML = list.map(p => `
    <div class="card ${state.hl === p.id ? "hl" : ""}">
      <img src="${esc(p.photo)}" alt="${esc(p.name)}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK}'">
      <div class="b">
        ${p.price === mx ? '<span class="tag">Найдорожчий</span>' : ""}${p.price === mn ? '<span class="tag min">Найдешевший</span>' : ""}
        <span class="name">${esc(p.name)}</span>
        <span class="desc">${esc(p.desc)}</span>
        <span class="meta">Категорія: ${esc(p.category)}<br>Виробник: ${esc(p.maker)}<br>Матеріал: ${esc(p.material)}<br>Призначення: ${esc(p.purpose)}<br>Вага: ${p.weight} кг</span>
        <span class="price">${p.price.toLocaleString("uk-UA")} грн</span>
      </div>
      <div class="ops"><button class="btn dark" data-add="${p.id}">У кошик</button><button class="btn" data-edit="${p.id}">Редагувати</button><button class="btn" data-del="${p.id}">Видалити</button></div>
    </div>`).join("");
}

function showExtreme(kind) {
  if (!products.length) return;
  const p = products.reduce((a, b) => (kind === "max" ? b.price > a.price : b.price < a.price) ? b : a);
  state.cat = ""; state.hl = p.id;
  ["q","pMin","pMax","maker","scope"].forEach(i => $(i).value = "");
  $("scope").value = "all";
  $("extInfo").textContent = `${kind === "max" ? "Найдорожчий" : "Найдешевший"}: ${p.name} — ${p.price} грн`;
  render();
  document.querySelector(".card.hl")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function openModal(p) {
  $("mTitle").textContent = p ? "Редагувати товар" : "Додати товар";
  $("f_id").value = p ? p.id : "";
  $("f_name").value = p?.name || ""; $("f_photo").value = p?.photo || "";
  $("f_desc").value = p?.desc || ""; $("f_cat").value = p?.category || CATS[0];
  $("f_maker").value = p?.maker || ""; $("f_mat").value = p?.material || "";
  $("f_purpose").value = p?.purpose || ""; $("f_weight").value = p?.weight ?? "";
  $("f_price").value = p?.price ?? "";
  uploaded = ""; $("f_file").value = "";
  $("modal").hidden = false;
}

$("form").addEventListener("submit", e => {
  e.preventDefault();
  const id = $("f_id").value;
  const data = {
    name: $("f_name").value.trim(), photo: uploaded || $("f_photo").value.trim() || FALLBACK,
    desc: $("f_desc").value.trim(), category: $("f_cat").value, maker: $("f_maker").value.trim(),
    material: $("f_mat").value.trim(), purpose: $("f_purpose").value.trim(),
    weight: parseFloat($("f_weight").value), price: parseFloat($("f_price").value)
  };
  const old = id ? products.find(p => p.id == id) : null;
  if (!old && count(data.category) >= MAX_ITEMS) return alert(`У категорії «${data.category}» вже ${MAX_ITEMS} товарів — це максимум.`);
  if (old && old.category !== data.category) {
    if (count(data.category) >= MAX_ITEMS) return alert(`У категорії «${data.category}» вже ${MAX_ITEMS} товарів — це максимум.`);
    if (count(old.category) <= MIN_ITEMS) return alert(`У категорії «${old.category}» має лишитися не менше ${MIN_ITEMS} товарів.`);
  }
  if (id) products = products.map(p => p.id == id ? { ...p, ...data } : p);
  else products.push({ id: Date.now(), ...data });
  save(); $("modal").hidden = true; fillSelects(); render();
});

$("f_file").addEventListener("change", e => {
  const file = e.target.files[0]; if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    const im = new Image();
    im.onload = () => {
      const k = Math.min(1, 600 / im.width), c = document.createElement("canvas");
      c.width = im.width * k; c.height = im.height * k;
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      uploaded = c.toDataURL("image/jpeg", 0.85);
    };
    im.src = r.result;
  };
  r.readAsDataURL(file);
});
$("cancel").onclick = () => $("modal").hidden = true;
$("addBtn").onclick = () => openModal();
$("cats").addEventListener("click", e => {
  const c = e.target.closest("[data-cat]"); if (!c) return;
  state.cat = state.cat === c.dataset.cat ? "" : c.dataset.cat; state.hl = null;
  render(); $("listTitle").scrollIntoView({ behavior: "smooth" });
});
$("list").addEventListener("click", e => {
  const ed = e.target.dataset.edit, del = e.target.dataset.del, add = e.target.dataset.add;
  if (add) addToCart(add);
  if (ed) openModal(products.find(p => p.id == ed));
  if (del) {
    const p = products.find(x => x.id == del);
    if (count(p.category) <= MIN_ITEMS) return alert(`У категорії «${p.category}» має лишитися не менше ${MIN_ITEMS} товарів. Спочатку додайте новий товар.`);
  }
  if (del && confirm("Видалити цей товар?")) { products = products.filter(p => p.id != del); cart = cart.filter(i => i.id != del); saveCart(); save(); fillSelects(); render(); }
});
["q","pMin","pMax","maker","scope"].forEach(i => $(i).addEventListener("input", () => { state.hl = null; render(); }));
$("qBtn").onclick = render;
$("maxBtn").onclick = () => showExtreme("max");
$("minBtn").onclick = () => showExtreme("min");
$("reset").onclick = () => { ["q","pMin","pMax","maker","scope"].forEach(i => $(i).value = ""); state.cat = ""; state.hl = null; $("extInfo").textContent = ""; render(); };
["logo","homeLink"].forEach(i => $(i).onclick = e => { e.preventDefault(); $("reset").click(); });

fillSelects(); render();

/* ---------- Кошик ---------- */
function saveCart() { localStorage.setItem("rukzak_cart", JSON.stringify(cart)); }
function cartRows() { return cart.map(i => ({ p: products.find(x => x.id == i.id), qty: i.qty })).filter(r => r.p); }
function cartSum() { return cartRows().reduce((s, r) => s + r.p.price * r.qty, 0); }
function updateCartBtn() {
  const n = cartRows().reduce((s, r) => s + r.qty, 0);
  $("cartBtn").textContent = `🛒 Товарів: ${n} (${cartSum().toLocaleString("uk-UA")} грн)`;
}
function addToCart(id) {
  const it = cart.find(i => i.id == id);
  if (it) it.qty++; else cart.push({ id: +id, qty: 1 });
  saveCart(); updateCartBtn();
  const b = $("cartBtn"); b.classList.add("pulse"); setTimeout(() => b.classList.remove("pulse"), 400);
}
function renderCart() {
  const rows = cartRows();
  $("cartList").innerHTML = rows.length ? rows.map(r => `
    <div class="crow">
      <img src="${esc(r.p.photo)}" alt="" onerror="this.src='${FALLBACK}'">
      <div class="ci"><b>${esc(r.p.name)}</b><br><span class="meta">${r.p.price.toLocaleString("uk-UA")} грн</span></div>
      <div class="qty"><button type="button" data-dec="${r.p.id}">−</button><span>${r.qty}</span><button type="button" data-inc="${r.p.id}">+</button></div>
      <div class="cs">${(r.p.price * r.qty).toLocaleString("uk-UA")} грн</div>
      <button type="button" class="x" data-rm="${r.p.id}" title="Видалити">✕</button>
    </div>`).join("") : '<p class="empty">Кошик порожній.</p>';
  $("cartTotal").textContent = cartSum().toLocaleString("uk-UA") + " грн";
  $("orderFields").hidden = !rows.length;
  updateCartBtn();
}
function openCart() { $("orderDone").hidden = true; $("orderDone").innerHTML = ""; renderCart(); $("cartModal").hidden = false; }
const HINTS = {
  "Готівкою при отриманні": "Оплата готівкою кур'єру або у відділенні при отриманні.",
  "Карткою онлайн (Visa / Mastercard)": "Після оформлення ви отримаєте посилання для оплати карткою.",
  "Безготівковий розрахунок (за рахунком)": "Рахунок для оплати буде надіслано менеджером.",
  "Післяплата (Нова Пошта)": "Оплата при отриманні у відділенні Нової Пошти (комісія перевізника за послугу)."
};
function updateHint() { $("payHint").textContent = HINTS[document.querySelector('input[name="pay"]:checked').value]; }

$("cartBtn").onclick = openCart;
$("cartLink").onclick = e => { e.preventDefault(); openCart(); };
$("cartClose").onclick = () => $("cartModal").hidden = true;
document.querySelectorAll('input[name="pay"]').forEach(r => r.addEventListener("change", updateHint));
$("cartList").addEventListener("click", e => {
  const d = e.target.dataset, id = d.inc || d.dec || d.rm; if (!id) return;
  const it = cart.find(i => i.id == id); if (!it) return;
  if (d.inc) it.qty++;
  if (d.dec) it.qty = Math.max(1, it.qty - 1);
  if (d.rm) cart = cart.filter(i => i.id != id);
  saveCart(); renderCart();
});
$("orderForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!cartRows().length) return;
  const pay = document.querySelector('input[name="pay"]:checked').value;
  const num = "№" + Date.now().toString().slice(-6), sum = cartSum().toLocaleString("uk-UA");
  const name = esc($("o_name").value.trim());
  cart = []; saveCart(); updateCartBtn();
  $("cartList").innerHTML = ""; $("orderFields").hidden = true;
  $("cartTotal").textContent = "0 грн";
  $("orderDone").innerHTML = `<p class="ok">✅ Дякуємо, ${name}! Замовлення ${num} прийнято.</p><p>Сума: <b>${sum} грн</b><br>Спосіб оплати: <b>${esc(pay)}</b></p><button type="button" class="btn dark" id="doneClose">Закрити</button>`;
  $("orderDone").hidden = false;
  $("doneClose").onclick = () => $("cartModal").hidden = true;
  $("orderForm").reset(); updateHint();
});
updateHint(); updateCartBtn();
