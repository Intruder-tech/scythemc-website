/**
 * ScytheMC • Official Network & Store Application Script
 * Features: Tab Routing, Interactive Shopping Cart, Web Audio FX, MC Avatar Integration,
 * Rule Search, Role Hierarchy Filter, and Checkout Flow.
 */

// --- Global State ---
const state = {
  activeTab: 'home',
  cart: [],
  discountPercent: 0,
  activeCoupon: null,
  soundEnabled: true,
  audioCtx: null
};

// --- Web Audio FX Synthesizer (Zero Dependencies) ---
function initAudio() {
  if (!state.audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      state.audioCtx = new AudioContext();
    }
  }
}

function playSound(type) {
  if (!state.soundEnabled) return;
  try {
    initAudio();
    if (!state.audioCtx) return;

    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }

    const ctx = state.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'click') {
      // Crisp 8-bit UI click
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'success') {
      // Minecraft-style Level Up / Ding Chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'coin') {
      // Coin pickup jingle
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.09); // E6
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'error') {
      // Low thud
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(60, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (e) {
    // Audio context fallback safely ignored
  }
}

// Toggle Sound Widget (Debounced, mobile-unlocked & single-trigger)
let lastAudioToggleTime = 0;
function toggleAudio(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  const now = Date.now();
  if (now - lastAudioToggleTime < 300) return;
  lastAudioToggleTime = now;

  state.soundEnabled = !state.soundEnabled;
  const icon = document.getElementById('audioIcon');
  const tooltip = document.querySelector('.audio-tooltip');

  if (state.soundEnabled) {
    if (icon) icon.className = 'fa-solid fa-volume-high';
    if (tooltip) tooltip.textContent = 'Sound FX: ON';
    initAudio();
    playSound('click');
    showToast('Sound Effects: <strong>ENABLED</strong>', 'success');
  } else {
    if (icon) icon.className = 'fa-solid fa-volume-xmark';
    if (tooltip) tooltip.textContent = 'Sound FX: MUTED';
    showToast('Sound Effects: <strong>MUTED</strong>', 'info');
  }
}
window.toggleAudio = toggleAudio;

// --- Tab Switching Architecture ---
function switchTab(tabId) {
  playSound('click');
  
  // Close mobile navigation and dropdown menu if open
  const pixelNav = document.querySelector('.pixel-nav');
  if (pixelNav) pixelNav.classList.remove('mobile-active');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  if (mobileBtn) {
    mobileBtn.classList.remove('active');
    mobileBtn.setAttribute('aria-expanded', 'false');
  }

  const modesMenu = document.getElementById('modesDropdownMenu');
  if (modesMenu) modesMenu.classList.remove('active');
  const modesBtn = document.getElementById('nav-modes');
  if (modesBtn) modesBtn.setAttribute('aria-expanded', 'false');

  // Deactivate all nav buttons & panes
  document.querySelectorAll('.pixel-nav-link').forEach(btn => {
    if (btn.dataset.tab) btn.classList.remove('active');
  });
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

  // Activate selected nav button & pane
  const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
  const activePane = document.getElementById(`pane-${tabId}`);

  if (activeBtn) activeBtn.classList.add('active');
  if (activePane) {
    activePane.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  state.activeTab = tabId;
  window.location.hash = tabId;
}

// Listen to hash change for browser back/forward navigation
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (['home', 'modes', 'store', 'rules', 'staff'].includes(hash)) {
    switchTab(hash);
  }
});

// Setup click listeners on nav buttons
document.querySelectorAll('.pixel-nav-link[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab);
  });
});

// Mobile menu toggle (Debounced & touch-resilient)
let isMobileMenuDebounced = false;
function toggleMobileMenu(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  if (isMobileMenuDebounced) return;
  isMobileMenuDebounced = true;
  setTimeout(() => { isMobileMenuDebounced = false; }, 220);

  const pixelNav = document.querySelector('.pixel-nav');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  if (pixelNav) {
    const isActive = pixelNav.classList.toggle('mobile-active');
    if (mobileBtn) {
      mobileBtn.classList.toggle('active', isActive);
      mobileBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    }
  }
  playSound('click');
}
window.toggleMobileMenu = toggleMobileMenu;

// Close mobile navigation when tapping outside
document.addEventListener('click', (e) => {
  const pixelNav = document.querySelector('.pixel-nav');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  if (pixelNav && pixelNav.classList.contains('mobile-active')) {
    if (!pixelNav.contains(e.target) && !mobileBtn?.contains(e.target)) {
      pixelNav.classList.remove('mobile-active');
      if (mobileBtn) {
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
      }
    }
  }
});

