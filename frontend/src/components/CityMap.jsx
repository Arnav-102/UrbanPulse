import React, { useState } from 'react';
import './CityMap.css'; // New CSS file for specific map animations

const CityMap = ({ districts, onSelectDistrict }) => {
    const [hoveredDistrict, setHoveredDistrict] = useState(null);

    const handleSelect = (name) => {
        onSelectDistrict(name);
    };

    // Helper to find district data
    const getDistrict = (name) => districts.find(d => d.name === name) || {};

    const getColor = (name) => {
        const d = getDistrict(name);
        if (!d.traffic_density) return '#333';
        if (d.traffic_density > 80) return '#e53935'; // Red
        if (d.traffic_density > 50) return '#fb8c00'; // Orange
        return '#43a047'; // Green
    };

    const getWarningIcon = (name, x, y) => {
        const d = getDistrict(name);
        if (d.active_incidents > 0) {
            return (
                <g className="accident-marker" transform={`translate(${x}, ${y})`}>
                    <circle r="12" fill="rgba(244, 67, 54, 0.8)" stroke="#f44336" strokeWidth="2" />
                    <text textAnchor="middle" dy="4" fontSize="14">⚠️</text>
                </g>
            );
        }
        return null;
    };

    // Traffic Flow Path Component
    const TrafficFlow = ({ from, to }) => (
        <path d={`M ${from} L ${to}`} stroke="#4fc3f7" strokeWidth="2" fill="none" strokeDasharray="5,5" className="traffic-flow-line" opacity="0.6" />
    );

    // Render Tooltip
    const renderTooltip = () => {
        if (!hoveredDistrict) return null;
        const d = getDistrict(hoveredDistrict.name);
        return (
            <g transform={`translate(${hoveredDistrict.x}, ${hoveredDistrict.y - 40})`} style={{ pointerEvents: 'none' }}>
                <rect x="-60" y="-30" width="120" height="60" rx="5" fill="rgba(0,0,0,0.9)" stroke="#fff" strokeWidth="1" />
                <text x="0" y="-10" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">{d.name}</text>
                <text x="0" y="5" textAnchor="middle" fill="#ccc" fontSize="10">Traffic: {d.traffic_density?.toFixed(1)}%</text>
                <text x="0" y="20" textAnchor="middle" fill="#ccc" fontSize="10">AQI: {d.air_quality_index?.toFixed(0)}</text>
            </g>
        );
    };

    return (
        <svg viewBox="0 0 400 300" style={{ width: '100%', height: 'auto', maxHeight: '400px', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}>
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#4fc3f7" opacity="0.6" />
                </marker>
            </defs>

            {/* Background */}
            <rect x="0" y="0" width="400" height="300" fill="#121212" rx="10" />

            {/* River */}
            <path d="M 0 150 Q 200 100 400 150" stroke="#0d47a1" strokeWidth="20" fill="none" />

            {/* Traffic Flows Connections */}
            <TrafficFlow from="105 120" to="105 180" /> {/* Uptown -> Industrial */}
            <TrafficFlow from="190 70" to="210 70" />   {/* Uptown -> Downtown */}
            <TrafficFlow from="295 120" to="295 180" /> {/* Downtown -> Suburbs */}
            <TrafficFlow from="190 230" to="210 230" /> {/* Industrial -> Suburbs */}

            {/* Uptown (Top Left) */}
            <g
                onClick={() => handleSelect("Uptown")}
                onMouseEnter={() => setHoveredDistrict({ name: "Uptown", x: 105, y: 70 })}
                onMouseLeave={() => setHoveredDistrict(null)}
                style={{ cursor: 'pointer' }}
                className="district-group"
            >
                <path d="M 20 20 L 190 20 L 190 120 L 20 120 Z" fill={getColor("Uptown")} stroke="#fff" strokeWidth="2" opacity="0.8" />
                <text x="105" y="70" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Uptown</text>
                {getWarningIcon("Uptown", 105, 40)}
            </g>

            {/* Downtown (Top Right) */}
            <g
                onClick={() => handleSelect("Downtown")}
                onMouseEnter={() => setHoveredDistrict({ name: "Downtown", x: 295, y: 70 })}
                onMouseLeave={() => setHoveredDistrict(null)}
                style={{ cursor: 'pointer' }}
                className="district-group"
            >
                <path d="M 210 20 L 380 20 L 380 120 L 210 120 Z" fill={getColor("Downtown")} stroke="#fff" strokeWidth="2" opacity="0.8" />
                <text x="295" y="70" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Downtown</text>
                {getWarningIcon("Downtown", 295, 40)}
            </g>

            {/* Industrial (Bottom Left) */}
            <g
                onClick={() => handleSelect("Industrial District")}
                onMouseEnter={() => setHoveredDistrict({ name: "Industrial District", x: 105, y: 230 })}
                onMouseLeave={() => setHoveredDistrict(null)}
                style={{ cursor: 'pointer' }}
                className="district-group"
            >
                <path d="M 20 180 L 190 180 L 190 280 L 20 280 Z" fill={getColor("Industrial District")} stroke="#fff" strokeWidth="2" opacity="0.8" />
                <text x="105" y="230" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Industrial</text>
                {getWarningIcon("Industrial District", 105, 200)}
            </g>

            {/* Suburbs (Bottom Right) */}
            <g
                onClick={() => handleSelect("Suburbs")}
                onMouseEnter={() => setHoveredDistrict({ name: "Suburbs", x: 295, y: 230 })}
                onMouseLeave={() => setHoveredDistrict(null)}
                style={{ cursor: 'pointer' }}
                className="district-group"
            >
                <path d="M 210 180 L 380 180 L 380 280 L 210 280 Z" fill={getColor("Suburbs")} stroke="#fff" strokeWidth="2" opacity="0.8" />
                <text x="295" y="230" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Suburbs</text>
                {getWarningIcon("Suburbs", 295, 200)}
            </g>

            {renderTooltip()}
        </svg>
    );
};

export default CityMap;
