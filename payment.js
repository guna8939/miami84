// Simple UPI Payment Modal System
function showUPIPaymentModal(packageDetails, packageType) {
    // Create the modal container
    const modal = document.createElement('div');
    modal.className = 'upi-payment-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        backdrop-filter: blur(5px);
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'upi-modal-content';
    modalContent.style.cssText = `
        background: #1a1a1a;
        border: 2px solid #ff8fb6;
        border-radius: 15px;
        padding: 2rem;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: none;
    `;
    
    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'upi-modal-header';
    modalHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #333;
    `;
    
    const headerTitle = document.createElement('h2');
    headerTitle.innerHTML = `<i class="fas fa-mobile-alt"></i> GPay/UPI Payment`;
    headerTitle.style.cssText = `
        font-family: 'Orbitron', sans-serif;
        background: linear-gradient(135deg, #ff8fb6, #97dbff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 1.5rem;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-upi-modal';
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        font-size: 2rem;
        color: #ff8fb6;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    
    modalHeader.appendChild(headerTitle);
    modalHeader.appendChild(closeBtn);
    
    // Package info
    const packageInfo = document.createElement('div');
    packageInfo.className = 'upi-package-info';
    packageInfo.style.cssText = `
        margin-bottom: 1.5rem;
    `;
    
    const packageTitle = document.createElement('h3');
    packageTitle.textContent = packageDetails.name;
    packageTitle.style.cssText = `
        font-family: 'Orbitron', sans-serif;
        background: linear-gradient(135deg, #ff8fb6, #dbb0f7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.5rem;
    `;
    
    const packagePrice = document.createElement('div');
    packagePrice.className = 'upi-package-price';
    packagePrice.textContent = '$' + packageDetails.price;
    packagePrice.style.cssText = `
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, #ff8fb6, #97dbff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 1.5rem;
    `;
    
    packageInfo.appendChild(packageTitle);
    packageInfo.appendChild(packagePrice);
    
    // QR code container
    const qrContainer = document.createElement('div');
    qrContainer.className = 'upi-qr-container';
    qrContainer.style.cssText = `
        display: flex;
        justify-content: center;
        margin-bottom: 1.5rem;
        background: white;
        padding: 1rem;
        border-radius: 10px;
        width: 250px;
        height: 250px;
        margin: 0 auto 1.5rem auto;
    `;
    
    // QR code image - using Gpayupiqr.png
    const qrImage = document.createElement('img');
    qrImage.src = 'Gpayupiqr.png';
    qrImage.alt = 'GPay/UPI QR Code';
    qrImage.className = 'upi-qr-image';
    qrImage.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: contain;
    `;
    
    qrContainer.appendChild(qrImage);
    
    // UPI information
    const upiInfo = document.createElement('div');
    upiInfo.className = 'upi-info';
    upiInfo.style.cssText = `
        margin-bottom: 1rem;
        text-align: left;
        padding: 1rem;
        background: #0a0a0a;
        border-radius: 10px;
    `;
    
    // UPI ID with copy button
    const upiIdContainer = document.createElement('div');
    upiIdContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
        background: #1a1a1a;
        padding: 0.5rem;
        border-radius: 5px;
        border: 1px solid #333;
    `;
    
    const upiIdLabel = document.createElement('span');
    upiIdLabel.textContent = 'UPI ID: miamirp@okbank';
    upiIdLabel.style.cssText = `
        font-weight: 600;
    `;
    
    const copyButton = document.createElement('button');
    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
    copyButton.style.cssText = `
        background: linear-gradient(135deg, #ff8fb6, #dbb0f7);
        color: white;
        border: none;
        border-radius: 5px;
        padding: 0.3rem 0.6rem;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    copyButton.onclick = function() {
        navigator.clipboard.writeText('miamirp@okbank').then(() => {
            copyButton.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        });
    };
    
    upiIdContainer.appendChild(upiIdLabel);
    upiIdContainer.appendChild(copyButton);
    
    // Instructions
    const instructions = document.createElement('ul');
    instructions.style.cssText = `
        list-style-type: none;
        padding-left: 0;
        margin-bottom: 1rem;
    `;
    
    const instructionItems = [
        'Scan with any UPI app (GPay, PhonePe, Paytm, etc.)',
        `Amount: $${packageDetails.price}`,
        'Include your Discord username in the payment note'
    ];
    
    instructionItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.style.cssText = `
            margin-bottom: 0.5rem;
            padding-left: 1.5rem;
            position: relative;
        `;
        
        const bulletPoint = document.createElement('span');
        bulletPoint.innerHTML = '•';
        bulletPoint.style.cssText = `
            position: absolute;
            left: 0;
            color: #ff8fb6;
        `;
        
        li.prepend(bulletPoint);
        instructions.appendChild(li);
    });
    
    // Note
    const note = document.createElement('p');
    note.textContent = 'Payment confirmation is automatic. Contact support if you have issues.';
    note.style.cssText = `
        margin-top: 1rem;
        font-style: italic;
        color: #cccccc;
        font-size: 0.9rem;
    `;
    
    // Assemble the UPI info
    upiInfo.appendChild(upiIdContainer);
    upiInfo.appendChild(instructions);
    upiInfo.appendChild(note);
    
    // Assemble modal content
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(packageInfo);
    modalContent.appendChild(qrContainer);
    modalContent.appendChild(upiInfo);
    modal.appendChild(modalContent);
    
    // Add to body
    document.body.appendChild(modal);
    
    // Close button event
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Escape key to close
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// Initialize payment buttons
function initPaymentButtons() {
    document.querySelectorAll('.package-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get package details
            const packageCard = this.closest('.package-card');
            let packageType = 'silver'; // Default
            
            if (packageCard) {
                if (packageCard.classList.contains('silver')) packageType = 'silver';
                else if (packageCard.classList.contains('gold')) packageType = 'gold';
                else if (packageCard.classList.contains('platinum')) packageType = 'platinum';
                else if (packageCard.classList.contains('diamond')) packageType = 'diamond';
            }
            
            // Package price mapping
            const packageDetails = {
                silver: { price: '9.99', name: 'Silver Package' },
                gold: { price: '19.99', name: 'Gold Package' },
                platinum: { price: '39.99', name: 'Platinum Package' },
                diamond: { price: '79.99', name: 'Diamond Package' }
            };
            
            // Show payment modal
            showUPIPaymentModal(packageDetails[packageType], packageType);
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initPaymentButtons);

// Also initialize for immediate execution in case the DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initPaymentButtons();
}