// --- Store Sub-Category Filter ---
function filterStore(category) {
  playSound('click');
  document.querySelectorAll('.subnav-pill').forEach(pill => pill.classList.remove('active'));
  document.querySelectorAll('.store-category-pane').forEach(pane => pane.classList.remove('active'));

  const activePill = document.querySelector(`.subnav-pill[data-category="${category}"]`);
  const activePane = document.getElementById(`cat-${category}`);

  if (activePill) activePill.classList.add('active');
  if (activePane) activePane.classList.add('active');
}

// --- Mobile Interactive Perks Breakdown Data & Controller ---
const rankPerksData = {
  vip: {
    name: 'VIP RANK',
    price: '₹169 / Monthly',
    color: '#4ade80',
    badge: 'VIP',
    cartData: { id: 'vip', name: 'VIP Rank', type: 'Rank', price: 169, period: 'Monthly', icon: 'fa-solid fa-shield', prefix: 'VIP' },
    perks: [
      { name: 'Max Homes', val: '3 Homes', status: true },
      { name: 'AH Listings', val: '4 Listings', status: true },
      { name: 'Team Members', val: '5 Members', status: true },
      { name: 'Rank Kit', val: 'VIP KIT', status: true },
      { name: 'Full Ender Chest Access', val: 'Included', status: true },
      { name: 'Chat & Tab Prefix', val: '[VIP] Prefix', status: true },
      { name: 'Priority Join Queue', val: 'Standard Priority', status: true },
      { name: 'Event Queue', val: 'Standard', status: false },
      { name: 'Flight Privileges', val: 'Not Included', status: false }
    ]
  },
  vipplus: {
    name: 'VIP+ RANK',
    price: '₹269 / Monthly',
    color: '#38bdf8',
    badge: 'VIP+',
    cartData: { id: 'vipplus', name: 'VIP+ Rank', type: 'Rank', price: 269, period: 'Monthly', icon: 'fa-solid fa-shield-halved', prefix: 'VIP+' },
    perks: [
      { name: 'Max Homes', val: '4 Homes', status: true },
      { name: 'AH Listings', val: '4 Listings', status: true },
      { name: 'Team Members', val: '5 Members', status: true },
      { name: 'Rank Kits', val: 'VIP & VIP+ KIT', status: true },
      { name: 'Full Ender Chest Access', val: 'Included', status: true },
      { name: 'Chat & Tab Prefix', val: '[VIP+] Prefix', status: true },
      { name: 'Priority Join Queue', val: 'Priority Low', status: true },
      { name: 'Teleport Delay Bypass', val: 'Instant Teleport', status: true },
      { name: 'Priority Event Queue', val: 'VIP Queue Access', status: true }
    ]
  },
  mvp: {
    name: 'MVP RANK',
    price: '₹399 / Monthly',
    color: '#c084fc',
    badge: 'MVP',
    cartData: { id: 'mvp', name: 'MVP Rank', type: 'Rank', price: 399, period: 'Monthly', icon: 'fa-solid fa-trophy', prefix: 'MVP' },
    perks: [
      { name: 'Max Homes', val: '5 Homes', status: true },
      { name: 'AH Listings', val: '5 Listings', status: true },
      { name: 'Team Members', val: '7 Members', status: true },
      { name: 'Rank Kit', val: 'MVP KIT', status: true },
      { name: 'Full Ender Chest Access', val: 'Included', status: true },
      { name: 'Chat & Tab Prefix', val: '[MVP] Prefix', status: true },
      { name: 'Priority Join Queue', val: 'Priority Medium', status: true },
      { name: 'Workbench & Anvil', val: '/craft & /near', status: true },
      { name: 'Priority Event Queue', val: 'VIP Queue Access', status: true }
    ]
  },
  mvpplus: {
    name: 'MVP+ RANK',
    price: '₹449 / Monthly',
    color: '#f472b6',
    badge: 'MVP+',
    cartData: { id: 'mvpplus', name: 'MVP+ Rank', type: 'Rank', price: 449, period: 'Monthly', icon: 'fa-solid fa-medal', prefix: 'MVP+' },
    perks: [
      { name: 'Max Homes', val: '6 Homes', status: true },
      { name: 'AH Listings', val: '5 Listings', status: true },
      { name: 'Team Members', val: '7 Members', status: true },
      { name: 'Rank Kits', val: 'MVP & MVP+ KIT', status: true },
      { name: 'Full Ender Chest Access', val: 'Included', status: true },
      { name: 'Chat & Tab Prefix', val: '[MVP+] Prefix', status: true },
      { name: 'Flight Privileges', val: 'Hub / Lobby Flight (/fly)', status: true },
      { name: 'Item Repair Command', val: '/repair Command', status: true },
      { name: 'Priority Event Queue', val: 'Guaranteed Priority', status: true }
    ]
  },
  scythe: {
    name: 'THE SCYTHE RANK',
    price: '₹799 / Monthly',
    color: '#ff5e7e',
    badge: 'THE SCYTHE',
    cartData: { id: 'thescythe', name: 'THE SCYTHE Rank', type: 'Rank', price: 799, period: 'Monthly', icon: 'fa-solid fa-crown', prefix: 'THE SCYTHE' },
    perks: [
      { name: 'Max Homes', val: '8 Homes', status: true },
      { name: 'AH Listings', val: '8 Listings', status: true },
      { name: 'Team Members', val: '10 Members', status: true },
      { name: 'Rank Kit', val: 'THE SCYTHE KIT (Supreme)', status: true },
      { name: 'Full Ender Chest Access', val: 'Included', status: true },
      { name: 'Animated Prefix', val: '[THE SCYTHE] Animated', status: true },
      { name: 'Flight Privileges', val: 'Full Realm Flight (/fly)', status: true },
      { name: 'Server Queue Bypass', val: 'Permanent 100% Bypass', status: true },
      { name: 'Nickname & Trails', val: '/nick + Exclusive Supreme Trails', status: true }
    ]
  }
};

