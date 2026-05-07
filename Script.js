document.querySelectorAll('#MenuBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.NavMenu').classList.toggle('viewing');
        document.querySelector('.NavBG').classList.toggle('viewing');
        document.querySelector('.NavBG_Gradient').classList.toggle('viewing');
    });
});