function openFile(target) {
    // Простой показ модального окна с инфой про Трампа/Эпштейна
    document.querySelectorAll('.modal').forEach(el => el.classList.add('hidden'));
    document.getElementById('modal-' + target).classList.remove('hidden');
    
    // Звук открытия папки
    // playAudio('paper_shuffle.mp3'); 
}

function unlockSigma() {
    const userFolder = document.getElementById('user-folder');
    const bgAudio = document.getElementById('bg-ambience');
    const dropAudio = document.getElementById('sigma-drop');
    const overlay = document.getElementById('sigma-overlay');

    // 1. Останавливаем фоновый эмбиент
    bgAudio.pause();

    // 2. Запускаем ДРОП "Are you man enough"
    dropAudio.currentTime = 0;
    dropAudio.play();
    dropAudio.volume = 1.0;

    // 3. Показываем твое лицо на весь экран
    overlay.classList.remove('hidden');

    // 4. Добавляем визуальные эффекты под бит (синхронизация JS)
    // Допустим, бит бьет каждые 0.6 секунды
    setInterval(() => {
        const img = document.querySelector('.sigma-img');
        img.style.filter = 'invert(1)'; // Мерцание негативом
        setTimeout(() => img.style.filter = 'grayscale(100%)', 100);
    }, 600);
}

// ПАСХАЛКА: Лог чата
console.log("INTERCEPTED MESSAGE [ENCRYPTED]:");
console.log("TRUMP: Boss, the plan is in motion.");
console.log("YOU: Good. Buy more tanning spray. Keep them distracted.");
console.log("TRUMP: Yes, sir.");