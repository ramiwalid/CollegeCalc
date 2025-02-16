let api = "https://api.data.gov/ed/collegescorecard/v1/schools?api_key=dIOGNb9wESP1bQUrVla5Zn5jNvjfrXt0qtcudXcq&"
let myChart;

async function fetchCollegeData(user_api) {
    const response = await fetch(user_api);
    if (!response.ok) {
        throw new Error('Could not find source')
    }
    const data = await response.json();
    return data;
}

async function displayChart() {
    console.time("API Fetch Time")
    const universities = await fetchCollegeData(api + "school.state=NJ&sort=latest.student.size:desc&per_page=20");
    console.time("API fetch time")

    const rutgersNB = universities.results[0];
    const msu = universities.results[1];
    const kean = universities.results[2];
    const rowan = universities.results[3];
    const njit = universities.results[5];

    const ctx = document.getElementById('in-state-tuition-chart');

    if (myChart) {
        myChart.destroy();
    }

    new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: [rutgersNB.school.name, 
                njit.school.name, 
                msu.school.name, 
                kean.school.name,
                rowan.school.name
            ],
            datasets: [{
                label: 'In State Tuition ($)',
                data: [rutgersNB.latest.cost.tuition.in_state, 
                    njit.latest.cost.tuition.in_state, 
                    msu.latest.cost.tuition.in_state,
                    kean.latest.cost.tuition.in_state,
                    rowan.latest.cost.tuition.in_state
                ],
                backgroundColor: "#6C809A",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

displayChart();