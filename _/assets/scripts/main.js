// ── Mobile menu ──
function toggleMenu(){
  const m=document.getElementById('mobile-menu');
  m.classList.toggle('open');
}

// ── Scroll animations ──
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible')}});
},{threshold:0.1});
document.querySelectorAll('.fade-up').forEach(el=>obs.observe(el));

// ── Sticky nav shadow ──
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('nav');
  nav.style.boxShadow=window.scrollY>50?'0 4px 30px rgba(74,0,0,0.4)':'none';
});

// ── Donate amount picker ──
function selectAmount(el,val){
  document.querySelectorAll('.amount-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  const inp=document.getElementById('donate-amount');
  if(val!=='0') inp.value=val; else{inp.value='';inp.focus();}
}

// ── Load YouTube stream ──
function loadStream(){
  document.getElementById('yt-embed').src='https://www.youtube.com/embed/live_stream?channel=UCsankatmochanhanumanmandir1366&autoplay=1';
  document.getElementById('yt-embed').style.display='block';
  document.getElementById('stream-placeholder').style.display='none';
}

// ── Donate button ──
const donateBtn = document.querySelector('.donate-submit');

if (donateBtn) {
  donateBtn.addEventListener('click', () => {
    const amt = document.getElementById('donate-amount').value;
    alert(
      'Thank you for your seva!\n\nPlease send Interac E-Transfer of $' +
      amt +
      ' CAD to:\ndonatesmhm@gmail.com\n\nOr call 647-334-8491.'
    );
  });
}
// ── POSTER SLIDER (MANUAL & AUTOMATIC, SEAMLESS INFINITE LOOP) ──
let currentSlide = 1;      // 1-indexed because a cloned "last" slide sits at position 0
let slideTimer;
let totalRealSlides = 0;
let isSliderTransitioning = false;

function setupInfiniteSlider() {
  const track = document.getElementById('sliderTrack');
  if (!track) return;

  const slides = Array.from(track.querySelectorAll('img'));
  totalRealSlides = slides.length;
  if (totalRealSlides === 0) return;

  // Clone the first and last real slides so the track always has a real-looking
  // slide to slide onto in either direction — no jump back to slide 1.
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[totalRealSlides - 1].cloneNode(true);
  firstClone.setAttribute('aria-hidden', 'true');
  lastClone.setAttribute('aria-hidden', 'true');

  track.insertBefore(lastClone, slides[0]);
  track.appendChild(firstClone);

  // Land on the first real slide (index 1, since the clone of the last slide is at index 0)
  currentSlide = 1;
  track.style.transition = 'none';
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  void track.offsetWidth; // force reflow so the transition-less jump applies immediately
  track.style.transition = '';

  track.addEventListener('transitionend', onSliderTransitionEnd);
}

function moveSlide(direction) {
  const track = document.getElementById('sliderTrack');
  if (!track || isSliderTransitioning) return;

  isSliderTransitioning = true;
  currentSlide += direction;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  startSlideTimer();
}

function onSliderTransitionEnd(e) {
  if (e.propertyName && e.propertyName !== 'transform') return;
  const track = document.getElementById('sliderTrack');
  if (!track) return;

  isSliderTransitioning = false;

  // Once we've visually landed on a clone, silently re-point to the matching
  // real slide with no transition — the motion itself never reverses.
  if (currentSlide >= totalRealSlides + 1) {
    currentSlide = 1;
    track.style.transition = 'none';
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    void track.offsetWidth;
    track.style.transition = '';
  } else if (currentSlide <= 0) {
    currentSlide = totalRealSlides;
    track.style.transition = 'none';
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    void track.offsetWidth;
    track.style.transition = '';
  }
}

function startSlideTimer() {
  const track = document.getElementById('sliderTrack');
  if (!track) return; 

  clearInterval(slideTimer);

  slideTimer = setInterval(() => {
    moveSlide(1);
  }, 4000);
}

function initInfiniteSlider() {
  const track = document.getElementById('sliderTrack');
  if (!track) return;
  setupInfiniteSlider();
  startSlideTimer();
}

// Start the automatic timer (and set up the loop) as soon as the page loads
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initInfiniteSlider);
} else {
  initInfiniteSlider();
}
  function filterGallery(year) {
    // 1. Update active styling on the buttons
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      btn.classList.remove('active');
      // If the button's onclick attribute matches the clicked year, make it active
      if(btn.getAttribute('onclick').includes(year)) {
        btn.classList.add('active');
      }
    });

    // 2. Show or Hide the Year Sections
    const yearSections = document.querySelectorAll('.year-section');
    yearSections.forEach(section => {
      if (year === 'all') {
        section.style.display = 'block'; // Show all
      } else {
        if (section.getAttribute('data-year') === year) {
          section.style.display = 'block'; // Show matching year
        } else {
          section.style.display = 'none'; // Hide other years
        }
      }
    });
  }
  // ═══════════════════════════════════════════════════════════
