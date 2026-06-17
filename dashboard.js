// =====================================
// CHART
// =====================================

let tempChart;

function createChart()
{
    const ctx =
    document.getElementById("tempChart");

    tempChart = new Chart(ctx,
    {
        type: "line",

        data:
        {
            labels: [],

            datasets:
            [
                {
                    label:
                    "Cabin Temperature",

                    data: [],

                    borderColor:
                    "#38bdf8",

                    backgroundColor:
                    "rgba(56,189,248,0.15)",

                    tension: 0.4,

                    fill: true
                },

                {
                    label:
                    "Engine Temperature",

                    data: [],

                    borderColor:
                    "#ef4444",

                    backgroundColor:
                    "rgba(239,68,68,0.15)",

                    tension: 0.4,

                    fill: true
                }
            ]
        },

        options:
        {
            responsive: true,

            plugins:
            {
                legend:
                {
                    labels:
                    {
                        color:
                        "white"
                    }
                }
            },

            scales:
            {
                x:
                {
                    ticks:
                    {
                        color:
                        "white"
                    },

                    grid:
                    {
                        color:
                        "#334155"
                    }
                },

                y:
                {
                    ticks:
                    {
                        color:
                        "white"
                    },

                    grid:
                    {
                        color:
                        "#334155"
                    }
                }
            }
        }
    });
}

// =====================================
// CURRENT DATA
// =====================================

async function loadCurrentData()
{
    try
    {
        const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/temperature_data?select=*&order=id.desc&limit=1`,
            {
                headers:
                {
                    apikey: SUPABASE_KEY,

                    Authorization:
                    `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        const data =
        await response.json();

        if(data.length > 0)
        {
            const row = data[0];

            document.getElementById(
                "cabinTemp"
            ).innerHTML =
            row.cabin_temp + " °C";

            document.getElementById(
                "engineTemp"
            ).innerHTML =
            row.engine_temp + " °C";

            document.getElementById(
                "lastUpdate"
            ).innerHTML =
            new Date().toLocaleString(
                "en-MY",
                {
                    timeZone:
                    "Asia/Kuala_Lumpur"
                }
            );

            const statusElement =
            document.getElementById(
                "status"
            );

            const condition =
            document.getElementById(
                "conditionText"
            );

            const alertBanner =
            document.getElementById(
                "criticalAlert"
            );

            const statusPanel =
            document.querySelector(
                ".status-panel"
            );

            statusElement.innerHTML =
            row.status;

            statusElement.className =
            "";

            if(row.status === "SAFE")
            {
                statusElement.classList.add(
                    "safe"
                );

                condition.className =
                "safe";

                condition.innerHTML =
                "🟢 VEHICLE OPERATING NORMALLY";

                alertBanner.style.display =
                "none";

                statusPanel.style.background =
                "#1e293b";
            }

            else if(
                row.status ===
                "CAUTION"
            )
            {
                statusElement.classList.add(
                    "caution"
                );

                condition.className =
                "caution";

                condition.innerHTML =
                "🟠 TEMPERATURE APPROACHING LIMIT";

                alertBanner.style.display =
                "none";

                statusPanel.style.background =
                "#1e293b";
            }

            else
            {
                statusElement.classList.add(
                    "critical"
                );

                condition.className =
                "critical";

                condition.innerHTML =
                "🔴 OVERHEATING DETECTED";

                alertBanner.style.display =
                "block";

                statusPanel.style.background =
                "#450a0a";
            }
        }
    }

    catch(error)
    {
        console.error(error);
    }
}

// =====================================
// GRAPH
// =====================================

async function loadGraph()
{
    try
    {
        const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/temperature_data?select=*&order=id.desc&limit=20`,
            {
                headers:
                {
                    apikey: SUPABASE_KEY,

                    Authorization:
                    `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        const data =
        await response.json();

        data.reverse();

        tempChart.data.labels =
        data.map(row =>
            new Date(
                row.created_at
            ).toLocaleTimeString(
                "en-MY",
                {
                    timeZone:
                    "Asia/Kuala_Lumpur",

                    hour:
                    "2-digit",

                    minute:
                    "2-digit",

                    second:
                    "2-digit"
                }
            )
        );

        tempChart.data.datasets[0].data =
        data.map(row =>
            row.cabin_temp
        );

        tempChart.data.datasets[1].data =
        data.map(row =>
            row.engine_temp
        );

        tempChart.update();
    }

    catch(error)
    {
        console.error(error);
    }
}

// =====================================
// TABLE
// =====================================

async function loadTable()
{
    try
    {
        const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/temperature_data?select=*&order=id.desc&limit=20`,
            {
                headers:
                {
                    apikey: SUPABASE_KEY,

                    Authorization:
                    `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        const data =
        await response.json();

        const table =
        document.getElementById(
            "historyTable"
        );

        table.innerHTML = "";

        data.forEach(row =>
        {
            let statusClass =
            row.status.toLowerCase();

            table.innerHTML +=
            `
            <tr>

                <td>${row.id}</td>

                <td>${row.cabin_temp}</td>

                <td>${row.engine_temp}</td>

                <td class="${statusClass}">
                    ${row.status}
                </td>

                <td>
                ${new Date(
                    row.created_at
                ).toLocaleString(
                    "en-MY",
                    {
                        timeZone:
                        "Asia/Kuala_Lumpur"
                    }
                )}
                </td>

            </tr>
            `;
        });
    }

    catch(error)
    {
        console.error(error);
    }
}

// =====================================
// STATISTICS
// =====================================

async function loadStatistics()
{
    try
    {
        const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/temperature_data?select=status`,
            {
                headers:
                {
                    apikey: SUPABASE_KEY,

                    Authorization:
                    `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        const data =
        await response.json();

        let safe = 0;
        let caution = 0;
        let critical = 0;

        data.forEach(row =>
        {
            if(row.status === "SAFE")
            {
                safe++;
            }
            else if(row.status === "CAUTION")
            {
                caution++;
            }
            else if(row.status === "CRITICAL")
            {
                critical++;
            }
        });

        document.getElementById(
            "totalRecords"
        ).innerHTML =
        data.length;

        document.getElementById(
            "safeCount"
        ).innerHTML =
        safe;

        document.getElementById(
            "cautionCount"
        ).innerHTML =
        caution;

        document.getElementById(
            "criticalCount"
        ).innerHTML =
        critical;
    }

    catch(error)
    {
        console.error(error);
    }
}

// =====================================
// EXPORT CSV
// =====================================

async function downloadCSV()
{
    try
    {
        const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/temperature_data?select=*`,
            {
                headers:
                {
                    apikey: SUPABASE_KEY,

                    Authorization:
                    `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        const data =
        await response.json();

        let csv =
        "ID,Cabin Temperature,Engine Temperature,Status,Date Time\n";

        data.forEach(row =>
        {
            csv +=
            `${row.id},${row.cabin_temp},${row.engine_temp},${row.status},${row.created_at}\n`;
        });

        const blob =
        new Blob(
            [csv],
            {
                type: "text/csv"
            }
        );

        const url =
        window.URL.createObjectURL(blob);

        const a =
        document.createElement("a");

        a.href = url;

        a.download =
        "Temperature_Report.csv";

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
    }

    catch(error)
    {
        console.error(error);

        alert(
            "Failed to download report"
        );
    }
}

// =====================================
// START
// =====================================

createChart();

loadCurrentData();
loadGraph();
loadTable();
loadStatistics();

setInterval(() =>
{
    loadCurrentData();
    loadGraph();
    loadTable();
    loadStatistics();
},
5000);