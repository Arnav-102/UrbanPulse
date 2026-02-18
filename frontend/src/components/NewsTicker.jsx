import React, { useEffect, useState } from 'react';
import './NewsTicker.css';

const NewsTicker = ({ alerts, cityHealth }) => {
    const [newsItems, setNewsItems] = useState([]);

    useEffect(() => {
        // Default headlines
        let items = [
            "Welcome to UrbanPulse v2.0 - Real-time City Monitoring",
            `City Health Score currently at ${cityHealth}%`,
            "Traffic flow normal in most districts...",
        ];

        // Add active alerts to the ticker
        if (alerts && alerts.length > 0) {
            const alertTexts = alerts.map(a => `⚠️ ${a.msg}`);
            items = [...alertTexts, ...items];
        }

        setNewsItems(items);
    }, [alerts, cityHealth]);

    return (
        <div className="news-ticker-container">
            <div className="news-ticker-label">LIVE ALERTS</div>
            <div className="news-ticker-content">
                <div className="news-ticker-track">
                    {newsItems.map((item, index) => (
                        <span key={index} className="news-item">
                            {item}
                        </span>
                    ))}
                    {/* Duplicate for seamless scrolling */}
                    {newsItems.map((item, index) => (
                        <span key={`dup-${index}`} className="news-item">
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;