function selectMobilePerkRank(rankId) {
  playSound('click');
  document.querySelectorAll('.mobile-rank-chips .rank-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.rank === rankId);
  });
  renderMobilePerkCard(rankId);
}
window.selectMobilePerkRank = selectMobilePerkRank;
window.rankPerksData = rankPerksData;

function renderMobilePerkCard(rankId) {
  const container = document.getElementById('mobilePerkCard');
  if (!container) return;
  const data = rankPerksData[rankId] || rankPerksData.vip;

  let perksHtml = '';
  data.perks.forEach(p => {
    const icon = p.status 
      ? '<i class="fa-solid fa-circle-check text-success"></i>' 
      : '<i class="fa-solid fa-circle-xmark text-dim"></i>';
    perksHtml += `
      <div class="mobile-perk-row ${p.status ? '' : 'perk-disabled'}">
        <span class="perk-label">${icon} ${p.name}</span>
        <span class="perk-val">${p.val}</span>
      </div>
    `;
  });

  const ctaBtn = data.isCustom
    ? `<a href="https://discord.gg/C4p9fJ5aTS" target="_blank" rel="noopener noreferrer" class="btn btn-discord btn-block"><i class="fa-brands fa-discord"></i> CREATE DISCORD TICKET</a>`
    : `<button type="button" class="btn btn-purchase btn-block" onclick="addToCart(rankPerksData['${rankId}'].cartData)"><i class="fa-solid fa-cart-plus"></i> ADD TO CART (${data.price.split(' ')[0]})</button>`;

  container.innerHTML = `
    <div class="mobile-perk-header">
      <div class="rank-pill-badge" style="border-color: ${data.color}; color: ${data.color};">${data.badge}</div>
      <h4>${data.name}</h4>
      <div class="mobile-perk-price">${data.price}</div>
    </div>
    <div class="mobile-perk-list">
      ${perksHtml}
    </div>
    <div class="mobile-perk-cta">
      ${ctaBtn}
    </div>
  `;
}
window.renderMobilePerkCard = renderMobilePerkCard;

function toggleFullMatrix() {
  playSound('click');
  const matrix = document.getElementById('tableResponsiveMatrix');
  const btnText = document.getElementById('toggleMatrixText');
  if (!matrix) return;
  const isVisible = matrix.classList.toggle('show-matrix-mobile');
  if (btnText) {
    btnText.textContent = isVisible ? 'Hide Full Matrix Table' : 'View Full Matrix Table';
  }
}
window.toggleFullMatrix = toggleFullMatrix;

// --- Shopping Cart Implementation ---
function addToCart(item) {
  playSound('coin');
  state.cart.push(item);
  saveCart();
  renderCart();
  openCart();
  showToast(`Added <strong>${item.name}</strong> to cart!`, 'success');
}

