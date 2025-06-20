// UTC+3 saat diliminde anlık İstanbul saati gösterimi
function updateTime() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istanbulTime = new Date(utc + 3 * 3600000);

  const timeString = istanbulTime.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  document.getElementById("current-time").textContent = `İstanbul Saati: ${timeString}`;
}
setInterval(updateTime, 1000);
updateTime();


// Başlangıç verileri (simülasyon)
const assets = [
  { name: "Bitcoin", symbol: "BTC", price: 30000, lastPrices: [] },
  { name: "Ethereum", symbol: "ETH", price: 1800, lastPrices: [] },
  { name: "ABD Doları", symbol: "USD", price: 1, lastPrices: [] },
  { name: "Euro", symbol: "EUR", price: 1.1, lastPrices: [] },
  { name: "BIST 100 Endeksi", symbol: "BIST", price: 2000, lastPrices: [] },
  { name: "Tesla", symbol: "TSLA", price: 650, lastPrices: [] },
];

// Son fiyatlar uzunluğunu sabit tutmak için limit
const MAX_HISTORY = 20;

// Anlık fiyat güncelleme simülasyonu (rastgele değişim)
function updatePrices() {
  assets.forEach(asset => {
    const changePercent = (Math.random() * 4) - 2; // -2% ile +2%
    const changeAmount = asset.price * (changePercent / 100);
    const newPrice = +(asset.price + changeAmount).toFixed(2);

    asset.change = newPrice - asset.price;
    asset.changePercent = ((asset.change / asset.price) * 100).toFixed(2);
    asset.price = newPrice;

    asset.lastPrices.push(asset.price);
    if (asset.lastPrices.length > MAX_HISTORY) asset.lastPrices.shift();
  });
}

// DOM’a anlık listeyi yazdır
const listContainer = document.getElementById("currency-list");

function renderList(selectedSymbol = null) {
  listContainer.innerHTML = "";

  assets.forEach(asset => {
    const div = document.createElement("div");
    div.className = "currency-item";
    if (selectedSymbol === asset.symbol) div.classList.add("selected");
    div.setAttribute("role", "listitem");
    div.setAttribute("tabindex", "0");

    // İçerik
    div.innerHTML = `
      <div class="currency-name">${asset.name}</div>
      <div class="currency-symbol">${asset.symbol}</div>
      <div class="currency-price">${asset.price.toFixed(2)}</div>
      <div class="currency-change ${asset.change >= 0 ? 'change-up' : 'change-down'}">
        ${asset.change >= 0 ? '+' : ''}${asset.changePercent}%
      </div>
    `;

    // Tıklama ve klavye erişimi ile seçme
    div.onclick = () => selectAsset(asset.symbol);
    div.onkeydown = e => {
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectAsset(asset.symbol);
      }
    };

    listContainer.appendChild(div);
  });
}

// Chart.js grafik setup
const ctx = document.getElementById("priceChart").getContext("2d");
const priceChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: Array(MAX_HISTORY).fill(''),
    datasets: [{
      label: '',
      data: [],
      borderColor: '#4caf50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      fill: true,
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 6,
    }]
  },
  options: {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: '#444',
        },
        ticks: {
          color: '#a0a0c8',
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#a0a0c8',
          font: { weight: 'bold' },
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  }
});

// Seçilen varlığı güncelle
let selectedAssetSymbol = assets[0].symbol;
function selectAsset(symbol) {
  selectedAssetSymbol = symbol;
  renderList(symbol);
  updateChartAndInfo(symbol);
}

// Grafik ve detay panelini güncelle
function updateChartAndInfo(symbol) {
  const asset = assets.find(a => a.symbol === symbol);
  if (!asset) return;

  // Grafik verilerini güncelle
  priceChart.data.labels = asset.lastPrices.map((_, i) => `T-${asset.lastPrices.length - i}`);
  priceChart.data.datasets[0].label = `${asset.name} (${asset.symbol})`;
  priceChart.data.datasets[0].data = asset.lastPrices;
  priceChart.update();

  // Detaylı bilgi
  const changeSign = asset.change >= 0 ? '+' : '';
  const infoText = `
    <strong>${asset.name} (${asset.symbol})</strong><br />
    Güncel Fiyat: <strong>${asset.price.toFixed(2)}</strong><br />
    Değişim: <strong>${changeSign}${asset.changePercent}%</strong><br />
    Son 20 fiyat güncellemesi grafik üzerinde gösterilmektedir.<br />
    <br />
    Burada daha detaylı bilgiler ve analizler gösterilebilir.
  `;

  document.getElementById("info-text").innerHTML = infoText;
}

// Döngü: her 2 saniyede veriyi güncelle ve render et
function mainLoop() {
  updatePrices();
  renderList(selectedAssetSymbol);
  updateChartAndInfo(selectedAssetSymbol);
}

selectAsset(selectedAssetSymbol);
setInterval(mainLoop, 2000);
