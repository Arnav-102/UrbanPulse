import React, { useMemo } from 'react';
import './Rain.css';

const Rain = ({ count = 60 }) => {
    // Generate drops only once to avoid re-rendering jitter
    const drops = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            left: Math.random() * 100, // Random horizontal position
            delay: Math.random() * 2,  // Random start delay
            duration: 0.5 + Math.random() * 0.5, // Random fall speed (0.5s - 1.0s)
            opacity: 0.3 + Math.random() * 0.5, // Random transparency
            scale: 0.5 + Math.random() * 0.5, // Random size for depth
        }));
    }, [count]);

    return (
        <div className="rain-container">
            {drops.map((drop, i) => (
                <div
                    key={i}
                    className="rain-drop"
                    style={{
                        left: `${drop.left}%`,
                        animationDelay: `-${drop.delay}s`,
                        animationDuration: `${drop.duration}s`,
                        opacity: drop.opacity,
                        transform: `scale(${drop.scale})`
                    }}
                />
            ))}
        </div>
    );
};

export default Rain;
