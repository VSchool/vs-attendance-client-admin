//  retrieve the access token
const ATTENDANCE_API_BASE_URL = 'https://vs-attendance-api.onrender.com/';
const QR_CODE_ID = 'qrcode';

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

const qrCodeContainer = document.querySelector('section');

window.addEventListener('load', () => {
    updateQRCode();
    const interval = setInterval(async () => {
        updateQRCode()
    }, (60 * 1000));

    window.addEventListener('close', () => {
        clearInterval(interval)
    })
})