let api = "https://api.data.gov/ed/collegescorecard/v1/schools?api_key=dIOGNb9wESP1bQUrVla5Zn5jNvjfrXt0qtcudXcq&school.state=NJ&sort=latest.student.size:desc&per_page=6"

async function fetchData(url, cacheKey = 'apiCache', cacheDuration = 300000) { // 5 min cache
    const cached = localStorage.getItem(cacheKey);
    const now = Date.now();

    if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (now - timestamp < cacheDuration) {
            console.log('Loading from cache');
            return data; // Return cached data if it's still valid
        }
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5-sec timeout

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Connection': 'keep-alive', // Persistent connection for speed
                'Accept-Encoding': 'gzip, deflate' // Compression support
            },
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data })); // Save to cache
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return cached ? JSON.parse(cached).data : null; // Fallback to cached data
    }
}

async function displayChart() {
    const universitites = await fetchData(api);

    const rutgers = universitites.results[0];
    const msu = universitites.results[1];
    const rowan = universitites.results[2];
    const kean = universitites.results[3];
    const njit = universitites.results[5];

    const ctx = document.getElementById('in-state-tuition-chart');

    new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: [rutgers.school.name,
                njit.school.name,
                msu.school.name,
                kean.school.name,
                rowan.school.name
            ],
            datasets: [{
                label: 'In State Tuition ($)',
                data: [rutgers.latest.cost.tuition.in_state,
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