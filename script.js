// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle cross-page anchor links (e.g., features.html#features)
document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.includes('.html#')) {
            // This is a cross-page anchor link
            const [page, anchor] = href.split('#');
            
            // Check if we're already on the target page
            if (window.location.pathname.includes(page)) {
                // Same page, use smooth scroll
                e.preventDefault();
                const target = document.querySelector('#' + anchor);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } else {
                // Different page, let the browser handle navigation
                // The target page should scroll to anchor on load
            }
        }
    });
});

// Handle anchor scrolling on page load
window.addEventListener('load', function() {
    const hash = window.location.hash;
    if (hash) {
        setTimeout(() => {
            const target = document.querySelector(hash);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    }
});

// Function to scroll to products section
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Payment Modal Functions
let currentProduct = '';
let currentPrice = '';

function openPaymentModal(productName) {
    currentProduct = productName;
    const modal = document.getElementById('paymentModal');
    const gameElement = document.getElementById('selectedGame');
    const packageElement = document.getElementById('selectedPackage');
    const priceElement = document.getElementById('selectedPrice');
    
    if (gameElement) gameElement.textContent = productName;
    if (packageElement) packageElement.textContent = 'Pilih paket terlebih dahulu';
    if (priceElement) priceElement.textContent = 'Pilih paket terlebih dahulu';
    
    // Set game selection
    const gameSelect = document.getElementById('gameSelect');
    if (gameSelect) {
        gameSelect.value = productName;
    }
    
    // Reset form
    const paymentForm = document.querySelector('.payment-form');
    if (paymentForm) {
        paymentForm.reset();
    }
    
    // Set game selection again after reset
    if (gameSelect) {
        gameSelect.value = productName;
    }
    
    // Clear payment details
    const paymentDetails = document.getElementById('paymentDetails');
    if (paymentDetails) {
        paymentDetails.innerHTML = '';
    }
    
    // Clear file preview
    const filePreview = document.getElementById('filePreview');
    if (filePreview) {
        filePreview.style.display = 'none';
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Update price when package is selected
function updatePrice() {
    const gameSelect = document.getElementById('gameSelect');
    const packageSelect = document.getElementById('packageSelect');
    const gameElement = document.getElementById('selectedGame');
    const packageElement = document.getElementById('selectedPackage');
    const priceElement = document.getElementById('selectedPrice');
    
    const prices = {
        'Mobile Legends': {
            'mingguan': { name: 'Paket Mingguan', price: 'Rp 30.000' },
            'bulanan': { name: 'Paket Bulanan', price: 'Rp 50.000' },
            'season': { name: 'Paket Season', price: 'Rp 80.000' },
            'permanen': { name: 'Paket Permanen', price: 'Rp 250.000' }
        },
        'Free Fire': {
            'mingguan': { name: 'Paket Mingguan', price: 'Rp 30.000' },
            'bulanan': { name: 'Paket Bulanan', price: 'Rp 50.000' },
            'season': { name: 'Paket Season', price: 'Rp 80.000' },
            'permanen': { name: 'Paket Permanen', price: 'Rp 250.000' }
        },
        'PUBG Mobile': {
            'mingguan': { name: 'Paket Mingguan', price: 'Rp 30.000' },
            'bulanan': { name: 'Paket Bulanan', price: 'Rp 50.000' },
            'season': { name: 'Paket Season', price: 'Rp 80.000' },
            'permanen': { name: 'Paket Permanen', price: 'Rp 250.000' }
        }
    };
    
    // Update current product if game selection changed
    if (gameSelect && gameSelect.value) {
        currentProduct = gameSelect.value;
        if (gameElement) gameElement.textContent = currentProduct;
    }
    
    if (packageSelect && packageSelect.value && currentProduct) {
        const selectedPackage = prices[currentProduct][packageSelect.value];
        if (selectedPackage) {
            if (packageElement) packageElement.textContent = selectedPackage.name;
            if (priceElement) priceElement.textContent = selectedPackage.price;
        }
    } else {
        if (packageElement) packageElement.textContent = 'Pilih paket terlebih dahulu';
        if (priceElement) priceElement.textContent = 'Pilih paket terlebih dahulu';
    }
}

// Handle form submission - Direct to WhatsApp
function handlePaymentSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const game = formData.get('game');
    const selectedPackage = formData.get('package');
    const paymentMethod = formData.get('paymentMethod');
    const whatsapp = formData.get('whatsapp');
    const file = formData.get('paymentProof');
    
    // Validasi form
    if (!game || !selectedPackage || !paymentMethod || !whatsapp || !file) {
        alert('Semua field harus diisi!');
        return;
    }
    
    // Validasi file
    if (file.size === 0) {
        alert('Bukti pembayaran harus diupload!');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
        alert('Ukuran file terlalu besar! Maksimal 5MB');
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar!');
        return;
    }
    
    // Tampilkan loading
    showLoadingModal();
    
    // Simulasi proses (3 detik)
    setTimeout(() => {
        hideLoadingModal();
        
        // Kirim ke WhatsApp dengan bukti pembayaran
        sendToWhatsApp(game, selectedPackage, paymentMethod, whatsapp, file);
        
        // Tutup modal
        document.getElementById('paymentModal').style.display = 'none';
        
        // Reset form
        event.target.reset();
        document.getElementById('filePreview').style.display = 'none';
        document.getElementById('paymentDetails').innerHTML = '';
        
        alert('PEMBAYARAN SEDANG DIKONFIRMASI HARAP TUNGGU SEBENTAR...');
    }, 3000);
}

function sendToWhatsApp(game, selectedPackage, paymentMethod, whatsapp, file) {
    // Buat pesan WhatsApp
    const message = `*KONFIRMASI PEMBAYARAN GAMESCHEAT.ID*

*Detail Pesanan:*
• Game: ${game}
• Paket: ${selectedPackage}
• Metode Pembayaran: ${paymentMethod}
• WhatsApp Pembeli: ${whatsapp}

*Instruksi Pembayaran:*
${getPaymentInstructions(paymentMethod)}

*Catatan:* 
Setelah melakukan pembayaran, silakan kirim bukti pembayaran ke nomor WhatsApp ini untuk konfirmasi.

Terima kasih telah memilih gamescheat.id! 🎮`;

    // Encode pesan untuk URL WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/6283857228661?text=${encodedMessage}`;
    
    // Buka WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Tampilkan pesan sukses
    alert('WhatsApp telah dibuka! Silakan kirim bukti pembayaran Anda untuk konfirmasi.');
}

function getPaymentInstructions(paymentMethod) {
    switch(paymentMethod) {
        case 'qris':
            return 'Scan QRIS yang tersedia di website kami.';
        case 'dana':
            return 'Transfer ke DANA: 083857228661';
        case 'gopay':
            return 'Transfer ke GoPay: 083857228657';
        case 'shopeepay':
            return 'Transfer ke ShopeePay: 083857228657';
        default:
            return 'Pilih metode pembayaran yang tersedia.';
    }
}

// Function to show loading modal
function showLoadingModal() {
    const loadingModal = document.getElementById('loadingModal');
    loadingModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Function to hide loading modal
function hideLoadingModal() {
    const loadingModal = document.getElementById('loadingModal');
    loadingModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Function to handle file upload preview
function handleFileUpload() {
    const fileInput = document.getElementById('paymentProof');
    const filePreview = document.getElementById('filePreview');
    const fileName = filePreview.querySelector('.file-name');
    
    if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        fileName.textContent = file.name;
        filePreview.style.display = 'flex';
    } else {
        filePreview.style.display = 'none';
    }
}

// Function to remove uploaded file
function removeFile() {
    const fileInput = document.getElementById('paymentProof');
    const filePreview = document.getElementById('filePreview');
    
    fileInput.value = '';
    filePreview.style.display = 'none';
}

// Function to show payment details
function showPaymentDetails(paymentMethod) {
    const paymentDetails = document.getElementById('paymentDetails');
    
    // Set radio button
    const radioButton = document.querySelector(`input[name="paymentMethod"][value="${paymentMethod}"]`);
    if (radioButton) {
        radioButton.checked = true;
    }
    
    // Debug: Log payment method
    console.log('Payment method selected:', paymentMethod);
    
    let content = '';
    
    switch(paymentMethod) {
        case 'qris':
            content = `
                <div class="payment-detail-content">
                    <h4>Pembayaran QRIS</h4>
                    <div class="qr-code">
                        <img src="WhatsApp Image 2025-09-04 at 02.14.59.jpeg" 
                             alt="QR Code Pembayaran" 
                             style="max-width: 200px; max-height: 200px; border-radius: 10px; border: 2px solid #8b5cf6; display: block; margin: 0 auto; background: white; padding: 10px;"
                             onerror="this.onerror=null; this.src='https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=gamescheat.id-payment'">
                        <p style="text-align: center; color: #8b5cf6; font-size: 12px; margin: 10px 0 0 0; font-weight: bold;">QR CODE PEMBAYARAN</p>
                        <p style="text-align: center; color: #e2e8f0; font-size: 10px; margin: 5px 0 0 0;">Scan dengan aplikasi mobile banking</p>
                    </div>
                </div>
            `;
            break;
            
        case 'dana':
            content = `
                <div class="payment-detail-content">
                    <h4>Pembayaran DANA</h4>
                    <div class="account-info">
                        <p><strong>Nomor DANA:</strong></p>
                        <div class="account-number">083857228661</div>
                        <button class="copy-btn" onclick="copyToClipboard('083857228661')">Salin Nomor</button>
                    </div>
                </div>
            `;
            break;
            
        case 'gopay':
            content = `
                <div class="payment-detail-content">
                    <h4>Pembayaran GoPay</h4>
                    <div class="account-info">
                        <p><strong>Nomor GoPay:</strong></p>
                        <div class="account-number">083857228657</div>
                        <button class="copy-btn" onclick="copyToClipboard('083857228657')">Salin Nomor</button>
                    </div>
                </div>
            `;
            break;
            
        case 'shopeepay':
            content = `
                <div class="payment-detail-content">
                    <h4>Pembayaran ShopeePay</h4>
                    <div class="account-info">
                        <p><strong>Nomor ShopeePay:</strong></p>
                        <div class="account-number">083857228657</div>
                        <button class="copy-btn" onclick="copyToClipboard('083857228657')">Salin Nomor</button>
                    </div>
                </div>
            `;
            break;
    }
    
    if (paymentDetails) {
        paymentDetails.innerHTML = content;
        
        // Debug: Test QR Code loading for QRIS
        if (paymentMethod === 'qris') {
            setTimeout(() => {
                const qrImg = paymentDetails.querySelector('.qr-code img');
                if (qrImg) {
                    console.log('QR Image element found:', qrImg);
                    console.log('QR Image src:', qrImg.src);
                    console.log('QR Image complete:', qrImg.complete);
                    console.log('QR Image naturalWidth:', qrImg.naturalWidth);
                    
                    // Test if image loads
                    qrImg.onload = function() {
                        console.log('QR Image loaded successfully!');
                        console.log('Image dimensions:', qrImg.naturalWidth + 'x' + qrImg.naturalHeight);
                    };
                    
                    qrImg.onerror = function() {
                        console.log('QR Image failed to load, using fallback');
                        console.log('Failed URL:', qrImg.src);
                    };
                    
                    // Force reload if not loaded after 2 seconds
                    setTimeout(() => {
                        if (!qrImg.complete || qrImg.naturalWidth === 0) {
                            console.log('Image still not loaded, forcing reload...');
                            const originalSrc = qrImg.src;
                            qrImg.src = '';
                            qrImg.src = originalSrc;
                        }
                    }, 2000);
                } else {
                    console.log('QR Image element not found!');
                }
            }, 100);
        }
    }
    
    // Show/hide payment instructions
    const instructionItems = document.querySelectorAll('.instruction-item');
    instructionItems.forEach(item => {
        item.style.display = 'none';
    });
    
    const instructionItem = document.getElementById(`${paymentMethod}-instruction`);
    if (instructionItem) {
        instructionItem.style.display = 'block';
    }
}

// Function to copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        // Show success message
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Tersalin!';
        button.style.background = 'linear-gradient(45deg, #10b981, #059669)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'linear-gradient(45deg, #dc2626, #ef4444)';
        }, 2000);
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
        alert('Gagal menyalin nomor. Silakan salin manual: ' + text);
    });
}

