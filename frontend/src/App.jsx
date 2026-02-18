import { useState, useEffect } from 'react'
import DistrictChart from './components/DistrictChart'
import CityMap from './components/CityMap'
import NewsTicker from './components/NewsTicker'
import Rain from './components/Rain'
import './App.css'

function App() {
  const [cityData, setCityData] = useState(null)
  const [districtHistory, setDistrictHistory] = useState({})
  const [status, setStatus] = useState('Disconnected')
  const [alerts, setAlerts] = useState([])
  const [selectedDistrict, setSelectedDistrict] = useState("Downtown")
  const [actionMessage, setActionMessage] = useState("")
  const [weather, setWeather] = useState("Clear")

  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8001/ws')

    ws.onopen = () => {
      setStatus('Connected')
      console.log('Connected to WebSocket')
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setCityData(data)
        if (data.weather) setWeather(data.weather)

        // Generate Alerts
        const newAlerts = []
        data.districts.forEach(d => {
          if (d.air_quality_index > 150) newAlerts.push({ type: 'critical', msg: `Severe AQI in ${d.name} (${d.air_quality_index.toFixed(0)})` })
          if (d.emergency_response_time > 15) newAlerts.push({ type: 'warning', msg: `Slow Response in ${d.name} (${d.emergency_response_time.toFixed(1)} min)` })
          if (d.active_incidents > 2) newAlerts.push({ type: 'critical', msg: `Multiple Incidents in ${d.name}` })
        })
        setAlerts(newAlerts)

        setDistrictHistory(prevHistory => {
          const newHistory = { ...prevHistory }

          data.districts.forEach(district => {
            if (!newHistory[district.name]) {
              newHistory[district.name] = []
            }
            const dataPoint = { ...district, time: data.timestamp }

            const currentList = [...newHistory[district.name], dataPoint]
            if (currentList.length > 20) {
              currentList.shift()
            }
            newHistory[district.name] = currentList
          })

          return newHistory
        })

      } catch (error) {
        console.error('Error parsing data:', error)
      }
    }

    ws.onclose = () => {
      setStatus('Disconnected')
      console.log('Disconnected from WebSocket')
    }

    return () => {
      ws.close()
    }
  }, [])

  const handleControl = async (action) => {
    if (!selectedDistrict) return;

    try {
      const response = await fetch('http://127.0.0.1:8001/api/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district: selectedDistrict, action })
      });
      const result = await response.json();
      setActionMessage(result.message);
      setTimeout(() => setActionMessage(""), 3000);
    } catch (err) {
      console.error("Control failed", err);
    }
  };

  const getHealthColor = (score) => {
    if (score > 80) return '#4caf50'
    if (score > 50) return '#ff9800'
    return '#f44336'
  }

  const isNight = cityData ? (cityData.simulated_hour < 6 || cityData.simulated_hour > 18) : false;

  return (
    <div className={`app-container ${weather.toLowerCase()} ${isNight ? 'night-mode' : 'day-mode'}`}>
      {/* Weather Effects Overlay */}
      <div className="weather-overlay">
        {weather === 'Rain' && <Rain count={80} />}
        {weather === 'Cloudy' && <div className="cloud-layer"></div>}
        {weather === 'Storm' && (
          <>
            <Rain count={120} />
            <div className="cloud-layer"></div>
            <div className="storm-layer"></div>
          </>
        )}
      </div>

      <header>
        <div className="header-content">
          <h1>UrbanPulse Dashboard</h1>
          <div className="simulation-time">
            {cityData ? (
              <>
                <span>{Math.floor(cityData.simulated_hour)}:{Math.floor((cityData.simulated_hour % 1) * 60).toString().padStart(2, '0')}</span>
                <span className="weather-badge"> | {weather}</span>
              </>
            ) : 'Loading...'}
          </div>
        </div>
        <div className={`status-indicator ${status.toLowerCase()}`}>
          {status}
        </div>
      </header>

      <main>
        {cityData ? (
          <>
            <div className="overview-panel">
              <div className="health-score-card" style={{ borderColor: getHealthColor(cityData.city_health_score) }}>
                <h3>City Health Score</h3>
                <div className="score-value" style={{ color: getHealthColor(cityData.city_health_score) }}>
                  {cityData.city_health_score}
                </div>
              </div>

              <div className="map-panel">
                <h3>Live City Map</h3>
                <CityMap districts={cityData.districts} onSelectDistrict={setSelectedDistrict} />
                <div className="map-legend">Click a district to control</div>
              </div>

              <div className="alerts-panel">
                <h3>Active Alerts</h3>
                {alerts.length === 0 ? (
                  <div className="no-alerts">All Systems Normal</div>
                ) : (
                  <ul className="alert-list">
                    {alerts.map((alert, idx) => (
                      <li key={idx} className={`alert-item ${alert.type}`}>
                        {alert.msg}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {selectedDistrict && (
              <div className="control-panel">
                <h3>Command Center: {selectedDistrict}</h3>
                <div className="control-buttons">
                  <button className="btn-control primary" onClick={() => handleControl('OPTIMIZE_TRAFFIC')}>
                    🚦 Optimize Traffic Signals
                  </button>
                  <button className="btn-control danger" onClick={() => handleControl('RESOLVE_INCIDENT')}>
                    🚓 Dispatch Emergency Units
                  </button>
                  <button className="btn-control warning" onClick={() => handleControl('EMERGENCY_ROUTE')} style={{ backgroundColor: '#ff9800', color: '#000' }}>
                    🚑 Clear Emergency Route
                  </button>
                </div>
                {actionMessage && <div className="action-feedback">{actionMessage}</div>}
              </div>
            )}

            <div className="dashboard-grid">
              {cityData.districts.map((district) => (
                <div key={district.name} className="district-card">
                  <h2>{district.name}</h2>
                  <div className="metric">
                    <span className="label">Traffic Density</span>
                    <div className="progress-bar">
                      <div
                        className="fill"
                        style={{ width: `${district.traffic_density}%`, backgroundColor: getTrafficColor(district.traffic_density) }}
                      ></div>
                    </div>
                    <span className="value">{district.traffic_density.toFixed(1)}%</span>
                  </div>

                  <div className="metric-row">
                    <div className="metric-compact">
                      <span className="label">Forecast (+1h)</span>
                      <span className="value" style={{ color: district.forecasted_traffic > district.traffic_density ? '#f44336' : '#4caf50' }}>
                        {district.forecasted_traffic.toFixed(1)}%
                        {district.forecasted_traffic > district.traffic_density ? ' ↑' : ' ↓'}
                      </span>
                    </div>
                    <div className="metric-compact">
                      <span className="label">Energy</span>
                      <span className="value">{district.energy_demand.toFixed(0)} kWh</span>
                    </div>
                  </div>

                  <div className="metric-row">
                    <div className="metric-compact">
                      <span className="label">AQI</span>
                      <span className="value" style={{ color: district.air_quality_index > 100 ? '#f44336' : '#fff' }}>
                        {district.air_quality_index.toFixed(0)}
                      </span>
                    </div>
                    <div className="metric-compact">
                      <span className="label">Response</span>
                      <span className="value" style={{ color: district.emergency_response_time > 10 ? '#ff9800' : '#fff' }}>
                        {district.emergency_response_time.toFixed(1)} min
                      </span>
                    </div>
                  </div>

                  <div className="metric-compact">
                    <span className="label">Incidents: </span>
                    <span className="value warning">{district.active_incidents}</span>
                  </div>

                  <DistrictChart data={districtHistory[district.name] || []} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="loading">Waiting for city data...</div>
        )}
      </main>

      <NewsTicker alerts={alerts} cityHealth={cityData ? cityData.city_health_score : 0} />
    </div>
  )
}

function getTrafficColor(density) {
  if (density < 40) return '#4caf50' // Green
  if (density < 70) return '#ff9800' // Orange
  return '#f44336' // Red
}

export default App