// SEVA ONLINE BOOKING (CALENDAR & PAYPAL INTEGRATION)
// ═══════════════════════════════════════════════════════════

var GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyVVpceVTVCI6vTuvNZB5ZzS9Ql9nflZPiUMvL8VENwd9ngH2ahvohap33BDZcgUGx2/exec";
var SECRET_TOKEN = "05DjNwOYrNf9RDXqb-j5fw";

var currentDate = new Date(2026, 8, 1);
var cart = [];
var bookedSet = new Set();
var itemsConfig = [];
var festivals = {};
var weeklyPujas = {};
var isLoading = false;
var lastSyncTime = null;
var jsonpCounter = 0;
var activeJsonp = {};
var paymentComplete = false;

var DEFAULT_ITEMS = [
  { id: "archana", name: "Daily Archana", price: 21, description: "Daily flower archana for selected deity", active: true },
  { id: "mala", name: "Morning Mala", price: 31, description: "Morning mala offering & sankalpam", active: true },
  { id: "vastra", name: "Vastra Seva", price: 51, description: "New vastra offering to deity", active: true },
  { id: "pritibhoj_basic", name: "Priti Bhoj — Basic", price: 280, description: "Chole or Rajma or Dal Makhni & Jeera rice", active: true },
  { id: "pritibhoj_mid", name: "Priti Bhoj — Mid", price: 400, description: "1 sabzi, 1 Naan, 1 Veg Biryani", active: true },
  { id: "pritibhoj_premium", name: "Priti Bhoj — Premium", price: 530, description: "2 sabzi, 1 Naan, 1 Veg Biryani", active: true }
];
var DEFAULT_FESTIVALS = {
  "2026-08-11": "Raksha Bandhan",
  "2026-08-15": "Independence Day / Special Abhishek",
  "2026-08-19": "Krishna Janmashtami",
  "2026-08-25": "Ganesh Chaturthi",
  "2026-09-05": "Teachers Day Special Puja"
};
var DEFAULT_WEEKLY = {
  0: "Sarvdev Puja, Rudrabhishek & Katha · Sandhya Arti",
  1: "Shivji Puja & Rudrabhishek",
  2: "Hanumanji Puja, Abhishek & Katha",
  3: "Sandhya Arti",
  4: "Sandhya Arti",
  5: "Durga Ma Puja, Abhishek & Durga Saptashati Path",
  6: "Rudrabhishek, Navagrah Puja & Abhishek · Sandhya Arti"
};

function jsonpRequest(url, timeoutMs) {
  return new Promise(function(resolve, reject) {
    var cbName = "_smhm_cb_" + (++jsonpCounter);
    var script = document.createElement("script");
    var timer = null;
    var resolved = false;

    function cleanup() {
      if (timer) { clearTimeout(timer); timer = null; }
      if (script.parentNode) script.parentNode.removeChild(script);
      setTimeout(function() {
        try { delete window[cbName]; } catch(e){}
        delete activeJsonp[cbName];
      }, 10000);
    }

    window[cbName] = function(data) {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve(data);
    };

    script.onerror = function() {
      if (resolved) return;
      resolved = true;
      cleanup();
      reject(new Error("JSONP script load error"));
    };

    var sep = url.indexOf("?") >= 0 ? "&" : "?";
    script.src = url + sep + "callback=" + cbName;
    document.head.appendChild(script);
    activeJsonp[cbName] = true;

    timer = setTimeout(function() {
      if (resolved) return;
      resolved = true;
      cleanup();
      reject(new Error("JSONP timeout"));
    }, timeoutMs || 25000);
  });
}

