// Örnek para birimleri/hisse verisi (saniyede güncellenecek simülasyon)
const items = [
  { name: "Bitcoin (BTC)", symbol: "BTC", price: 30000, lastPrices: [] },
  { name: "Ethereum (ETH)", symbol: "ETH", price: 1800, lastPrices: [] },
  { name: "ABD Doları (USD)", symbol: "USD", price: 1, lastPrices: [] },
  { name: "Euro (EUR)", symbol: "EUR", price: 1.1, lastPrices: [] },
  { name: "BIST 100", symbol: "BIST", price: 2000, lastPrices: [] },
  { name: "Tesla (TSLA)", symbol: "TSLA", price: 650, lastPrices: [] },
];

// Anlık fiyat güncellemesi simülasyonu
function updatePrices() {
  items.forEach(item => {
    // Fiyat değişimini -2% ile +2% arası random yapıyoruz
    const changePercent = (Math.random() * 4) - 2;
    const changeAmount = item.price * (changePercent / 100);
    const newPrice = +(item.price + changeAmount).toFixed(2);

    // Değişim miktarı ve yüzdeyi kaydet
    item.change = newPrice - item.price;
    item.changePercent = ((item.change / item.price) * 100).toFixed(2);
    item.price = newPrice;

    // Son fiyatlar dizisini 20 elemanla sınırlayalım grafik için
    item.lastPrices.push(item.price);
    if(item.lastPrices.length > 20) item.lastPrices.shift();
  });
}

// HTML’ye fiyatları yazdır
function renderPrices() {
  const container = document.getElementById("currency-list");
  container.innerHTML = "";

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "currency-item";

    const nameDiv = document.createElement("div");
    nameDiv.className = "currency-name";
    nameDiv.textContent = item.name;

    const priceDiv = document.createElement("div");
    priceDiv.className = "currency-price";
    priceDiv.textContent = item.price.toFixed(2);

    const changeDiv = document.createElement("div");
    changeDiv.className = "currency-change";
    changeDiv.textContent = `${item.change >= 0 ? "+" : ""}${item.changePercent}%`;
    changeDiv.classList.add(item.change >= 0 ? "change-up" : "change-down");

    div.appendChild(nameDiv);
    div.appendChild(priceDiv);
    div.appendChild(changeDiv);

    // Tıklanınca grafik güncellensin
    div.addEventListener("click", () => {
      updateChart(item);
      updateSummary(item);
    });

    container.appendChild(div);
  });
}

// Grafik için Chart.js ayarları ve güncelleme
const ctx = document.getElementById("priceChart").getContext("2d");
let priceChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: Array(20).fill(""),
    datasets: [{
      label: "",
      data: [],
      borderColor: "green",
      backgroundColor: "rgba(0,255,0,0.1)",
      fill: true,
      tension: 0.25,
      pointRadius: 0,
    }]
  },
  options: {
    animation: false,
    responsive: true,
    scales: {
      y: { beginAtZero: false },
      x: { display: false }
    },
    plugins: {
      legend: { display: false }
    }
  }
});

// Grafik verisini güncelle
function updateChart(item) {
  priceChart.data.datasets[0].label = item.name;
  priceChart.data.datasets[0].data = item.lastPrices;
  // Renk değişimi (pozitifse yeşil, negatifse kırmızı)
  const lastChange = item.change;
  priceChart.data.datasets[0].borderColor = lastChange >= 0 ? "green" : "red";
  priceChart.data.datasets[0].backgroundColor = lastChange >= 0 ? "rgba(0,255,0,0.15)" : "rgba(255,0,0,0.15)";
  priceChart.update();
}

// Yazılı özet güncelle
function updateSummary(item) {
  const summary = document.getElementById("summary-text");
  summary.innerHTML = `
    <strong>${item.name} (${item.symbol})</strong><br/>
    Şu anki fiyat: <strong>${item.price.toFixed(2)}</strong><br/>
    Değişim: <span class="${item.change >= 0 ? 'change-up' : 'change-down'}">
    ${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)} (${item.changePercent}%)</span><br/>
    Son 20 saniyede fiyat hareketleri görsel grafik olarak sağda gösterilmektedir.
  `;
}

// Başlangıç: Fiyatları güncelle, yazdır ve ilk grafiği göster
function init() {
  updatePrices();
  renderPrices();
  updateChart(items[0]);
  updateSummary(items[0]);
}

// Her saniye fiyatları güncelle ve ekranda göster
setInterval(() => {
  updatePrices();
  renderPrices();
  // Eğer grafik için seçilen ürün varsa onu güncelle
  if(priceChart.data.datasets[0].label) {
    const selected = items.find(i => i.name === priceChart.data.datasets[0].label);
    if(selected) updateChart(selected);
    updateSummary(selected);
  }
}, 1000);

// Başlat
init();
