import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DistrictChart = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 200, marginTop: '20px' }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={[0, 100]} stroke="#ccc" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="traffic_density"
                        stroke="#8884d8"
                        name="Traffic"
                        dot={false}
                        strokeWidth={2}
                    />
                    <Line
                        type="monotone"
                        dataKey="forecasted_traffic"
                        stroke="#82ca9d"
                        name="Forecast"
                        strokeDasharray="5 5"
                        dot={false}
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DistrictChart;