function normalizeDate(input) {
  if (!input) return null;
  if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input.trim())) {
    return input.trim();
  }
  if (typeof input === "string" && input.length >= 10) {
    var m = input.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return m[1] + "-" + m[2] + "-" + m[3];
  }
  if (input instanceof Date && !isNaN(input.getTime())) {
    var y = input.getFullYear();
    var mo = String(input.getMonth() + 1).padStart(2, "0");
    var d = String(input.getDate()).padStart(2, "0");
    return y + "-" + mo + "-" + d;
  }
  var parsed = new Date(input);
  if (!isNaN(parsed.getTime())) {
    var py = parsed.getFullYear();
    var pmo = String(parsed.getMonth() + 1).padStart(2, "0");
    var pd = String(parsed.getDate()).padStart(2, "0");
    return py + "-" + pmo + "-" + pd;
  }
  return null;
}

function extractDate(b) {
  if (!b) return null;
  if (typeof b === "object") {
    if (b.date !== undefined) return normalizeDate(b.date);
    if (b["Booking Date"] !== undefined) return normalizeDate(b["Booking Date"]);
    if (b[0] !== undefined) return normalizeDate(b[0]);
  }
  return normalizeDate(b);
}

function extractItem(b) {
  if (!b) return null;
  if (typeof b === "object") {
    if (b.item !== undefined) return String(b.item).trim();
    if (b["Item ID"] !== undefined) return String(b["Item ID"]).trim();
    if (b[1] !== undefined) return String(b[1]).trim();
  }
  return null;
}

function loadFromSheet() {
  if (isLoading) {
    return Promise.resolve();
  }
  isLoading = true;
  updateSyncStatus(false, "Syncing...");

  var url = GAS_WEB_APP_URL + "?action=getAll&token=" + encodeURIComponent(SECRET_TOKEN);

  return jsonpRequest(url, 30000).then(function(data) {
    isLoading = false;
    if (data && data.success) {
      if (data.items && data.items.length) itemsConfig = data.items;
      else itemsConfig = DEFAULT_ITEMS;

      if (data.festivals) festivals = data.festivals;
      else festivals = DEFAULT_FESTIVALS;

      if (data.weeklyPujas) weeklyPujas = data.weeklyPujas;
      else weeklyPujas = DEFAULT_WEEKLY;

      var newSet = new Set();
      if (data.bookings && Array.isArray(data.bookings)) {
        data.bookings.forEach(function(b) {
          var d = extractDate(b);
          var itm = extractItem(b);
          if (d && itm) {
            newSet.add(d + "_" + itm);
          }
        });
      }
      bookedSet = newSet;
      lastSyncTime = new Date();
      updateSyncStatus(false, "Last synced: " + lastSyncTime.toLocaleTimeString());
      renderCalendar();
    } else {
      updateSyncStatus(true, "Sync warning: " + (data && data.error ? data.error : "unknown"));
    }
  }).catch(function(err) {
    isLoading = false;
    updateSyncStatus(true, "Sync failed (using cached data). Will retry...");
  });
}

function updateSyncStatus(isError, msg) {
  var el = document.getElementById("syncStatus");
  if (!el) return;
  var btn = '<button class="seva-refresh-btn" onclick="forceRefresh()">Refresh Now</button>';
  el.innerHTML = (msg || (lastSyncTime ? "Last synced: " + lastSyncTime.toLocaleTimeString() : "Loading...")) + btn;
  el.className = "seva-sync-status" + (isError ? " error" : "");
}

function forceRefresh() {
  loadFromSheet();
}

