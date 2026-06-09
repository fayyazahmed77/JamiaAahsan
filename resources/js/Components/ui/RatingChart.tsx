import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

interface RatingChartProps {
    breakdown: Record<string, number>;
    total: number;
}

export function RatingChart({ breakdown, total }: RatingChartProps) {
    const data = [5, 4, 3, 2, 1].map((star) => ({
        star: `${star}★`,
        count: breakdown[String(star)] ?? 0,
        pct: total > 0 ? Math.round(((breakdown[String(star)] ?? 0) / total) * 100) : 0,
    }));

    return (
        <div style={{ width: '100%', height: 160 }}>
            <ResponsiveContainer>
                <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 8 }}>
                    <XAxis type="number" hide />
                    <YAxis
                        type="category"
                        dataKey="star"
                        width={28}
                        tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'var(--surface-2)',
                            border: '1px solid var(--border)',
                            borderRadius: 8,
                            fontSize: 12,
                            color: 'var(--text-primary)',
                        }}
                        formatter={(value: any, _: any, props: any) => [
                            `${value} reviews (${props.payload?.pct ?? 0}%)`,
                            'Count',
                        ]}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={entry.star.startsWith('5') || entry.star.startsWith('4')
                                    ? 'var(--accent-500)'
                                    : entry.star.startsWith('3')
                                        ? 'var(--warning)'
                                        : 'var(--danger)'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
