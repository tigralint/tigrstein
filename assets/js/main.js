/* * OMEGA OS SYSTEM CORE v2.0 (TIGRANES EDITION)
 * Handles: Audio, Global State, UI Effects, Cross-Module Sync
 */

// --- 1. ГЛОБАЛЬНОЕ СОСТОЯНИЕ (MEMORY) ---
const OmegaSystem = {
    state: {
        user: "TIGRANES",
        balance: 999999999999, // Бесконечность
        panicLevel: 15,       // %
        isMuted: false,
        modulesUnlocked: true
    },

    // Загрузка состояния из памяти браузера
    init() {
        const saved = localStorage.getItem('omega_state');
        if (saved) {
            this.state = { ...this.state, ...JSON.parse(saved) };
        }
        // Принудительно ставим имя Владельца
        this.state.user = "TIGRANES"; 
        this.save();
        console.log("OMEGA CORE: INITIALIZED. WELCOME, " + this.state.user);
    },

    // Сохранение
    save() {
        localStorage.setItem('omega_state', JSON.stringify(this.state));
    },

    // Обновление данных (вызывать из любых модулей)
    update(key, value) {
        this.state[key] = value;
        this.save();
        // Отправляем событие обновления, чтобы другие вкладки узнали
        window.dispatchEvent(new CustomEvent('omega-update', { detail: { key, value } }));
    },

    // Получить данные
    get(key) {
        return this.state[key];
    }
};

// Запуск ядра
OmegaSystem.init();

// --- 2. АУДИО СИСТЕМА ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, vol = 0.1) {
    if (OmegaSystem.state.isMuted) return; // Если выключен звук, выходим
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// Переключатель звука
function toggleGlobalMute() {
    OmegaSystem.state.isMuted = !OmegaSystem.state.isMuted;
    OmegaSystem.save();
    return OmegaSystem.state.isMuted;
}

// Звук наведения (тихий скан)
function soundHover() {
    playTone(1200, 'sine', 0.05, 0.02);
}

// Звук клика (четкий)
function soundClick() {
    playTone(600, 'square', 0.05, 0.1);
    setTimeout(() => playTone(300, 'triangle', 0.05, 0.1), 40);
}

// Звук ошибки (баззер)
function soundDeny() {
    playTone(150, 'sawtooth', 0.3, 0.2);
    playTone(100, 'sawtooth', 0.3, 0.2);
}

// Звук печати (механика)
function soundType() {
    if(Math.random() > 0.5) playTone(800, 'square', 0.02, 0.05);
}

// --- 3. UI ЭФФЕКТЫ ---

// Эффект входящего звонка (теперь глобальный)
function triggerIncomingCall(callerName = "UNKNOWN", imgSrc = "../assets/img/epstein_mugshot.jpg") {
    if(document.getElementById('incoming-overlay')) return;
    soundClick();
    
    const overlay = document.createElement('div');
    overlay.id = 'incoming-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.95); z-index: 99999;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        animation: flashRed 1s infinite;
    `;
    
    overlay.innerHTML = `
        <style>
            @keyframes flashRed { 0% {box-shadow: inset 0 0 0 red;} 50% {box-shadow: inset 0 0 100px red;} 100% {box-shadow: inset 0 0 0 red;} }
            .call-card { border: 2px solid red; padding: 40px; background: #000; text-align: center; max-width: 400px; width: 90%; }
            .call-img { width: 150px; height: 150px; border-radius: 50%; border: 3px solid red; object-fit: cover; margin-bottom: 20px; animation: shake 0.5s infinite; filter: grayscale(100%); }
            @keyframes shake { 0% {transform: translate(0,0);} 25% {transform: translate(2px,2px);} 50% {transform: translate(-2px,-2px);} 75% {transform: translate(-2px,2px);} }
        </style>
        <div class="call-card">
            <h1 style="color: red; margin: 0; font-family: 'Share Tech Mono';">INCOMING SECURE LINE</h1>
            <p style="color: #fff; letter-spacing: 2px; margin: 20px 0;">SOURCE: ${callerName}</p>
            <img src="${imgSrc}" class="call-img" alt="Caller">
            <div style="display: flex; gap: 20px; justify-content: center;">
                <button class="btn" onclick="window.acceptCall()" style="border-color: #00ff41; color: #00ff41;">ACCEPT</button>
                <button class="btn" onclick="window.rejectCall()" style="border-color: red; color: red;">DENY</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);

    // Рингтон
    window.ringInterval = setInterval(() => {
        if(!OmegaSystem.state.isMuted) {
            playTone(880, 'square', 0.2);
            setTimeout(() => playTone(660, 'square', 0.2), 250);
        }
    }, 1000);
}

window.rejectCall = function() {
    clearInterval(window.ringInterval);
    const overlay = document.getElementById('incoming-overlay');
    if(overlay) overlay.remove();
    soundDeny();
};

window.acceptCall = function() {
    clearInterval(window.ringInterval);
    const overlay = document.getElementById('incoming-overlay');
    overlay.innerHTML = `
        <div style="color: var(--term-green); font-size: 20px; font-family: 'Courier New'; text-align: center; padding: 20px;">
            > HANDSHAKE ESTABLISHED... <br>
            > DECRYPTING VOICE PACKETS... <br><br>
            <span style="color: red;">ERROR: CONNECTION TERMINATED BY SOURCE.</span>
        </div>
    `;
    setTimeout(() => {
        if(overlay) overlay.remove();
    }, 3000);
};

// --- 4. ИНИЦИАЛИЗАЦИЯ СОБЫТИЙ ---
document.addEventListener('DOMContentLoaded', () => {
    // Вешаем звуки на все интерактивные элементы
    const addSounds = () => {
        document.querySelectorAll('button, a, input, .nav-btn').forEach(el => {
            if(el.dataset.hasSound) return; // Чтобы не вешать дважды
            el.dataset.hasSound = "true";
            el.addEventListener('mouseenter', soundHover);
            el.addEventListener('click', soundClick);
        });
    };
    
    addSounds();
    // Наблюдатель за новыми элементами (если динамически добавим кнопку)
    const observer = new MutationObserver(addSounds);
    observer.observe(document.body, { childList: true, subtree: true });
});