// Helper: Check if item is a Priti Bhoj tier
function isPritiBhoj(itemId) {
  return itemId && String(itemId).toLowerCase().indexOf('pritibhoj') === 0;
}

// Helper: Check if ANY Priti Bhoj size is already booked on a date
function isPritiBhojBookedOnDate(dateStr) {
  return bookedSet.has(dateStr + "_pritibhoj_basic") ||
         bookedSet.has(dateStr + "_pritibhoj_mid") ||
         bookedSet.has(dateStr + "_pritibhoj_premium");
}

function renderCalendar() {
  var cal = document.getElementById("calendar");
  var monthYear = document.getElementById("monthYear");
  if (!cal || !monthYear) return;

  var year = currentDate.getFullYear();
  var month = currentDate.getMonth();
  monthYear.textContent = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var today = new Date();
  var todayStr = fmtDate(today);

  cal.innerHTML = "";

  for (var i = 0; i < firstDay; i++) {
    cal.appendChild(document.createElement("div"));
  }

  for (var d = 1; d <= daysInMonth; d++) {
    var dateStr = fmtDate(new Date(year, month, d));
    var dayOfWeek = new Date(year, month, d).getDay();
    var cell = document.createElement("div");
    cell.className = "seva-day-cell";
    if (dateStr < todayStr) cell.classList.add("past");
    if (dateStr === todayStr) cell.classList.add("today");
    if (festivals[dateStr]) {
      cell.classList.add("festival");
      var badge = document.createElement("span");
      badge.className = "seva-festival-badge";
      badge.textContent = festivals[dateStr];
      cell.appendChild(badge);
    }

    var num = document.createElement("div");
    num.className = "seva-day-num";
    num.textContent = d;
    cell.appendChild(num);

    var pooja = document.createElement("div");
    pooja.className = "seva-pooja-text";
    pooja.textContent = weeklyPujas[dayOfWeek] || "";
    cell.appendChild(pooja);

    var activeItems = itemsConfig.filter(function(it) { return it.active !== false; });
    var allBooked = true;

    activeItems.forEach(function(it) {
      // 1. RESTRICTION: Show Priti Bhoj ONLY on Tuesdays (2) and Sundays (0)
      if (isPritiBhoj(it.id) && dayOfWeek !== 0 && dayOfWeek !== 2) {
        return;
      }

      var key = dateStr + "_" + it.id;
      var isBooked = bookedSet.has(key);

      // 2. RESTRICTION: Lock all sizes if ANY Priti Bhoj tier is booked in GS
      if (isPritiBhoj(it.id) && isPritiBhojBookedOnDate(dateStr)) {
        isBooked = true;
      }

      var inCart = cart.some(function(c) { return c.date === dateStr && c.itemId === it.id; });
      var otherPbInCart = isPritiBhoj(it.id) && cart.some(function(c) {
        return c.date === dateStr && isPritiBhoj(c.itemId) && c.itemId !== it.id;
      });

      if (!isBooked) allBooked = false;

      var btn = document.createElement("button");
      btn.className = "seva-item-btn";

      if (isBooked) {
        btn.classList.add("booked");
        btn.innerHTML = '<span>' + it.name + " — $" + it.price + '</span> <span>BOOKED</span>';
        btn.disabled = true;
      } else if (otherPbInCart) {
        // Mutual exclusion: disable other 2 sizes if 1 is already in cart
        btn.classList.add("booked");
        btn.style.opacity = "0.45";
        btn.style.cursor = "not-allowed";
        btn.innerHTML = '<span>' + it.name + " — $" + it.price + '</span> <span>UNAVAILABLE</span>';
        btn.disabled = true;
      } else if (inCart) {
        btn.classList.add("in-cart");
        btn.innerHTML = '<span>' + it.name + " — $" + it.price + '</span> <span>&#10003;</span>';
      } else {
        btn.innerHTML = '<span>' + it.name + " — $" + it.price + '</span>';
      }

      if (!isBooked && !otherPbInCart && dateStr >= todayStr) {
        (function(ds, itemObj) {
          btn.onclick = function() { toggleCart(ds, itemObj); };
        })(dateStr, it);
      }
      cell.appendChild(btn);
    });

    if (activeItems.length > 0 && dateStr >= todayStr) {
      var fdBtn = document.createElement("button");
      fdBtn.className = "seva-full-day-btn";
      fdBtn.textContent = "+ Full Day";
      var hasAvail = activeItems.some(function(it) {
        if (isPritiBhoj(it.id) && (dayOfWeek !== 0 && dayOfWeek !== 2)) return false;
        if (isPritiBhoj(it.id) && isPritiBhojBookedOnDate(dateStr)) return false;
        return !bookedSet.has(dateStr + "_" + it.id) && !cart.some(function(c) { return c.date === dateStr && c.itemId === it.id; });
      });
      if (!hasAvail) {
        fdBtn.disabled = true;
        fdBtn.textContent = "Fully Booked";
      } else {
        (function(ds) {
          fdBtn.onclick = function() { addFullDay(ds); };
        })(dateStr);
      }
      cell.appendChild(fdBtn);
    } else if (allBooked && activeItems.length > 0) {
      var fb = document.createElement("div");
      fb.className = "seva-fully-booked";
      fb.textContent = "Fully Booked";
      cell.appendChild(fb);
    }

    cal.appendChild(cell);
  }
}

