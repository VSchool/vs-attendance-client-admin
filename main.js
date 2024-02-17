const ATTENDANCE_API_BASE_URL = location.origin === 'http://127.0.0.1:5500' 
    ? 'http://localhost:8080' : 
    location.origin === 'https://qa-vschool-client-admin.surge.sh' ?
    'https://qa-vs-attendance-api.onrender.com':
    'https://vs-attendance-api.onrender.com';
    
const QR_CODE_ID = 'qrcode';
const INTERVAL_DURATION = 60 * 1000;

const qrCodeContainer = document.querySelector('section');

const getQRCodeDataUrl = () => fetch(`${ATTENDANCE_API_BASE_URL}/api/qr-code/generate`).then(res => res.json()).then(data => data.dataUrl)
const createQrCodeImg = (dataUrl) => {
    const img = document.createElement('img');
    img.setAttribute('src', dataUrl);
    img.setAttribute('id', QR_CODE_ID);
    img.setAttribute('alt', 'qr-code');
    return img
}
const removeExpiredQrCode = () => {
    const expired = document.getElementById(QR_CODE_ID);
    if (expired) expired.remove();
}

const updateQRCode = async () => {
    const dataUrl = await getQRCodeDataUrl();
    removeExpiredQrCode();
    const img = createQrCodeImg(dataUrl);
    qrCodeContainer.appendChild(img)
}


window.addEventListener('load', () => {
    updateQRCode();
    const interval = setInterval(async () => {
        updateQRCode()
    }, (INTERVAL_DURATION));

    window.addEventListener('close', () => {
        clearInterval(interval)
    })
})