function removeFromCart(index) {
  playSound('click');
  const removed = state.cart.splice(index, 1);
  saveCart();
  renderCart();
  if (removed && removed[0]) {
    showToast(`Removed ${removed[0].name}`, 'info');
  }
}

function saveCart() {
  try {
    localStorage.setItem('scythe_cart', JSON.stringify(state.cart));
  } catch (e) {}
}

function loadCart() {
  try {
    const saved = localStorage.getItem('scythe_cart');
    if (saved) {
      state.cart = JSON.parse(saved);
    }
  } catch (e) {}
}

function renderCart() {
  const cartItemsList = document.getElementById('cartItemsList');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const cartItemCount = document.getElementById('cartItemCount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartDiscount = document.getElementById('cartDiscount');
  const discountLine = document.getElementById('discountLine');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  const count = state.cart.length;
  if (cartCountBadge) cartCountBadge.textContent = count;
  if (cartItemCount) cartItemCount.textContent = count;

  if (count === 0) {
    if (cartItemsList) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <i class="fa-solid fa-basket-shopping"></i>
          <p>Your cart is currently empty.</p>
          <button type="button" class="btn btn-sm btn-primary" onclick="closeCart(); switchTab('store');">Browse Store</button>
        </div>
      `;
    }
    if (cartSubtotal) cartSubtotal.textContent = '₹0';
    if (discountLine) discountLine.style.display = 'none';
    if (cartTotal) cartTotal.textContent = '₹0';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (checkoutBtn) checkoutBtn.disabled = false;

  let subtotal = 0;
  let itemsHtml = '';

  state.cart.forEach((item, index) => {
    subtotal += Number(item.price);
    itemsHtml += `
      <div class="cart-item">
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <span>${item.type}${item.period ? ' (' + item.period + ')' : ''}</span>
        </div>
        <div class="cart-item-right">
          <span class="cart-item-price">₹${item.price}</span>
          <button type="button" class="cart-item-remove" onclick="removeFromCart(${index})" title="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  });

  if (cartItemsList) cartItemsList.innerHTML = itemsHtml;

  const discountAmount = Math.round(subtotal * (state.discountPercent / 100));
  const finalTotal = Math.max(0, subtotal - discountAmount);

  if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal}`;
  if (state.discountPercent > 0) {
    if (discountLine) discountLine.style.display = 'flex';
    if (cartDiscount) cartDiscount.textContent = `-₹${discountAmount} (${state.discountPercent}%)`;
  } else {
    if (discountLine) discountLine.style.display = 'none';
  }
  if (cartTotal) cartTotal.textContent = `₹${finalTotal}`;
}

// Cart Drawer open / close
function openCart() {
  document.getElementById('cartDrawer')?.classList.add('active');
  document.getElementById('cartOverlay')?.classList.add('active');
}
function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('active');
  document.getElementById('cartOverlay')?.classList.remove('active');
}

document.getElementById('cartTrigger')?.addEventListener('click', openCart);
document.getElementById('closeCartBtn')?.addEventListener('click', closeCart);
document.getElementById('cartOverlay')?.addEventListener('click', closeCart);

// --- Minecraft Avatar Head Preview ---
let ignDebounce = null;
function updateCartAvatar(username) {
  clearTimeout(ignDebounce);
  ignDebounce = setTimeout(() => {
    const cleanName = username.trim() || 'Steve';
    const preview = document.getElementById('cartAvatarPreview');
    if (preview) {
      preview.src = `https://mc-heads.net/avatar/${encodeURIComponent(cleanName)}/40`;
    }
  }, 400);
}

// --- Coupon Code Application ---
function applyCoupon() {
  const input = document.getElementById('couponCodeInput');
  const msg = document.getElementById('couponMessage');
  if (!input || !msg) return;

  const code = input.value.trim().toUpperCase();
  msg.style.display = 'block';

  if (code === 'SCYTHE20') {
    state.discountPercent = 20;
    state.activeCoupon = 'SCYTHE20';
    msg.className = 'coupon-feedback text-success';
    msg.textContent = 'Coupon applied: 20% Discount Activated!';
    playSound('coin');
    renderCart();
  } else {
    state.discountPercent = 0;
    state.activeCoupon = null;
    msg.className = 'coupon-feedback text-crimson';
    msg.textContent = 'Invalid coupon code. Try SCYTHE20';
    playSound('error');
    renderCart();
  }
}