function fmtDate(d) {
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

function toggleCart(dateStr, item) {
  var idx = cart.findIndex(function(c) { return c.date === dateStr && c.itemId === item.id; });
  if (idx >= 0) {
    cart.splice(idx, 1);
  } else {
    // If selecting Priti Bhoj, remove any existing Priti Bhoj size for this date
    if (isPritiBhoj(item.id)) {
      cart = cart.filter(function(c) {
        return !(c.date === dateStr && isPritiBhoj(c.itemId));
      });
    }
    cart.push({ date: dateStr, itemId: item.id, itemName: item.name, amount: item.price });
  }
  updateCartUI();
  renderCalendar();
}

function addFullDay(dateStr) {
  var activeItems = itemsConfig.filter(function(it) { return it.active !== false; });
  var added = 0;
  var parts = dateStr.split("-");
  var dayOfWeek = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])).getDay();
  var pbAdded = cart.some(function(c) { return c.date === dateStr && isPritiBhoj(c.itemId); }) || isPritiBhojBookedOnDate(dateStr);

  activeItems.forEach(function(it) {
    if (isPritiBhoj(it.id)) {
      if (dayOfWeek !== 0 && dayOfWeek !== 2) return; // Skip non-Tue/Sun
      if (pbAdded) return; // Add only 1 size maximum for Priti Bhoj
      pbAdded = true;
    }

    var key = dateStr + "_" + it.id;
    var inCart = cart.some(function(c) { return c.date === dateStr && c.itemId === it.id; });
    if (!bookedSet.has(key) && !inCart) {
      cart.push({ date: dateStr, itemId: it.id, itemName: it.name, amount: it.price });
      added++;
    }
  });

  if (added > 0) {
    updateCartUI();
    renderCalendar();
  }
}

function clearCart() {
  cart = [];
  updateCartUI();
  renderCalendar();
}

function updateCartUI() {
  var bar = document.getElementById("cartBar");
  var info = document.getElementById("cartInfo");
  if (!bar || !info) return;
  var total = cart.reduce(function(s, c) { return s + c.amount; }, 0);
  info.textContent = cart.length + " item" + (cart.length !== 1 ? "s" : "") + " — $" + total;
  bar.classList.toggle("show", cart.length > 0);
}

function openCheckout() {
  if (cart.length === 0) return;
  paymentComplete = false;
  document.getElementById("checkoutModal").classList.add("show");
  document.getElementById("errorBanner").classList.remove("show");
  document.getElementById("successBanner").classList.remove("show");
  document.getElementById("doneBtn").classList.add("hidden");
  document.getElementById("paypal-button-container").classList.remove("hidden");

  document.getElementById("devName").disabled = false;
  document.getElementById("devPhone").disabled = false;
  document.getElementById("devEmail").disabled = false;

  renderCartSummary();
  initPayPal();
}