// Function to open WhatsApp from contact section
function openWhatsApp() {
    const whatsappMessage = `Halo, saya tertarik dengan layanan cheat gaming dari GameCheat.id. Bisa info lebih lanjut?`;
    const whatsappUrl = `https://wa.me/6283857228661?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
}

// Close modal functions
function closeModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('paymentModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with X button
document.querySelector('.close').addEventListener('click', closeModal);

// Close modal with Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.98)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
    }
});

// Add animation to product cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all product cards
document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe all feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add click effect to buttons
document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// Add hover effect to payment cards
document.querySelectorAll('.modal-payment-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animation to hero content
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 100);
    
    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-content h1');
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    setTimeout(typeWriter, 1000);
    
    // Add event listeners for payment form
    const gameSelect = document.getElementById('gameSelect');
    const packageSelect = document.getElementById('packageSelect');
    
    if (gameSelect) {
        gameSelect.addEventListener('change', updatePrice);
    }
    
    if (packageSelect) {
        packageSelect.addEventListener('change', updatePrice);
    }
    
    const paymentForm = document.querySelector('.payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmission);
    }
    
    // Add event listener for file upload
    const fileInput = document.getElementById('paymentProof');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Add event listeners for payment method radio buttons
    const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                showPaymentDetails(this.value);
            }
        });
    });
});