// --- Redeem with Coins simulation ---
function redeemWithCoins(itemName, coinCost) {
  const username = document.getElementById('cartUsernameInput')?.value.trim() || '';
  if (!username) {
    openCart();
    playSound('error');
    showToast('Please enter your Minecraft IGN in the cart first!', 'warning');
    return;
  }

  playSound('coin');
  showToast(`Redeemed <strong>${itemName}</strong> for ${coinCost} Coins for [${username}]! Voucher delivered in-game.`, 'success');
}

// --- Checkout Modal Flow ---
function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast('Your cart is empty!', 'warning');
    return;
  }

  const usernameInput = document.getElementById('cartUsernameInput');
  const username = usernameInput ? usernameInput.value.trim() : '';

  if (!username) {
    playSound('error');
    showToast('Please enter your Minecraft Username (IGN) to proceed.', 'warning');
    usernameInput?.focus();
    return;
  }

  // Update modal preview
  const modalAvatar = document.getElementById('modalAvatar');
  const modalIgnName = document.getElementById('modalIgnName');
  const modalEdition = document.getElementById('modalEdition');
  const modalFinalAmount = document.getElementById('modalFinalAmount');

  const edition = document.querySelector('input[name="edition"]:checked')?.value || 'Java';

  if (modalAvatar) modalAvatar.src = `https://mc-heads.net/avatar/${encodeURIComponent(username)}/36`;
  if (modalIgnName) modalIgnName.textContent = username;
  if (modalEdition) modalEdition.textContent = `${edition} Edition`;

  // Calculate final amount
  let subtotal = state.cart.reduce((sum, item) => sum + Number(item.price), 0);
  const discountAmount = Math.round(subtotal * (state.discountPercent / 100));
  const finalTotal = Math.max(0, subtotal - discountAmount);

  if (modalFinalAmount) modalFinalAmount.textContent = `₹${finalTotal}`;

  // Update dynamic UPI QR Code preview
  const qrImg = document.getElementById('checkoutQrImage');
  if (qrImg) {
    const upiUri = `upi://pay?pa=scythemc@upi&pn=ScytheMC&am=${finalTotal}&cu=INR&tn=ScytheMC_Perks_${encodeURIComponent(username)}`;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUri)}`;
  }

  closeCart();
  document.getElementById('checkoutModalBackdrop')?.classList.add('active');
  playSound('click');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModalBackdrop')?.classList.remove('active');
}

function copyUpiId(e) {
  if (e) e.stopPropagation();
  copyTextToClipboard('scythemc@upi').then(() => {
    playSound('coin');
    showToast('UPI ID copied: <strong>scythemc@upi</strong>', 'success');
  }).catch(() => {
    showToast('UPI ID: scythemc@upi', 'info');
  });
}
window.copyUpiId = copyUpiId;

function copyClaimDetails() {
  const username = document.getElementById('cartUsernameInput')?.value.trim() || 'Player';
  const items = state.cart.map(i => i.name).join(', ') || 'Ranks / Store Items';
  let subtotal = state.cart.reduce((sum, item) => sum + Number(item.price), 0);
  const discountAmount = Math.round(subtotal * (state.discountPercent / 100));
  const finalTotal = Math.max(0, subtotal - discountAmount);
  
  const text = `🛒 [SCYTHE MC CLAIM]\n• IGN: ${username}\n• Items: ${items}\n• Total Amount: ₹${finalTotal}\n• Payment Proof: [Screenshot Attached]\n• Ready for verification!`;
  copyTextToClipboard(text).then(() => {
    playSound('coin');
    showToast('Claim details copied! Paste in #ticket-channel with your payment screenshot.', 'success');
  }).catch(() => {
    showToast('Please open #ticket-channel and send your IGN & screenshot.', 'info');
  });
}
window.copyClaimDetails = copyClaimDetails;

function simulateCompletePayment() {
  playSound('success');
  closeCheckoutModal();

  const username = document.getElementById('cartUsernameInput')?.value.trim() || 'Player';
  
  // Clear cart
  state.cart = [];
  saveCart();
  renderCart();

  showToast(`🎉 Payment Confirmed! Ranks & perks dispatched to <strong>${username}</strong> within 30 seconds.`, 'success');
}

// Payment method selection visual
document.querySelectorAll('.pay-option').forEach(option => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.pay-option').forEach(o => o.classList.remove('selected'));
    option.classList.add('selected');
  });
});

// Universal Clipboard Helper (supports desktop, mobile browsers, LAN IP, and insecure contexts)
function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.top = '-9999px';
      textArea.style.left = '-9999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (success) resolve();
      else reject(new Error('execCommand failed'));
    } catch (err) {
      reject(err);
    }
  });
}

// --- Server IP Copy Helper (Debounced & Single-Trigger) ---
let lastIpCopyTimestamp = 0;
function copyServerIp(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  const now = Date.now();
  if (now - lastIpCopyTimestamp < 900) {
    return; // Guard against rapid duplicate clicks
  }
  lastIpCopyTimestamp = now;

  const ip = 'PLAY.SCYTHEMC.FUN:25565';
  copyTextToClipboard(ip).then(() => {
    playSound('coin');
    showToast(`Copied <strong>${ip}</strong> to clipboard! Ready to connect.`, 'success');
    
    // Animate copy badge in header if exists
    const badge = document.getElementById('headerCopyBadge');
    if (badge) {
      badge.textContent = 'COPIED!';
      badge.style.background = '#10b981';
      setTimeout(() => {
        badge.textContent = 'COPY';
        badge.style.background = '';
      }, 2000);
    }

    // Animate hero copy text if exists
    const heroCopyText = document.getElementById('heroCopyText');
    if (heroCopyText) {
      heroCopyText.innerHTML = '<i class="fa-solid fa-check"></i> COPIED!';
      setTimeout(() => {
        heroCopyText.innerHTML = '<i class="fa-regular fa-copy"></i> COPY IP';
      }, 2000);
    }
  }).catch(() => {
    showToast(`Server IP: <strong>${ip}</strong>`, 'info');
  });
}

// --- Copy Coupon Code Helper ---
function copyCouponCode(code, e) {
  if (e) e.stopPropagation();
  navigator.clipboard.writeText(code).then(() => {
    playSound('coin');
    showToast(`Copied coupon code <strong>${code}</strong> to clipboard!`, 'success');
    
    // Auto-fill into cart discount input if exists
    const couponInput = document.getElementById('couponCodeInput');
    if (couponInput) {
      couponInput.value = code;
    }
    
    // If cart has items, auto apply
    if (state.cart.length > 0) {
      applyCoupon();
    }
  }).catch(() => {
    showToast(`Coupon Code: ${code}`, 'info');
  });
}

// --- Toast System ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  // Prevent duplicate toast spamming if same message is already visible
  const existingSpans = container.querySelectorAll('.toast span');
  for (const span of existingSpans) {
    if (span.innerHTML === message) {
      return;
    }
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check text-success';
  if (type === 'warning') icon = 'fa-triangle-exclamation text-gold';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3800);
}

// --- Rules Real-Time Search Filter ---
function filterRules() {
  const query = document.getElementById('ruleSearchInput')?.value.toLowerCase().trim() || '';
  const ruleCards = document.querySelectorAll('#rulesListContainer .rule-card');

  ruleCards.forEach(card => {
    const text = (card.textContent + ' ' + (card.dataset.keywords || '')).toLowerCase();
    if (!query || text.includes(query)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// --- Staff & Rank Hierarchy Group Filter ---
function filterStaff(group) {
  playSound('click');
  document.querySelectorAll('.staff-filter-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.staff-filter-btn[data-group="${group}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  const roleCards = document.querySelectorAll('#staffHierarchyGrid .role-card');
  roleCards.forEach(card => {
    if (group === 'all' || card.dataset.group === group) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// --- Recent Store Activity Ticker Simulation ---
function initLiveActivity() {
  const ticker = document.getElementById('liveActivityTicker');
  if (!ticker) return;

  const mockPurchases = [
    { player: 'ShadowKnight_99', item: 'THE SCYTHE Rank', time: '2m ago' },
    { player: 'Aarav_PvP', item: 'MVP+ Rank', time: '5m ago' },
    { player: 'Vortex_Gamer', item: 'Prime Key x3', time: '8m ago' },
    { player: 'MysticRohan', item: 'Xavien Key', time: '11m ago' },
    { player: 'CyberBeast', item: 'VIP+ Rank', time: '14m ago' },
    { player: 'ToxicCrusher', item: 'Spawner Key x5', time: '19m ago' },
    { player: 'PhantomKing', item: 'Party Key x2', time: '23m ago' }
  ];

  ticker.innerHTML = mockPurchases.map(p => `
    <div class="ticker-purchase">
      <i class="fa-solid fa-bag-shopping text-cyan"></i>
      <strong>${p.player}</strong> purchased <span class="tag">${p.item}</span>
      <small style="color: var(--text-dim);">(${p.time})</small>
    </div>
  `).join('');
}

// ==========================================================================
// REAL-TIME MINECRAFT SERVER STATUS & PLAYER COUNT (PLAY.SCYTHEMC.FUN)
// Connects directly to the live server via public status APIs with fallback
// ==========================================================================
const MC_SERVER_HOST = 'play.scythemc.fun';

async function fetchLiveServerStatus() {
  const countEl = document.getElementById('onlinePlayerCount');
  const dropdownCount = document.getElementById('dropdownPlayersCount');
  const statusPill = document.getElementById('liveStatusPill');
  const livePingDot = document.getElementById('livePingDot');
  const livePingRipple = document.getElementById('livePingRipple');
  const heroConnectText = document.getElementById('heroConnectText');

  let isOnline = false;
  let playersOnline = 0;
  let playersMax = 0;

  // 1. Primary query: api.mcstatus.io (Fast, direct Velocity ping, CORS enabled)
  try {
    const res = await fetch(`https://api.mcstatus.io/v2/status/java/${MC_SERVER_HOST}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      isOnline = !!data.online;
      if (isOnline && data.players) {
        playersOnline = typeof data.players.online === 'number' ? data.players.online : 0;
        playersMax = typeof data.players.max === 'number' ? data.players.max : 0;
      }
    } else {
      throw new Error(`mcstatus status ${res.status}`);
    }
  } catch (primaryErr) {
    // 2. Fallback query: api.mcsrvstat.us
    try {
      const fallbackRes = await fetch(`https://api.mcsrvstat.us/3/${MC_SERVER_HOST}`);
      if (fallbackRes.ok) {
        const fbData = await fallbackRes.json();
        isOnline = !!fbData.online;
        if (isOnline && fbData.players) {
          playersOnline = typeof fbData.players.online === 'number' ? fbData.players.online : 0;
          playersMax = typeof fbData.players.max === 'number' ? fbData.players.max : 0;
        }
      }
    } catch (fbErr) {
      console.warn('Unable to query Minecraft live server status:', fbErr);
    }
  }

  // Update UI Elements with real server metrics
  if (countEl) {
    countEl.textContent = playersOnline;
  }
  if (dropdownCount) {
    dropdownCount.textContent = playersOnline;
  }

  if (statusPill) {
    if (isOnline) {
      statusPill.textContent = 'ONLINE';
      statusPill.classList.remove('status-offline');
      statusPill.classList.add('status-online');
    } else {
      statusPill.textContent = 'OFFLINE';
      statusPill.classList.remove('status-online');
      statusPill.classList.add('status-offline');
    }
  }

  if (livePingDot && livePingRipple) {
    if (isOnline) {
      livePingDot.classList.remove('dot-offline');
      livePingRipple.classList.remove('ripple-offline');
    } else {
      livePingDot.classList.add('dot-offline');
      livePingRipple.classList.add('ripple-offline');
    }
  }

  if (heroConnectText) {
    if (isOnline) {
      if (playersOnline > 0) {
        heroConnectText.textContent = `JOIN ${playersOnline} PLAYER${playersOnline === 1 ? '' : 'S'} ONLINE RIGHT NOW`;
      } else {
        heroConnectText.textContent = `SERVER ONLINE • BE THE FIRST TO JOIN!`;
      }
    } else {
      heroConnectText.textContent = `SERVER DOMAIN: PLAY.SCYTHEMC.FUN:25565`;
    }
  }
}