function closeCheckout() {
  document.getElementById("checkoutModal").classList.remove("show");
  paymentComplete = false;
  document.getElementById("devName").value = "";
  document.getElementById("devPhone").value = "";
  document.getElementById("devEmail").value = "";
}

function renderCartSummary() {
  var container = document.getElementById("cartSummary");
  var total = cart.reduce(function(s, c) { return s + c.amount; }, 0);
  var html = "<h4>Your Selection</h4>";
  cart.forEach(function(c, i) {
    var removeBtn = paymentComplete ? "" : '<span class="remove" onclick="removeFromCart(' + i + ')">Remove</span>';
    html += '<div class="seva-cart-item"><span>' + c.itemName + " — " + fmtDateNice(c.date) + '</span><span>$' + c.amount + removeBtn + '</span></div>';
  });
  html += '<div class="seva-cart-total">Total: $' + total + " CAD</div>";
  container.innerHTML = html;
}

function removeFromCart(idx) {
  if (paymentComplete) return;
  cart.splice(idx, 1);
  updateCartUI();
  renderCalendar();
  if (cart.length === 0) closeCheckout();
  else renderCartSummary();
}

function fmtDateNice(ds) {
  var parts = ds.split("-");
  var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function showError(msg) {
  var el = document.getElementById("errorBanner");
  el.textContent = msg;
  el.classList.add("show");
  document.getElementById("successBanner").classList.remove("show");
}
function showSuccess(msg) {
  var el = document.getElementById("successBanner");
  el.textContent = msg;
  el.classList.add("show");
  document.getElementById("errorBanner").classList.remove("show");
}

var paypalButtons = null;
function initPayPal() {
  var container = document.getElementById("paypal-button-container");
  if (!container) return;
  container.innerHTML = "";

  if (typeof paypal === "undefined") {
    showError("PayPal SDK failed to load. Please refresh the page.");
    return;
  }

  paypalButtons = paypal.Buttons({
    style: { layout: "vertical", color: "gold", shape: "rect", label: "pay" },
    createOrder: function(data, actions) {
      var name = document.getElementById("devName").value.trim();
      var email = document.getElementById("devEmail").value.trim();
      if (!name || !email) {
        showError("Please fill in your name and email before paying.");
        return Promise.reject(new Error("Validation failed"));
      }
      var total = cart.reduce(function(s, c) { return s + c.amount; }, 0);
      return actions.order.create({
        purchase_units: [{
          amount: { value: total.toFixed(2), currency_code: "CAD" },
          description: "SMHM Seva Sponsorship — " + cart.length + " item(s)"
        }],
        payer: { name: { given_name: name }, email_address: email }
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        var name = document.getElementById("devName").value.trim();
        var phone = document.getElementById("devPhone").value.trim();
        var email = document.getElementById("devEmail").value.trim();
        var payerEmail = details.payer && details.payer.email_address ? details.payer.email_address : email;
        var orderId = details.id;

        return loadFromSheet().then(function() {
          var conflicts = [];
          var cleanCart = [];
          cart.forEach(function(c) {
            if (bookedSet.has(c.date + "_" + c.itemId)) {
              conflicts.push(c);
            } else {
              cleanCart.push(c);
            }
          });

          if (conflicts.length > 0) {
            var names = conflicts.map(function(c) { return c.itemName + " on " + fmtDateNice(c.date); }).join(", ");
            showError("Sorry, these were just booked by someone else: " + names);
            cart = cleanCart;
            updateCartUI();
            renderCalendar();
            renderCartSummary();
            return;
          }

          if (cleanCart.length === 0) {
            showError("All selected items were just booked by others. Please choose again.");
            return;
          }

          var results = [];
          var writeChain = Promise.resolve();

          cleanCart.forEach(function(c, idx) {
            writeChain = writeChain.then(function() {
              if (idx > 0) {
                return new Promise(function(resolve) { setTimeout(resolve, 2000); });
              }
            }).then(function() {
              var url = GAS_WEB_APP_URL +
                "?action=book" +
                "&token=" + encodeURIComponent(SECRET_TOKEN) +
                "&date=" + encodeURIComponent(c.date) +
                "&item=" + encodeURIComponent(c.itemId) +
                "&itemName=" + encodeURIComponent(c.itemName) +
                "&amount=" + encodeURIComponent(c.amount) +
                "&name=" + encodeURIComponent(name) +
                "&phone=" + encodeURIComponent(phone) +
                "&email=" + encodeURIComponent(email) +
                "&paypalOrderId=" + encodeURIComponent(orderId) +
                "&paypalPayerEmail=" + encodeURIComponent(payerEmail);

              return jsonpRequest(url, 45000).catch(function(firstErr) {
                return new Promise(function(resolve) { setTimeout(resolve, 3000); }).then(function() {
                  return jsonpRequest(url, 45000);
                });
              });
            }).then(function(res) {
              results.push(res);
            }).catch(function(err) {
              results.push({ success: false, error: err.message });
            });
          });

          return writeChain.then(function() {
            var allOk = results.every(function(r) { return r && r.success; });
            if (allOk) {
              var confirmUrl = GAS_WEB_APP_URL +
                "?action=confirm" +
                "&token=" + encodeURIComponent(SECRET_TOKEN) +
                "&email=" + encodeURIComponent(email) +
                "&name=" + encodeURIComponent(name) +
                "&items=" + encodeURIComponent(JSON.stringify(cleanCart)) +
                "&total=" + encodeURIComponent(cleanCart.reduce(function(s, c) { return s + c.amount; }, 0)) +
                "&orderId=" + encodeURIComponent(orderId);
              return jsonpRequest(confirmUrl, 20000).then(function() {
                onPaymentSuccess(email, cleanCart);
              }).catch(function() {
                onPaymentSuccess(email, cleanCart);
              });
            } else {
              var failed = results.filter(function(r) { return r && !r.success; });
              var errs = failed.map(function(r) { return r.error; }).join("; ");
              showError("Some items failed to save: " + errs + ". Please contact donate@smhmajax.ca with your PayPal receipt: " + orderId);
            }
          }).catch(function(err) {
            // Safety net to stop infinite loading if network drops
            showError("Connection timeout: Your payment was successful (Order ID: " + orderId + "), but the calendar sync was delayed. Please check your email or contact the Mandir.");
            document.getElementById("paypal-button-container").classList.add("hidden");
            document.getElementById("doneBtn").classList.remove("hidden");
          });
        });
      });
    },
    onError: function(err) {
      showError("PayPal error: " + (err.message || "Please try again."));
    }
  });

  paypalButtons.render("#paypal-button-container");
}

function onPaymentSuccess(email, cleanCart) {
  paymentComplete = true;
  document.getElementById("paypal-button-container").classList.add("hidden");
  document.getElementById("devName").disabled = true;
  document.getElementById("devPhone").disabled = true;
  document.getElementById("devEmail").disabled = true;
  renderCartSummary();
  showSuccess("Jai Hanuman! Your sponsorship is confirmed. A confirmation email has been sent to " + email);
  document.getElementById("doneBtn").classList.remove("hidden");
  cart = [];
  updateCartUI();
  loadFromSheet();
}

function initSevaCalendar() {
  var calElement = document.getElementById("calendar");
  if (!calElement) return; // Prevent running on pages without calendar

  itemsConfig = DEFAULT_ITEMS;
  festivals = DEFAULT_FESTIVALS;
  weeklyPujas = DEFAULT_WEEKLY;
  renderCalendar();

  loadFromSheet().then(function() {
    setInterval(function() {
      if (!isLoading) {
        loadFromSheet().catch(function(e) {});
      }
    }, 30000);
  });
  
  // Attach nav handlers if they exist
  var prevBtn = document.getElementById("prevMonth");
  var nextBtn = document.getElementById("nextMonth");
  if (prevBtn) {
    prevBtn.onclick = function() {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    };
  }
  if (nextBtn) {
    nextBtn.onclick = function() {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    };
  }
}

// Ensure the init script runs when the DOM loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSevaCalendar);
} else {
  initSevaCalendar();
}
// ═══════════════════════════════════════════════════════════
// ADMIN PANEL (MANUAL BOOKINGS)
// ═══════════════════════════════════════════════════════════

