const CATS = ["Туристичне спорядження", "Одяг і взуття для активного відпочинку", "Товари для кемпінгу"];
const img = (k, n) => `https://loremflickr.com/400/300/${k}?lock=${n}`;
const P = (id,name,photo,desc,category,maker,material,purpose,weight,price) =>
  ({id,name,photo,desc,category,maker,material,purpose,weight,price});

const DEFAULTS = [
  P(1,"Рюкзак туристичний 65 л",img("backpack",1),"Місткий рюкзак із жорсткою спинкою та дощовиком для багатоденних походів.",CATS[0],"Deuter","Нейлон Cordura","Похід",2.1,3200),
  P(2,"Бінокль 10x42",img("binoculars",2),"Водозахисний бінокль із чітким зображенням для спостережень у горах.",CATS[0],"Bresser","Алюміній, скло","Похід",0.75,2750),
  P(3,"Трекінгові палиці (пара)",img("trekking,pole",3),"Телескопічні палиці з амортизацією та пробковими рукоятками.",CATS[0],"Black Diamond","Алюміній 7075","Похід",0.5,1450),
  P(4,"Налобний ліхтар 300 лм",img("headlamp",4),"Легкий акумуляторний ліхтар з червоним режимом світла.",CATS[0],"Petzl","Пластик ABS","Альпінізм",0.09,980),
  P(5,"Страхувальна система",img("climbing,harness",5),"Регульована обв'язка для скелелазіння та альпінізму.",CATS[0],"Climbing Technology","Поліестер","Альпінізм",0.45,2100),
  P(6,"Флісова куртка жіноча",img("fleece,jacket",6),"Тепла фліска, що швидко сохне та добре відводить вологу.",CATS[1],"Columbia","Поліестер (фліс)","Похід",0.42,1650),
  P(7,"Мембранна куртка",img("rain,jacket",7),"Вітро- та водонепроникна куртка для складних погодних умов.",CATS[1],"The North Face","Gore-Tex","Альпінізм",0.62,6900),
  P(8,"Трекінгові черевики",img("hiking,boots",8),"Черевики з підошвою Vibram та міцною фіксацією щиколотки.",CATS[1],"Salomon","Шкіра, Gore-Tex","Похід",1.3,4800),
  P(9,"Термобілизна",img("thermal,underwear",9),"Комплект термобілизни з мериносової вовни на холодну погоду.",CATS[1],"Icebreaker","Вовна мериноса","Кемпінг",0.35,2400),
  P(10,"Гірські черевики",img("mountaineering,boots",10),"Жорсткі черевики під кішки для висотних сходжень.",CATS[1],"La Sportiva","Шкіра, Vibram","Альпінізм",1.9,9500),
  P(11,"Намет 3-місний",img("camping,tent",11),"Двошаровий намет із тамбуром та герметичними швами.",CATS[2],"Coleman","Поліестер 190T","Кемпінг",3.4,5200),
  P(12,"Спальний мішок -10°C",img("sleeping,bag",12),"Мішок-кокон із комфортною температурою до -5°C.",CATS[2],"Pinguin","Нейлон, синтепон","Кемпінг",1.5,2300),
  P(13,"Набір туристичного посуду",img("camping,cookware",13),"Казанки, чайник та столові прилади, що складаються докупи.",CATS[2],"Fire-Maple","Анодований алюміній","Кемпінг",1.1,1350),
  P(14,"Газовий пальник",img("camping,stove",14),"Компактний пальник із п'єзозапалюванням для швидкого кип'ятіння.",CATS[2],"Kovea","Нержавіюча сталь","Похід",0.08,620),
  P(15,"Тент камуфляжний 3x3 м",img("tarp,camouflage",15),"Універсальний тент із люверсами для укриття від дощу й сонця.",CATS[2],"Mil-Tec","Поліестер з покриттям PU","Риболовля",0.9,780),
];

let products = JSON.parse(localStorage.getItem("rukzak_products") || "null") || DEFAULTS;
const save = () => localStorage.setItem("rukzak_products", JSON.stringify(products));
const $ = id => document.getElementById(id);
const state = { cat: "", hl: null };
const FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" fill="#999" font-size="20" text-anchor="middle">Фото відсутнє</text></svg>');
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function fillSelects() {
  const keep = { p: $("purpose").value, m: $("maker").value };
  const uniq = k => [...new Set(products.map(p => p[k]))].sort();
  $("purpose").innerHTML = '<option value="">Усі</option>' + uniq("purpose").map(v => `<option>${esc(v)}</option>`).join("");
  $("maker").innerHTML = '<option value="">Усі</option>' + uniq("maker").map(v => `<option>${esc(v)}</option>`).join("");
  $("purpose").value = keep.p; $("maker").value = keep.m;
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
    (!q || [p.name, p.category, p.maker].some(v => v.toLowerCase().includes(q))) &&
    (isNaN(min) || p.price >= min) && (isNaN(max) || p.price <= max) &&
    (!$("purpose").value || p.purpose === $("purpose").value) &&
    (!$("maker").value || p.maker === $("maker").value));
}

function render() {
  renderCats();
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
      <div class="ops"><button class="btn" data-edit="${p.id}">Редагувати</button><button class="btn" data-del="${p.id}">Видалити</button></div>
    </div>`).join("");
}

function showExtreme(kind) {
  if (!products.length) return;
  const p = products.reduce((a, b) => (kind === "max" ? b.price > a.price : b.price < a.price) ? b : a);
  state.cat = ""; state.hl = p.id;
  ["q","pMin","pMax","purpose","maker"].forEach(i => $(i).value = "");
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
  $("modal").hidden = false;
}

$("form").addEventListener("submit", e => {
  e.preventDefault();
  const id = $("f_id").value;
  const data = {
    name: $("f_name").value.trim(), photo: $("f_photo").value.trim() || FALLBACK,
    desc: $("f_desc").value.trim(), category: $("f_cat").value, maker: $("f_maker").value.trim(),
    material: $("f_mat").value.trim(), purpose: $("f_purpose").value.trim(),
    weight: parseFloat($("f_weight").value), price: parseFloat($("f_price").value)
  };
  if (id) products = products.map(p => p.id == id ? { ...p, ...data } : p);
  else products.push({ id: Date.now(), ...data });
  save(); $("modal").hidden = true; fillSelects(); render();
});

$("cancel").onclick = () => $("modal").hidden = true;
$("addBtn").onclick = () => openModal();
$("cats").addEventListener("click", e => {
  const c = e.target.closest("[data-cat]"); if (!c) return;
  state.cat = state.cat === c.dataset.cat ? "" : c.dataset.cat; state.hl = null;
  render(); $("listTitle").scrollIntoView({ behavior: "smooth" });
});
$("list").addEventListener("click", e => {
  const ed = e.target.dataset.edit, del = e.target.dataset.del;
  if (ed) openModal(products.find(p => p.id == ed));
  if (del && confirm("Видалити цей товар?")) { products = products.filter(p => p.id != del); save(); fillSelects(); render(); }
});
["q","pMin","pMax","purpose","maker"].forEach(i => $(i).addEventListener("input", () => { state.hl = null; render(); }));
$("qBtn").onclick = render;
$("maxBtn").onclick = () => showExtreme("max");
$("minBtn").onclick = () => showExtreme("min");
$("reset").onclick = () => { ["q","pMin","pMax","purpose","maker"].forEach(i => $(i).value = ""); state.cat = ""; state.hl = null; $("extInfo").textContent = ""; render(); };
["logo","homeLink"].forEach(i => $(i).onclick = e => { e.preventDefault(); $("reset").click(); });

fillSelects(); render();
