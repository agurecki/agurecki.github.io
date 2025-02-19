async function getForecast(forecastType, reachID, riverName) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.style.display = 'block';

    const apiUrl = `https://api.water.noaa.gov/nwps/v1/reaches/${reachID}/streamflow?series=${forecastType}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status} - ${response.statusText}`);
        }

        const json_data = await response.json();

        // Log API response for debugging
        console.log("API Response:", json_data);

        // Check if the forecast data exists
        if (
            !json_data ||
            !json_data[forecastType] ||
            !json_data[forecastType].series ||
            !json_data[forecastType].series.data ||
            json_data[forecastType].series.data.length === 0
        ) {
            throw new Error(`No forecast data available for ${forecastType} on ${riverName}.`);
        }

        const streamflowData = json_data[forecastType].series.data;
        const timestamps = streamflowData.map(item => item.validTime);
        const flowValues = streamflowData.map(item => item.flow);

        // Create or update the chart
        const ctx = document.getElementById('streamflowChart').getContext('2d');
        let chart = Chart.getChart('streamflowChart'); // Check if chart exists

        if (chart) {
            chart.destroy(); // Destroy existing chart if present
        }

        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: timestamps,
                datasets: [{
                    label: `Streamflow Forecast (${forecastType.replace('_', ' ').toUpperCase()})`,
                    data: flowValues,
                    borderColor: "#0077b6",
                    borderWidth: 3,
                    fill: true,
                    backgroundColor: createGradient(ctx),
                    tension: 0.4,
                    pointBackgroundColor: "#ffcc00",
                    pointBorderColor: "#005f99",
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: "#ff5733",
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: "#333" } },
                    tooltip: { backgroundColor: "rgba(0, 0, 0, 0.8)" }
                },
                scales: {
                    x: {
                        ticks: { color: "#005f99", font: { size: 14 } },
                        grid: { color: "rgba(0, 0, 0, 0.1)" },
                        title: { display: true, text: "Time", color: "#222" }
                    },
                    y: {
                        ticks: { color: "#005f99", font: { size: 14 } },
                        grid: { color: "rgba(0, 0, 0, 0.1)" },
                        title: { display: true, text: "Streamflow (cfs)", color: "#222" }
                    }
                },
            }
        });
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}
