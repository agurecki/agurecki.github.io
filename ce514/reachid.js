/ script.js
async function getForecast() {
  const reachId = document.getElementById('reachIdInput').value;
  if (!reachId) {
    alert("Please enter a Reach ID.");
    return;
  }

  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.style.display = 'block';

  try {
    const apiUrl = `https://api.water.noaa.gov/nwps/v1/reaches/${reachId}/streamflow?series=short_range`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status} - ${response.statusText}`);
    }

    const json_data = await response.json();

    if (!json_data.shortRange || !json_data.shortRange.series || !json_data.shortRange.series.data || json_data.shortRange.series.data.length === 0) {
        throw new Error("No forecast data available for this Reach ID.");
    }

    const streamflowData = json_data.shortRange.series.data;
    const timestamps = streamflowData.map(item => item.validTime);
    const flowValues = streamflowData.map(item => item.flow);

    // Update the table
    const table = document.getElementById('timeseries-datatable').getElementsByTagName('tbody')[0];
    table.innerHTML = "";

    for (let i = 0; i < streamflowData.length; i++) {
      const row = table.insertRow();
      const timestampCell = row.insertCell();
      const flowCell = row.insertCell();
      timestampCell.textContent = timestamps[i];
      flowCell.textContent = flowValues[i];
    }

   async function getForecast() {
    let reachId = document.getElementById("reachIdInput").value;
    
    if (!reachId) {
        alert("Please enter a Reach ID.");
        return;
    }

    try {
        let response = await fetch(`https://your-api-endpoint.com/data?reach_id=${reachId}`);
        let data = await response.json();
        
        let waterSystemName = data.waterSystemName || "Unknown Water System";
        document.getElementById("waterSystemName").innerText = waterSystemName;

        updateChart(data);
    } catch (error) {
        console.error("Error fetching forecast:", error);
        alert("Failed to retrieve data. Please check the Reach ID.");
    }
}

// Function to create a smooth water-like gradient effect
function createGradient(ctx) {
    let gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, "rgba(0, 119, 182, 0.7)");  // Deep Blue
    gradient.addColorStop(1, "rgba(173, 216, 230, 0.2)"); // Light Aqua
    return gradient;
}

// Function to update the chart with new data
function updateChart(data) {
    let ctx = document.getElementById("streamflowChart").getContext("2d");

    if (window.myChart) {
        window.myChart.destroy(); // Destroy the old chart before creating a new one
    }

    let gradientFill = createGradient(ctx);

    window.myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: data.timestamps, // X-axis values (time)
            datasets: [{
                label: "Streamflow (cfs)",
                data: data.flowValues,  // Y-axis values (flow rates)
                backgroundColor: gradientFill,  // Water gradient
                borderColor: "#0077b6",  // Deep blue line
                borderWidth: 4,
                pointBackgroundColor: "#ffcc00", // Yellow dots for points
                pointRadius: 6,
                pointHoverRadius: 8,
                tension: 0.4  // Smooth curve
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "#333",
                        font: {
                            size: 16
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: "#005f99", font: { size: 14 } },
                    grid: { color: "rgba(0, 0, 0, 0.1)" }
                },
                y: {
                    ticks: { color: "#005f99", font: { size: 14 } },
                    grid: { color: "rgba(0, 0, 0, 0.1)" }
                }
            },
            animations: {
                tension: {
                    duration: 2000,
                    easing: "easeInOutBounce",
                    from: 0.5,
                    to: 0,
                    loop: true
                }
            }
        }
    });
}
