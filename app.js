const apiBaseURL = "https://mindicador.cl/api/";
const amountInput = document.getElementById("amount");
const currencySelect = document.getElementById("currency");
const resultText = document.getElementById("result");
const convertButton = document.getElementById("convert");
const chartCanvas = document.getElementById("chart");

let chartInstance;


convertButton.addEventListener("click", async () => {
  const amount = parseFloat(amountInput.value);
  const currency = currencySelect.value;

  if (isNaN(amount) || amount <= 0) {
    resultText.textContent = "Por favor, ingresa un monto válido en CLP.";
    return;
  }

  if (currency === "clp") {
    resultText.textContent = `Resultado: ${amount.toFixed(2)} CLP (sin conversión)`;
    if (chartInstance) chartInstance.destroy();
    return;
  }

  try {
    const res = await fetch(`${apiBaseURL}${currency}`);
    if (!res.ok) throw new Error("Error al obtener datos de la API");
    const data = await res.json();

    const valorMoneda = data.serie[0].valor;
    const conversion = (amount / valorMoneda).toFixed(2);

    resultText.textContent = `Resultado: $${conversion} ${data.nombre}`;

    
    const ultimos10 = data.serie.slice(0, 10).reverse();
    const labels = ultimos10.map(d => new Date(d.fecha).toLocaleDateString("es-CL"));
    const values = ultimos10.map(d => d.valor);

  
    if (chartInstance) chartInstance.destroy();


    chartInstance = new Chart(chartCanvas, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Historial últimos 10 días",
          data: values,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
          tension: 0.2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: "#000" } }
        },
        scales: {
          x: { ticks: { color: "#000" } },
          y: { ticks: { color: "#000" } }
        }
      }
    });

  } catch (error) {
    resultText.textContent = `Error: ${error.message}`;
  }
});
