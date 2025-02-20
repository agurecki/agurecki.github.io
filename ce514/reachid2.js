async function getForecast(reachId, riverName) {
    if (!reachId) {
        alert("Invalid Reach ID.");
        return;
    }

    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.style.display = 'block';

    try {
        // Fetch data for short, medium, and long-range forecasts
        const seriesTypes = ["short_range", "medium_range", "long_range"];
        const colors = {
            short_range: "#0077b6", // Deep blue
            medium_range: "#28a745", // Green
            long_range: "#ff5733" // Orange-Red
        };

        let allData = {};

        for (const type of seriesTypes) {
            const apiUrl = `https://api.water.noaa.gov/nwps/v1/reaches/${reachId}/streamflow?series=${type}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                console.warn(`No data for ${type} forecast (HTTP ${response.status})`);
                continue;
            }

            const json_data = await response.json();

            if (!json_data[type] || !json_data[type].series || !json_data[type].series.data || json_data[type].series.data.length === 0) {
                console.warn(`No valid forecast data available for ${type}`);
                continue;
            }

            allData[type] = {
                timestamps: json_data[type].series.data.map(item => item.validTime),
                flowValues: json_data[type].series.data.map(item => item.flow),
                color: colors[type]
            };
        }

        // Ensure there is at least one valid dataset
        if (Object.keys(allData).length === 0) {
            throw new Error("No forecast data available for this Reach ID.");
        }

        // Update or create the chart
        const ctx = document.getElementById('streamflowChart').getContext('2d');
        let chart = Chart.getChart('streamflowChart');

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: allData.short_range ? allData.short_range.timestamps : [],
                datasets: Object.keys(allData).map(key => ({
                    label: `Streamflow Forecast (${key.replace("_", " ")})`,
                    data: allData[key].flowValues,
                    borderColor: allData[key].color,
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 3
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: "#333",
                            font: { size: 14, weight: "bold" }
                        }
                    },
                    tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        titleFont: { size: 14, weight: "bold" },
                        bodyFont: { size: 12 },
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        ticks: { color: "#005f99", font: { size: 14 } },
                        grid: { color: "rgba(0, 0, 0, 0.1)" },
                        title: {
                            display: true,
                            text: "Time",
                            color: "#222",
                            font: { size: 16, weight: "bold" }
                        }
                    },
                    y: {
                        ticks: { color: "#005f99", font: { size: 14 } },
                        grid: { color: "rgba(0, 0, 0, 0.1)" },
                        title: {
                            display: true,
                            text: "Streamflow (cfs)",
                            color: "#222",
                            font: { size: 16, weight: "bold" }
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error('Error fetching or processing data:', error);
        alert("Error fetching forecast: " + error.message);
    }
}
