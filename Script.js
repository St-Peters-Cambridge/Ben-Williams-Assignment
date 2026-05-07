let viewing = false;
document.querySelectorAll('#MenuBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        viewing = !viewing;
        document.querySelector('.NavMenu').classList.toggle('viewing');
        document.querySelector('.NavBG').classList.toggle('viewing');
        document.querySelector('.NavBG_Gradient').classList.toggle('viewing');
        if (viewing == true) {
            document.querySelector('#MenuBtn img').src = "Images/ExitButton.png";
            document.querySelector('.exitBtn').classList.add('opening');
            document.querySelector('.exitBtn').classList.remove('closing');
        } else {
            document.querySelector('#MenuBtn img').src = "Images/MenuButton.png";
            document.querySelector('.exitBtn').classList.add('closing');
            document.querySelector('.exitBtn').classList.remove('opening');
        }
    });
});