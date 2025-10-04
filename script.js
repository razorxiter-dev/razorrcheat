const products = [
    {id:'clean-001', name:'CLEANER CHEATS (PC)', desc:'Tools ini berfungsi untuk menghapus jejak riwayat cheat di komputer anda. untuk menghindari terhadap check pc di kompetitif', priceLabel:[
        'Rp150.000 / 15$ Perbulan',
        'Rp350.000 / 25$ Permanen'
    ], image:'TOOLS CLEAN.jpeg', tag:'cleaner'},
    {id:'stream-002', name:'STREAM PANEL PC', desc:'panel stream adalah panel canggih tanpa jejak cheat, dan bisa inject melalui hp. cocok untuk kompetitif laga atau turnament', priceLabel:[
        'Rp100.000 10$ 7 DAY',
        'Rp250.000 20$ 30 DAY',
        'Rp350.000 25$ PERMANEN'
    ], image:'STREAM.jpeg', tag:'stream'},
    {id:'esp-003', name:'ESP STREAM PC', desc:'esp stream only bisa di combo & digabung dengan stream panel', priceLabel:[
        'Rp50.000 5$ 7 DAY',
        'Rp100.000 10$ 30 DAY',
        'Rp150.000 15$ 60 DAY'
    ], image:'ESP.png', tag:'esp'},
    {id:'elite-004', name:'BIOS ELITE PANEL', desc:'Panel canggih kelas Elite, Tanpa jejak Cheat & keunggulan yang tidak tertandingi', priceLabel:[
        'Rp6.000.000 500$ PERMANENT'
    ], image:'bios.jpeg', tag:'elite'},
    {id:'root-005', name:'ROOT', desc:'Root Android adalah proses untuk mendapatkan akses penuh (superuser) ke sistem operasi Android, bisa digunakan untuk menggunakan program cheat dan meningkatkan peforma ponsel. root ini sudah disediakan anti check byypas. aman untuk kualif dan kompetisi', priceLabel:[
        'Rp250.000 20$'
    ], image:'ROOT.jpeg', tag:'root'},
    {id:'bypass-006', name:'BYYPAS EMULATOR', desc:'Byypas emulator Untuk Hide & Samaran sebagai phone di emulator anda. menghilangkan logo pc di emulator', priceLabel:[
        'Rp60.000 6$ 7 DAY',
        'Rp120.000 13$ 2 WEEK',
        'Rp170.000 15$ 1 MONTH'
    ], image:'BYYPAS.jpeg', tag:'bypass'}
];

const formatIDR = (num) => new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR', maximumFractionDigits:0}).format(num);

const els = {
    grid: document.getElementById('productGrid'),
    count: document.getElementById('cartCount'),
    toast: document.getElementById('toast'),
    year: document.getElementById('year'),
    searchInput: document.getElementById('searchInput'),
    searchButton: document.getElementById('searchButton'),
    navToggle: document.getElementById('navToggle'),
    navMenu: document.getElementById('navMenu'),
    matrix: document.getElementById('matrixOverlay'),
    bgAudio: document.getElementById('bgAudio'),
    soundToggle: document.getElementById('soundToggle'),
    soundOverlay: document.getElementById('soundOverlay'),
    soundEnable: document.getElementById('soundEnable'),
    paymentModal: document.getElementById('paymentModal'),
    paymentBackdrop: document.getElementById('paymentBackdrop'),
    paymentClose: document.getElementById('paymentClose'),
    payForm: document.getElementById('payForm'),
    payProduct: document.getElementById('payProduct'),
    payMethod: document.getElementById('payMethod'),
    payNote: document.getElementById('payNote'),
    payCancel: document.getElementById('payCancel'),
    payPackageRow: document.getElementById('payPackageRow'),
    payPackage: document.getElementById('payPackage'),
    payDeviceRow: document.getElementById('payDeviceRow'),
    payDevice: document.getElementById('payDevice')
};

let cartCount = 0;

