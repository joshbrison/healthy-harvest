// Data Simulation Logic
export function simulateDiagnosis() {
    const diagnoseBtn = document.querySelector('#diagnoseBtn');
    const originalText = diagnoseBtn ? diagnoseBtn.innerHTML : '';
    if (diagnoseBtn) {
        diagnoseBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        diagnoseBtn.disabled = true;
    }
    setTimeout(() => {
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
        const diseases = [
            { name: 'Groundnut Rosette', confidence: 92, treatment: 'Remove infected plants immediately and use resistant varieties.' },
            { name: 'Early Leaf Spot', confidence: 78, treatment: 'Apply fungicide and practice crop rotation.' },
            { name: 'Rust', confidence: 65, treatment: 'Use fungicides containing chlorothalonil.' },
            { name: 'Healthy Plant', confidence: 95, treatment: 'Continue good farming practices.' }
        ];
        const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
        document.getElementById('diseaseName').textContent = randomDisease.name;
        document.getElementById('confidenceValue').textContent = randomDisease.confidence + '%';
        document.getElementById('confidenceFill').style.width = randomDisease.confidence + '%';
        document.getElementById('treatmentAdvice').textContent = randomDisease.treatment;
        const resultIcon = document.getElementById('resultIcon');
        if (resultIcon) {
            if (randomDisease.name === 'Healthy Plant') {
                resultIcon.className = 'result-icon success';
                resultIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
            } else {
                resultIcon.className = 'result-icon danger';
                resultIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            }
        }
        if (diagnoseBtn) {
            diagnoseBtn.innerHTML = originalText;
            diagnoseBtn.disabled = false;
        }
    }, 2000);
}

export function loadWeatherData() {
    const weatherData = {
        location: 'Nakasongola District',
        temperature: '28°C',
        rainfall: 'Medium',
        forecast: [
            { day: 'Today', rainfall: 'Low', temp: '28-32°C' },
            { day: 'Tomorrow', rainfall: 'Medium', temp: '26-30°C' },
            { day: 'Day 3', rainfall: 'High', temp: '25-29°C' },
            { day: 'Day 4', rainfall: 'Medium', temp: '26-31°C' },
            { day: 'Day 5', rainfall: 'Low', temp: '27-33°C' }
        ],
        advisory: 'Best planting window: March 10-15. Flood risk: Low.'
    };
    document.getElementById('weatherLocation').textContent = weatherData.location;
    document.getElementById('weatherTemp').textContent = weatherData.temperature;
    document.getElementById('weatherRainfall').textContent = weatherData.rainfall;
    document.getElementById('weatherAdvisory').textContent = weatherData.advisory;
    const forecastTable = document.getElementById('forecastTable');
    if (forecastTable) {
        forecastTable.innerHTML = weatherData.forecast.map(day => `
            <tr>
                <td>${day.day}</td>
                <td><span class="rainfall-badge ${day.rainfall.toLowerCase()}">${day.rainfall}</span></td>
                <td>${day.temp}</td>
            </tr>
        `).join('');
    }
}

export function loadMarketData() {
    const marketData = [
        { location: 'Nakasongola', price: '3,200', trend: 'up' },
        { location: 'Lira', price: '3,500', trend: 'stable' },
        { location: 'Gulu', price: '3,300', trend: 'down' },
        { location: 'Masindi', price: '3,400', trend: 'up' },
        { location: 'Kampala', price: '3,800', trend: 'stable' }
    ];
    const marketTable = document.getElementById('marketTable');
    if (marketTable) {
        marketTable.innerHTML = marketData.map(item => `
            <tr>
                <td>${item.location}</td>
                <td>UGX ${item.price}/kg</td>
                <td>
                    <span class="trend-${item.trend}">
                        <i class="fas fa-arrow-${item.trend === 'up' ? 'up' : item.trend === 'down' ? 'down' : 'right'}"></i>
                        ${item.trend}
                    </span>
                </td>
            </tr>
        `).join('');
    }
}