function initPlayerCountPulse() {
  // Query immediately on page load
  fetchLiveServerStatus();

  // Poll live count every 20 seconds
  setInterval(fetchLiveServerStatus, 20000);
}

// ==========================================================================
// AMBIENT MINECRAFT PARTICLES (LalaMC / Hypixel Production Standard)
// Live Minecraft Gold Coins (#fbbf24) & Electric Cyan / Violet Embers
// ==========================================================================
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const PARTICLE_COUNT = 38;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 2.5,
      speedX: (Math.random() - 0.5) * 0.45,
      speedY: -(Math.random() * 0.5 + 0.2), // Rising gently like in-game portal/fire embers
      type: Math.random() > 0.65 ? 'coin' : 'ember',
      opacity: Math.random() * 0.6 + 0.25,
      pulse: Math.random() * Math.PI,
      color: Math.random() > 0.5 ? '#00f5ff' : '#8b5cf6'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y += p.speedY;
      p.x += p.speedX;
      p.pulse += 0.025;

      if (p.y < -15) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.save();
      const currentOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.globalAlpha = Math.max(0, currentOpacity);

      if (p.type === 'coin') {
        // Minecraft 16-bit Pixel Gold Coin
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size + 1, p.size + 1);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(Math.round(p.x) + 1, Math.round(p.y) + 1, p.size - 1, p.size - 1);
      } else {
        // Minecraft Portal & Soul Embers
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }
      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

