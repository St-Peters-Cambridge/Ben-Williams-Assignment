try{
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
} catch (error) {}

try {
    GPS_Status = document.getElementById('GPS_Status');
    if (GPS_Status.innerHTML == "HOLD") {
        GPS_Status.style.color = "red";
    } else if (GPS_Status.innerHTML == "GO") {
        GPS_Status.style.color = "#00FF00";
    }
} catch (error) {}

try {
    Flight_State = document.getElementById('Flight_State');
    if (Flight_State.innerHTML == "STARTUP") {
        Flight_State.style.color = "red";
    } else if (Flight_State.innerHTML == "PAD_IDLE") {
        Flight_State.style.color = "orange";
    } else if (Flight_State.innerHTML == "PAD_ARMED") {
        Flight_State.style.color = "#00FF00";
    } else if (Flight_State.innerHTML == "ASCENT") {
        Flight_State.style.color = "#ffee00";
    } else if (Flight_State.innerHTML == "BURNOUT") {
        Flight_State.style.color = "#ff9900";
    } else if (Flight_State.innerHTML == "DESCENT") {
        Flight_State.style.color = "#00ffff";
    } else if (Flight_State.innerHTML == "DROUGE_DEPLOY") {
        Flight_State.style.color = "#0000ff";
    } else if (Flight_State.innerHTML == "DROUGE") {
        Flight_State.style.color = "#ff00ff";
    } else if (Flight_State.innerHTML == "MAIN_DEPLOY") {
        Flight_State.style.color = "#b300ff";
    } else if (Flight_State.innerHTML == "MAIN") {
        Flight_State.style.color = "#6600ff";
    } else if (Flight_State.innerHTML == "BALLISTIC") {
        Flight_State.style.color = "#ff0000";
    } else if (Flight_State.innerHTML == "LANDED") {
        Flight_State.style.color = "#00ff00";
    }
} catch (error) {}

try {
    SD_State = document.getElementById('SD_State');
    if (SD_State.innerHTML == "DISABLED") {
        SD_State.style.color = "orange";
    } else if (SD_State.innerHTML == "ERROR_RW") {
        SD_State.style.color = "red";
    } else if (SD_State.innerHTML == "GO") {
        SD_State.style.color = "#00FF00";
    }
} catch (error) {}

try {
    Flash_State = document.getElementById('Flash_State');
    if (Flash_State.innerHTML == "DISABLED") {
        Flash_State.style.color = "orange";
    } else if (Flash_State.innerHTML == "ERROR_RW") {
        Flash_State.style.color = "red";
    } else if (Flash_State.innerHTML == "GO") {
        Flash_State.style.color = "#00FF00";
    }
} catch (error) {}

try {
    Data_Status = document.getElementById('Data_Status');
    if (Data_Status.innerHTML == "HOLD") {
        Data_Status.style.color = "red";
    } else if (Data_Status.innerHTML == "GO") {
        Data_Status.style.color = "#00FF00";
    }
} catch (error) {}

try {
    GyroActive = document.getElementById('GYRO');
    if (GyroActive.innerHTML == "GO") {
        GyroActive.style.color = "#00FF00";
    } else if (GyroActive.innerHTML == "HOLD") {
        GyroActive.style.color = "red";
    }
} catch (error) {}

try {
    AccelActive = document.getElementById('ACCEL');
    if (AccelActive.innerHTML == "GO") {
        AccelActive.style.color = "#00FF00";
    } else if (AccelActive.innerHTML == "HOLD") {
        AccelActive.style.color = "red";
    }
} catch (error) {}

try {
    HighRangeAccelActive = document.getElementById('HIGH_RANGE_ACCEL');
    if (HighRangeAccelActive.innerHTML == "GO") {
        HighRangeAccelActive.style.color = "#00FF00";
    } else if (HighRangeAccelActive.innerHTML == "HOLD") {
        HighRangeAccelActive.style.color = "red";
    }
} catch (error) {}

try {
    BAROActive = document.getElementById('BARO');
    if (BAROActive.innerHTML == "GO") {
        BAROActive.style.color = "#00FF00";
    } else if (BAROActive.innerHTML == "HOLD") {
        BAROActive.style.color = "red";
    }
} catch (error) {}

try {
    Flags_State = document.getElementById('Flags_Status');
    if (Flags_State.innerHTML == "GO") {
        Flags_State.style.color = "#00FF00";
    } else if (Flags_State.innerHTML == "HOLD") {
        Flags_State.style.color = "red";
    }
} catch (error) {}