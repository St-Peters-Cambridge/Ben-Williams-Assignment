var GPS_LAT = -37.54914504265702;
var GPS_LON = 175.25749082838198;

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

try{
    EmbedMap = document.getElementById('Map');
    EmbedMap.src = "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1750!2d" + GPS_LON.toFixed(6) + "!3d" + GPS_LAT.toFixed(6) + "!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2z"+ encodeCoords(GPS_LAT.toFixed(6), GPS_LON.toFixed(6)) +"!5e1!3m2!1sen!2snz!4v1779743037952!5m2!1sen!2snz";
} catch (error) {}

function decimalToDMSString(lat, lng) {
  function toDMS(decimal, isLat) {
    const dir = isLat ? (decimal >= 0 ? "N" : "S") : (decimal >= 0 ? "E" : "W");
    const abs = Math.abs(decimal);
    const deg = Math.floor(abs);
    const minFull = (abs - deg) * 60;
    const min = Math.floor(minFull);
    const sec = ((minFull - min) * 60).toFixed(1);
    return `${deg}°${min}'${sec}"${dir}`;
  }

  return `${toDMS(lat, true)} ${toDMS(lng, false)}`;
}

function encodeCoords(lat, lng) {
  const dms = decimalToDMSString(lat, lng);
  // UTF-8 encode before Base64 (handles ° symbol etc.)
  const encoded = btoa(unescape(encodeURIComponent(dms)));
  return encoded;
}

let port;
async function connectSerial() {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    const info = port.getInfo();
    sessionStorage.setItem('portVendorId', info.usbVendorId);
    sessionStorage.setItem('portProductId', info.usbProductId);
}

async function autoConnect() {
    const ports = await navigator.serial.getPorts();
    const savedVendor = parseInt(sessionStorage.getItem('portVendorId'));
    const savedProduct = parseInt(sessionStorage.getItem('portProductId'));

    const rocketPort = ports.find(p => {
        const info = p.getInfo();
        return info.usbVendorId === savedVendor && info.usbProductId === savedProduct;
    });

    if (rocketPort) {
        port = rocketPort;
        if (port.readable === null) {
            await port.open({ baudRate: 115200 });
        }
        startReading();
    }
}
autoConnect();
async function startReading() {
    console.log("Serial port opened:", port);
    const reader = port.readable.getReader();
    let buffer = '';

    while (port != null) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += new TextDecoder().decode(value);
        const lines = buffer.split('\n');
        buffer = lines.pop();
        
        lines.forEach(line => {
            console.log(line);
        });
    }
}

async function connectBLE(){
  const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'; // your UUID
  const CHAR_UUID    = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'; // your UUID

  try {
    // 1. Opens the browser's BLE device picker
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [SERVICE_UUID] }]
    });

    // 2. Connect to the ESP32's GATT server
    const server = await device.gatt.connect();

    // 3. Get your service and characteristic
    const service        = await server.getPrimaryService(SERVICE_UUID);
    const characteristic = await service.getCharacteristic(CHAR_UUID);

    // 4. Listen for incoming data (if your char has notify)
    await characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', (e) => {
      const msg = new TextDecoder().decode(e.target.value);
      console.log('ESP32 says:', msg);
    });

    // 5. Send a message to the ESP32
    await characteristic.writeValue(new TextEncoder().encode('hello'));

    console.log('Connected to', device.name);

  } catch (err) {
    console.error('BLE failed:', err);
  }
}