function renderProducts(list){
    const fragment = document.createDocumentFragment();
    list.forEach(p => {
        const card = document.createElement('article');
        card.className = 'card';
        const priceHtml = p.priceLabel ? `<ul class="price-list">${p.priceLabel.map(line => `<li>${line}</li>`).join('')}</ul>` : formatIDR(p.price);
        card.innerHTML = `
            <div class="card__media">
                <img src="${p.image}" alt="${p.name}">
                <span class="card__chip">${p.tag}</span>
            </div>
            <div class="card__body">
                <h3 class="card__title">${p.name}</h3>
                ${p.desc ? `<p class=\"card__desc\">${p.desc}</p>` : ''}
                <div class="card__price">${priceHtml}</div>
                <div class="card__actions">
                    <button class="btn btn--primary" data-buy="${p.id}">Beli Sekarang</button>
                </div>
            </div>
        `;
        fragment.appendChild(card);
    });
    els.grid.innerHTML = '';
    els.grid.appendChild(fragment);
}

function showToast(message){
    els.toast.textContent = message;
    els.toast.classList.add('toast--show');
    setTimeout(() => {
        els.toast.classList.remove('toast--show');
    }, 1800);
}

function attachEvents(){
    document.addEventListener('click', (e) => {
        const buyBtn = e.target.closest('button[data-buy]');
        if(buyBtn){
            const id = buyBtn.getAttribute('data-buy');
            const item = products.find(p => p.id === id);
            if(item){
                openPaymentModal(item);
            }
        }
    });

    els.searchButton.addEventListener('click', () => {
        const q = (els.searchInput.value || '').toLowerCase().trim();
        if(!q){
            renderProducts(products);
            return;
        }
        const filtered = products.filter(p => p.name.toLowerCase().includes(q) || p.tag.includes(q));
        renderProducts(filtered);
    });

    els.navToggle.addEventListener('click', () => {
        const isOpen = els.navMenu.classList.toggle('nav__list--open');
        els.navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Pesan terkirim. Kami akan balas via email.');
        e.target.reset();
    });

    // Payment modal events
    els.paymentBackdrop.addEventListener('click', closePaymentModal);
    els.paymentClose.addEventListener('click', closePaymentModal);
    els.payCancel.addEventListener('click', closePaymentModal);
    els.payForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const method = els.payMethod.value;
        const note = (els.payNote.value || '').trim();
        const product = els.payProduct.textContent || '';
        const pkg = els.payPackageRow.style.display !== 'none' ? (els.payPackage.value || '') : '';
        const dev = els.payDeviceRow.style.display !== 'none' ? (els.payDevice.value || '') : '';
        const msg = `Halo, saya ingin konfirmasi pembelian:%0A- Produk: ${encodeURIComponent(product)}%0A${pkg ? '- Paket: ' + encodeURIComponent(pkg) + '%0A' : ''}${dev ? '- Device: ' + encodeURIComponent(dev) + '%0A' : ''}- Metode: ${encodeURIComponent(method)}%0A- Catatan: ${encodeURIComponent(note)}`;
        const wa = 'https://wa.me/6283857228657?text=' + msg;
        window.open(wa, '_blank');
        closePaymentModal();
    });

    // Copy buttons
    document.addEventListener('click', async (e) => {
        const copyBtn = e.target.closest('button.copy-btn');
        if(copyBtn){
            const number = copyBtn.getAttribute('data-copy');
            try{
                await navigator.clipboard.writeText(number);
                showToast('Nomor disalin ke clipboard');
            }catch(err){
                showToast('Gagal menyalin nomor');
            }
        }
    });

    // Sound toggle + autoplay on first interaction (browser policy)
    const tryPlay = () => {
        if(!els.bgAudio) return;
        els.bgAudio.play().then(() => {
            els.soundToggle.setAttribute('aria-pressed','true');
            if(els.soundOverlay){ els.soundOverlay.setAttribute('aria-hidden','true'); }
        }).catch(() => {/* ignored: requires user gesture */});
        window.removeEventListener('click', tryPlay);
        window.removeEventListener('keydown', tryPlay);
    };
    window.addEventListener('click', tryPlay);
    window.addEventListener('keydown', tryPlay);
    if(els.soundToggle){
        els.soundToggle.addEventListener('click', () => {
            if(els.bgAudio.paused){
                els.bgAudio.play();
                els.soundToggle.setAttribute('aria-pressed','true');
                if(els.soundOverlay){ els.soundOverlay.setAttribute('aria-hidden','true'); }
            } else {
                els.bgAudio.pause();
                els.soundToggle.setAttribute('aria-pressed','false');
            }
        });
    }

    if(els.soundEnable){
        els.soundEnable.addEventListener('click', () => {
            tryPlay();
        });
    }
}

function init(){
    els.year.textContent = String(new Date().getFullYear());
    renderProducts(products);
    attachEvents();
    initMatrixOverlay();
}

document.addEventListener('DOMContentLoaded', init);

function initMatrixOverlay(){
    const canvas = els.matrix;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1 + Math.floor(Math.random()*40));
    }

    const glyphs = 'アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#+-*/=%_<>[]{}';
    const fontSize = 14;
    let columns = 0;
    let drops = [];

    resize();
    window.addEventListener('resize', resize);

    function draw(){
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#39ff14';
        ctx.font = fontSize + 'px Fira Code, monospace';

        for(let i=0;i<drops.length;i++){
            const text = glyphs.charAt(Math.floor(Math.random()*glyphs.length));
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            ctx.fillText(text, x, y);

            if(y > canvas.height && Math.random() > 0.975){
                drops[i] = 0;
            }
            drops[i]++;
        }
        requestAnimationFrame(draw);
    }
    draw();
}

function openPaymentModal(product){
    if(!els.paymentModal) return;
    els.paymentModal.setAttribute('aria-hidden', 'false');
    els.payProduct.textContent = product.name;
    // Populate package options if product has priceLabel
    if(Array.isArray(product.priceLabel) && (product.id === 'stream-002' || product.id === 'bypass-006')){
        els.payPackageRow.style.display = '';
        els.payPackage.innerHTML = product.priceLabel.map(v => `<option value="${v}">${v}</option>`).join('');
    } else {
        els.payPackageRow.style.display = 'none';
        els.payPackage.innerHTML = '';
    }

    // Device selector for CLEANER
    if(product.id === 'clean-001'){
        els.payDeviceRow.style.display = '';
    } else {
        els.payDeviceRow.style.display = 'none';
    }
}

function closePaymentModal(){
    if(!els.paymentModal) return;
    els.paymentModal.setAttribute('aria-hidden', 'true');
    els.payForm.reset();
}

