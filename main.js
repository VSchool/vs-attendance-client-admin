/**************************************************************************** */
const ATTENDANCE_API_BASE_URL = (location.origin === 'http://127.0.0.1:5500' || location.origin === 'https://talented-egret-safely.ngrok-free.app')
    ? 'http://localhost:8080' :
    location.origin === 'https://qa-vschool-client-admin.surge.sh' ?
        'https://qa-vs-attendance-api.onrender.com' :
        'https://vs-attendance-api.onrender.com';
const QR_CODE_ID = 'qrcode';
const ERROR_ID = 'error';
const LOADING_ID = 'loading';
/**************************************************************************** */


const qrCodeContainer = document.querySelector('section');

const getQRCodeDataUrl = () => fetch(`${ATTENDANCE_API_BASE_URL}/api/qr-code/generate`).then(res => res.json()).then(data => data.dataUrl)
const createQrCodeImg = (dataUrl) => {
    const img = document.createElement('img');
    img.setAttribute('src', dataUrl);
    img.setAttribute('id', QR_CODE_ID);
    img.setAttribute('alt', 'qr-code');
    return img
}

const removeEl = (id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
}

const updateQRCode = async () => {
    const dataUrl = await getQRCodeDataUrl();
    removeEl(QR_CODE_ID);
    const img = createQrCodeImg(dataUrl);
    qrCodeContainer.appendChild(img)
}

const renderError = (err) => {
    const p = document.createElement('p');
    p.id = ERROR_ID
    p.textContent = err;
    qrCodeContainer.appendChild(p);
}

const renderLoading = () => {
    const p = document.createElement('p');
    p.id = LOADING_ID;
    p.innerText = 'Verifying...';
    qrCodeContainer.appendChild(p);
}

const startQRCodeGenerationCycle = (config) => {
    let interval;
    const startInterval = () => updateQRCode()
        .then(() => {
            removeEl(LOADING_ID);
            removeEl(ERROR_ID);
            if (interval) clearInterval(interval);
            interval = setInterval(startInterval, config.interval);
        })
        .catch((err => {
            console.error(err)
            removeEl(LOADING_ID);
            removeEl(ERROR_ID);
            renderError(err.message);
            clearInterval(interval);
        }))
    startInterval();
    window.addEventListener('close', () => {
        interval = clearInterval(interval)
    })
}


const getConfig = async () => {
    const config = await fetch(`${ATTENDANCE_API_BASE_URL}/api/qr-code/config`)
        .then(res => res.json())
        .then(data => data.config);
    return config
}

const onPageLoad = async () => {
    try {
        renderLoading();
        const config = await getConfig();
        startQRCodeGenerationCycle(config);
    } catch (err) {
        console.error(err);
        removeEl(LOADING_ID)
        renderError('There was a problem retrieving configuration settings');
    }
}

window.addEventListener('load', onPageLoad)