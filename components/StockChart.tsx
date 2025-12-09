"use client";
import React, { useState, memo } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { LineChart as LineIcon, Activity, BarChart3 } from 'lucide-react';

interface ChartData {
    time: string;
    price: number;
}

type ChartType = 'line' | 'area' | 'bar';

const StockChart = ({ data, color = "#A855F7" }: { data: ChartData[], color?: string }) => { 
    const [chartType, setChartType] = useState<ChartType>('line');

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0B0E14] border border-white/10 p-3 rounded-lg shadow-xl">
                    <p className="text-gray-400 text-xs mb-1">{label}</p>
                    <p className="text-purple-400 font-bold font-mono text-lg">
                        ${Number(payload[0].value).toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[400px] relative">
            
            {/* Chart Switcher Toolbar */}
            <div className="absolute top-2 right-4 z-20 flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10 backdrop-blur-md">
                <button 
                    onClick={() => setChartType('line')}
                    className={`p-1.5 rounded-md transition-all ${chartType === 'line' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <LineIcon className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setChartType('area')}
                    className={`p-1.5 rounded-md transition-all ${chartType === 'area' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Activity className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setChartType('bar')}
                    className={`p-1.5 rounded-md transition-all ${chartType === 'bar' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <BarChart3 className="w-4 h-4" />
                </button>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="time" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis domain={['auto', 'auto']} stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `$${val.toFixed(0)}`} tickLine={false} axisLine={false} width={60} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20' }} />
                        <Line type="monotone" dataKey="price" stroke={color} strokeWidth={3} dot={false} activeDot={{ r: 6, fill: color, stroke: '#fff' }} isAnimationActive={false} />
                    </LineChart>
                ) : chartType === 'area' ? (
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={color} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="time" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis domain={['auto', 'auto']} stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `$${val.toFixed(0)}`} tickLine={false} axisLine={false} width={60} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20' }} />
                        <Area type="monotone" dataKey="price" stroke={color} strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" isAnimationActive={false} />
                    </AreaChart>
                ) : (
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="time" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis domain={['auto', 'auto']} stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `$${val.toFixed(0)}`} tickLine={false} axisLine={false} width={60} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff10' }} />
                        <Bar dataKey="price" fill={color} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}

export default memo(StockChart);