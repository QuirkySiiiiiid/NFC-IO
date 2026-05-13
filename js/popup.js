/* popup.js — NFC popup: show, hide, vCard, copy */

// ── Config: fill in your real details ──
const CARD_DATA = {
  firstName:  'YOUR',
  lastName:   'NAME',
  fullName:   'YOUR NAME',
  title:      'Your Title & Role',
  company:    'Your Company',
  phone:      '+1234567890',
  phoneLabel: '+1 234 567 890',
  email:      'your@email.com',
  website:    'https://yoursite.com',
  instagram:  'https://instagram.com/yourhandle',
  linkedin:   'https://linkedin.com/in/yourhandle',
  facebook:   'https://facebook.com/yourhandle',
  spotify:    'https://open.spotify.com/user/yourhandle',
};

// ── vCard generator ──
function generateVCard() {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${CARD_DATA.fullName}`,
    `N:${CARD_DATA.lastName};${CARD_DATA.firstName};;;`,
    `TITLE:${CARD_DATA.title}`,
    `ORG:${CARD_DATA.company}`,
    `TEL;TYPE=CELL:${CARD_DATA.phone}`,
    `EMAIL;TYPE=INTERNET:${CARD_DATA.email}`,
    `URL:${CARD_DATA.website}`,
    `X-SOCIALPROFILE;TYPE=instagram:${CARD_DATA.instagram}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${CARD_DATA.linkedin}`,
    'END:VCARD'
  ].join('\r\n');
}

function downloadVCard() {
  const vcf  = generateVCard();
  const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${CARD_DATA.fullName.replace(/\s+/g, '_')}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Contact saved!');
}

// ── Toast helper ──
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.remove('hide');
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.classList.remove('show');
    t.classList.add('hide');
  }, 2400);
}

// ── Copy to clipboard ──
function copyText(text, label) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast(`${label} copied`));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(`${label} copied`);
  }
}

// ── Popup control ──
const overlay = document.getElementById('nfcPopup');

function openPopup() {
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // mobile: lock scroll behind sheet
  overlay.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
}

function closePopup() {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// close on overlay click (not card)
overlay.addEventListener('click', e => {
  if (e.target === overlay) closePopup();
});

// close button
document.getElementById('nfcClose').addEventListener('click', closePopup);

// keyboard Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePopup();
});

// ── Mobile swipe-down to close ──
let startY = 0;
overlay.addEventListener('touchstart', e => {
  startY = e.touches[0].clientY;
}, { passive: true });

overlay.addEventListener('touchend', e => {
  const dy = e.changedTouches[0].clientY - startY;
  if (dy > 80) closePopup();
}, { passive: true });

// ── NFC trigger buttons ──
document.querySelectorAll('[data-nfc-open]').forEach(btn => {
  btn.addEventListener('click', openPopup);
});

// ── Action handlers ──
document.getElementById('actionCall').addEventListener('click', () => {
  window.location.href = `tel:${CARD_DATA.phone}`;
});

document.getElementById('actionCopyPhone').addEventListener('click', () => {
  copyText(CARD_DATA.phone, 'Phone number');
});

document.getElementById('actionEmail').addEventListener('click', () => {
  window.location.href = `mailto:${CARD_DATA.email}`;
});

document.getElementById('actionWhatsapp').addEventListener('click', () => {
  window.open(`https://wa.me/${CARD_DATA.phone.replace(/\D/g, '')}`, '_blank');
});

document.getElementById('actionSave').addEventListener('click', downloadVCard);

// ── Auto-open on NFC tap (?nfc=1 or ?nfc=true in URL) ──
(function () {
  const params = new URLSearchParams(window.location.search);
  const nfcParam = params.get('nfc');

  if (nfcParam === '1' || nfcParam === 'true') {
    // slight delay for page paint
    setTimeout(openPopup, 600);
    return;
  }

  // first-visit auto-popup (optional — remove if not desired)
  // const visited = sessionStorage.getItem('nfc_visited');
  // if (!visited) {
  //   sessionStorage.setItem('nfc_visited', '1');
  //   setTimeout(openPopup, 800);
  // }
})();