function openAdminPanel(e) {
  e.preventDefault();
  // Simple frontend password lock
  var pwd = prompt("Please enter the Admin Password:");
  if (pwd === "Hanuman2026") { // <--- CHANGE YOUR PASSWORD HERE
    document.getElementById('adminModal').classList.add('show');
    
    // Auto-set the minimum date to today
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('adminBookingDate').min = yyyy + '-' + mm + '-' + dd;
  } else if (pwd !== null) {
    alert("Incorrect Password. Access Denied.");
  }
}

function closeAdminPanel() {
  document.getElementById('adminModal').classList.remove('show');
}

function showAdminSuccess(msg) {
  var el = document.getElementById("adminSuccessMsg");
  el.textContent = msg;
  el.classList.add("show");
  document.getElementById("adminErrorMsg").classList.remove("show");
}

function showAdminError(msg) {
  var el = document.getElementById("adminErrorMsg");
  el.textContent = msg;
  el.classList.add("show");
  document.getElementById("adminSuccessMsg").classList.remove("show");
}

function addAdminBooking() {
  var date = document.getElementById("adminBookingDate").value;
  var itemSelect = document.getElementById("adminItemSelect");
  var itemId = itemSelect.value;
  var itemOption = itemSelect.options[itemSelect.selectedIndex];
  var itemName = itemOption.getAttribute("data-name") || itemId;
  var amount = itemOption.getAttribute("data-price") || "0";
  var name = document.getElementById("adminDevName").value.trim();
  var phone = document.getElementById("adminDevPhone").value.trim();
  var email = document.getElementById("adminDevEmail").value.trim();
  var method = document.getElementById("adminPaymentMethod").value;
  var notes = document.getElementById("adminNotes").value.trim();
  var adminName = document.getElementById("adminName").value.trim();

  if (!date) { showAdminError("Please select a booking date."); return; }
  if (!itemId) { showAdminError("Please select an item."); return; }
  if (!name) { showAdminError("Please enter the devotee's name."); return; }

  var btn = document.getElementById("adminSubmitBtn");
  btn.disabled = true;
  btn.textContent = "Adding...";

  var url = GAS_WEB_APP_URL +
    "?action=adminBook" +
    "&token=" + encodeURIComponent(SECRET_TOKEN) +
    "&date=" + encodeURIComponent(date) +
    "&item=" + encodeURIComponent(itemId) +
    "&itemName=" + encodeURIComponent(itemName) +
    "&amount=" + encodeURIComponent(amount) +
    "&name=" + encodeURIComponent(name) +
    "&phone=" + encodeURIComponent(phone) +
    "&email=" + encodeURIComponent(email) +
    "&paymentMethod=" + encodeURIComponent(method) +
    "&notes=" + encodeURIComponent(notes) +
    "&adminName=" + encodeURIComponent(adminName);

  // We re-use the existing jsonpRequest function from the Seva Booking script
  jsonpRequest(url, 25000).then(function(data) {
    btn.disabled = false;
    btn.textContent = "Add Booking";
    if (data && data.success) {
      showAdminSuccess("✅ Booking added successfully! " + itemName + " on " + date + " is now marked as booked.");
      
      // Clear form
      document.getElementById("adminBookingDate").value = "";
      document.getElementById("adminItemSelect").value = "";
      document.getElementById("adminDevName").value = "";
      document.getElementById("adminDevPhone").value = "";
      document.getElementById("adminDevEmail").value = "";
      document.getElementById("adminNotes").value = "";
      
      // Instantly refresh the main calendar in the background
      loadFromSheet();
    } else {
      showAdminError("❌ " + (data && data.error ? data.error : "Failed to add booking."));
    }
  }).catch(function(err) {
    btn.disabled = false;
    btn.textContent = "Add Booking";
    showAdminError("❌ Error: " + err.message);
  });
}