// --- Modes Navigation Helper ---
function toggleModesDropdown(e) {
  if (e) e.stopPropagation();
  switchTab('modes');
}
window.toggleModesDropdown = toggleModesDropdown;

// --- Player Minecraft IGN Management ---
function openIgnModal() {
  playSound('click');
  const modal = document.getElementById('ignModalBackdrop');
  if (modal) modal.classList.add('active');
  const input = document.getElementById('ignModalInput');
  const currentIgn = localStorage.getItem('scythe_ign') || '';
  if (input) {
    input.value = currentIgn;
    previewIgnSkin(currentIgn);
    setTimeout(() => input.focus(), 100);
  }
}

function closeIgnModal() {
  const modal = document.getElementById('ignModalBackdrop');
  if (modal) modal.classList.remove('active');
}

function previewIgnSkin(name) {
  const clean = name.trim() || 'Steve';
  const avatar = document.getElementById('ignModalAvatar');
  const label = document.getElementById('ignModalPreviewName');
  if (avatar) avatar.src = `https://mc-heads.net/avatar/${encodeURIComponent(clean)}/80`;
  if (label) label.textContent = clean;
}

function savePlayerIgn() {
  const input = document.getElementById('ignModalInput');
  const ign = (input?.value || '').trim() || 'Steve';
  localStorage.setItem('scythe_ign', ign);
  
  // Sync to header button
  const navAvatar = document.getElementById('avatarImg');
  const navName = document.getElementById('navIgnName');
  if (navAvatar) navAvatar.src = `https://mc-heads.net/avatar/${encodeURIComponent(ign)}/32`;
  if (navName) navName.textContent = ign.length > 10 ? ign.substring(0, 9) + '…' : ign;
  
  // Sync to cart IGN input
  const cartInput = document.getElementById('cartUsernameInput');
  if (cartInput) {
    cartInput.value = ign;
    updateCartAvatar(ign);
  }
  
  playSound('success');
  closeIgnModal();
  showToast(`Minecraft IGN set to <strong>${ign}</strong>!`, 'success');
}

