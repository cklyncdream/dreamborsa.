// Veri kümesi - Para birimleri, Bitcoin, hisse senetleri
const data = [
  { symbol: "BTC", name: "Bitcoin", price: 410000, change: 0 },
  { symbol: "ETH", name: "Ethereum", price: 28000, change: 0 },
  { symbol: "USD", name: "ABD Doları", price: 27.50, change: 0 },
  { symbol: "EUR", name: "Euro", price: 29.20, change: 0 },
  { symbol: "TRY", name: "Türk Lirası", price: 1, change: 0 },
  { symbol: "GBP", name: "İngiliz Sterlini", price: 33.40, change: 0 },
  { symbol: "XAU", name: "Altın (gram)", price: 1900, change: 0 },
  { symbol: "AAPL", name: "Apple Inc.", price: 168, change: 0 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 720, change: 0 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 330, change: 0 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 2800, change: 0 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 3500, change: 0 },
  { symbol: "DOGE", name: "Dogecoin", price: 1.15, change: 0 },
  { symbol: "XRP", name: "Ripple", price: 5.25, change: 0 },
  { symbol: "USDTRY", name: "Dolar / Türk Lirası", price: 27.50, change: 0 },
  { symbol: "EURUSD", name: "Euro / ABD Doları", price: 1.06, change: 0 },
];

// İstanbul saatine göre güncel saat göstergesi
function updateTime() {
  const options = {
    timeZone: "Europe/Istanbul",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const now = new Date().toLocaleString("tr-TR", options);
  document.getElementById("time").innerText = "Güncel Saat (İstanbul): " + now;
}

// Rastgele fiyat değişimi simülasyonu
function simulatePriceChange() {
  data.forEach((item) => {
    // Fiyatı değiştir, -%0.5 ile +%0.5 arasında rastgele
    const maxChangePercent = 0.005;
    const randomFactor = (Math.random() * 2 - 1) * maxChangePercent;
    const oldPrice = item.price;
    const newPrice = oldPrice * (1 + randomFactor);

    item.change = newPrice - oldPrice;
    item.price = parseFloat(newPrice.toFixed(4));
  });
}

// Tabloyu güncelle
function updateTable(filter = "") {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  // Arama metnini küçült
  filter = filter.toLowerCase();

  data.forEach((item) => {
    if (
      item.symbol.toLowerCase().includes(filter) ||
      item.name.toLowerCase().includes(filter)
    ) {
      const tr = document.createElement("tr");

      const priceCell = document.createElement("td");
      priceCell.textContent =
        item.symbol === "XAU" ? item.price.toFixed(2) + " ₺" : item.price;

      const changeCell = document.createElement("td");
      changeCell.textContent =
        (item.change >= 0 ? "+" : "") + item.change.toFixed(4);

      if (item.change > 0) changeCell.classList.add("green");
      else if (item.change < 0) changeCell.classList.add("red");

      tr.innerHTML = `<td>${item.symbol}</td><td>${item.name}</td>`;
      tr.appendChild(priceCell);
      tr.appendChild(changeCell);

      tbody.appendChild(tr);
    }
  });
}

// Arama kutusu dinleme
const searchBox = document.getElementById("searchBox");
searchBox.addEventListener("input", () => {
  updateTable(searchBox.value);
});

// Her saniye fiyatları simüle et ve tabloyu güncelle
setInterval(() => {
  simulatePriceChange();
  updateTable(searchBox.value);
  updateTime();
}, 1000);

// İlk yükleme
simulatePriceChange();
updateTable();
updateTime();
