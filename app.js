const state = {
  config: {
    lat: -23.5505,
    lon: -46.6333,
    city: 'São Paulo, SP',
    inmetKey: ''
  },
  data: null,
  demoMode: false,
  currentTab: 'radar',
  updateInterval: null,
  windDirection: 0,
  hourlyForecast: [],
  chartData: {
    precip: Array(24).fill(0),
    wind: Array(24).fill(0),
    temp: Array(24).fill(0),
    labels: Array(24).fill('--')
  }
};

// ========================
// CLOCK
// ========================
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('pt-BR', { hour12: false });
}

setInterval(updateClock, 1000);
updateClock();

// ========================
// MODAL
// ========================
function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('latInput').value = state.config.lat;
  document.getElementById('lonInput').value = state.config.lon;
  document.getElementById('cityInput').value = state.config.city;
  document.getElementById('inmetKey').value = state.config.inmetKey;
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// ========================
// GEOCODING
// ========================
async function geocodeCity() {
  const q = document.getElementById('citySearch').value.trim();
  if (!q) return;

  showNotif('Buscando cidade...', 'info');

  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=pt&format=json`
    );

    const data = await res.json();

    if (data.results && data.results.length > 0) {
      const r = data.results[0];

      document.getElementById('latInput').value = r.latitude.toFixed(4);
      document.getElementById('lonInput').value = r.longitude.toFixed(4);

      const label = [r.name, r.admin1, r.country_code]
        .filter(Boolean)
        .join(', ');

      document.getElementById('cityInput').value = label;

      showNotif(`Encontrado: ${label}`, 'info');
    } else {
      showNotif('Cidade não encontrada', 'warn');
    }

  } catch (e) {
    showNotif('Erro na geocodificação', 'danger');
  }
}

// ENTER pra buscar cidade
document.getElementById('citySearch').addEventListener('keydown', e => {
  if (e.key === 'Enter') geocodeCity();
});

// ========================
// SAVE CONFIG
// ========================
function saveConfig() {
  state.config.lat =
    parseFloat(document.getElementById('latInput').value) || -23.5505;

  state.config.lon =
    parseFloat(document.getElementById('lonInput').value) || -46.6333;

  state.config.city =
    document.getElementById('cityInput').value.trim() || 'São Paulo, SP';

  state.config.inmetKey =
    document.getElementById('inmetKey').value.trim();

  state.demoMode = false;

  closeModal();
  fetchOpenMeteo();

  if (state.updateInterval) clearInterval(state.updateInterval);

  state.updateInterval = setInterval(fetchOpenMeteo, 600000);
}

// ========================
// NOTIFICATION
// ========================
function showNotif(msg, type = 'info') {
  const stack = document.getElementById('notifStack');
  const notif = document.createElement('div');

  notif.className = `notif ${type}`;
  notif.textContent = msg;

  stack.appendChild(notif);

  setTimeout(() => {
    notif.style.opacity = '0';
    setTimeout(() => notif.remove(), 300);
  }, 4000);
}

// ========================
// LOADING
// ========================
function showLoading(show) {
  const el = document.getElementById('statusLoading');

  if (el) {
    show
      ? el.classList.remove('hidden')
      : el.classList.add('hidden');
  }
function geocodeCity() {
  const city = document.getElementById("citySearch").value;

  if (!city) {
    alert("Digite uma cidade");
    return;
  }

  // simulando retorno
  const lat = "-23.5505";
  const lon = "-46.6333";

  document.getElementById("latInput").value = lat;
  document.getElementById("lonInput").value = lon;
  document.getElementById("cityInput").value = city;

  // 👉 AQUI É O SEGREDO
  updateWeather(lat, lon, city);
}

function updateWeather(lat, lon, city) {
  // por enquanto fake (depois a gente põe API real)

  document.getElementById("tempVal").innerText = "26°C";
  document.getElementById("humVal").innerText = "70%";
  document.getElementById("windVal").innerText = "12 km/h";
  document.getElementById("gustVal").innerText = "20 km/h";
  document.getElementById("rainVal").innerText = "1.5 mm";
  document.getElementById("pressVal").innerText = "1012 hPa";
  document.getElementById("visVal").innerText = "9 km";
  document.getElementById("regionVal").innerText = city;

  document.getElementById("condName").innerText = "NUBLADO";
  document.getElementById("condDesc").innerText = `Lat: ${lat} | Lon: ${lon}`;
}
}