function loadSavedIgn() {
  const ign = localStorage.getItem('scythe_ign');
  if (ign) {
    const navAvatar = document.getElementById('avatarImg');
    const navName = document.getElementById('navIgnName');
    if (navAvatar) navAvatar.src = `https://mc-heads.net/avatar/${encodeURIComponent(ign)}/32`;
    if (navName) navName.textContent = ign.length > 10 ? ign.substring(0, 9) + '…' : ign;
    
    const cartInput = document.getElementById('cartUsernameInput');
    if (cartInput) {
      cartInput.value = ign;
      updateCartAvatar(ign);
    }
  }
}

// --- Explicit Global Window Export for HTML onclick Handlers ---
window.switchTab = switchTab;
window.filterStore = filterStore;
function scrollToFeatures() {
  playSound('click');
  const el = document.querySelector('.features-section');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
window.scrollToFeatures = scrollToFeatures;

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.updateCartAvatar = updateCartAvatar;
window.applyCoupon = applyCoupon;
window.redeemWithCoins = redeemWithCoins;
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
window.simulateCompletePayment = simulateCompletePayment;
window.copyServerIp = copyServerIp;
window.fetchLiveServerStatus = fetchLiveServerStatus;
window.copyCouponCode = copyCouponCode;
window.showToast = showToast;
window.filterRules = filterRules;
window.filterStaff = filterStaff;
window.openIgnModal = openIgnModal;
window.closeIgnModal = closeIgnModal;
window.previewIgnSkin = previewIgnSkin;
window.savePlayerIgn = savePlayerIgn;
window.loadSavedIgn = loadSavedIgn;
window.toggleModesDropdown = toggleModesDropdown;
window.toggleMobileMenu = toggleMobileMenu;
window.toggleAudio = toggleAudio;
window.playSound = playSound;

// --- Initial Execution (Handles both fast-loaded and deferred execution) ---
function initApp() {
  loadCart();
  renderCart();
  initPlayerCountPulse();
  initAmbientCanvas();
  loadSavedIgn();
  renderMobilePerkCard('vip');

  // Check URL Hash for direct section linking
  const hash = window.location.hash.replace('#', '');
  if (['home', 'modes', 'store', 'rules', 'staff'].includes(hash)) {
    switchTab(hash);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
