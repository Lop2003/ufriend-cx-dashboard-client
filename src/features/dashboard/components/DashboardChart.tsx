import { useMemo } from 'react';
import useCX from '../../../hooks/useCX';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

export default function DashboardChart() {
  const { branchStats, filteredFeedbacks, selectedBranch, setSelectedBranch } = useCX();

  // 1. Data for Bar Chart: Customers by Branch
  const branchCountsData = useMemo(() => {
    const topStats = [...branchStats].sort((a, b) => b.customer_count - a.customer_count).slice(0, 5);
    return topStats.map(stat => {
      const isSelected = selectedBranch === stat.branch;
      return {
        name: stat.branch,
        count: stat.customer_count,
        isSelected
      };
    });
  }, [branchStats, selectedBranch]);

  // 2. Data for Pie Chart: Sentiment Proportion
  const sentimentData = useMemo(() => {
    const total = filteredFeedbacks.length || 1;
    const positive = filteredFeedbacks.filter(fb => fb.sentiment === 'positive').length;
    const neutral = filteredFeedbacks.filter(fb => fb.sentiment === 'neutral').length;
    const negative = filteredFeedbacks.filter(fb => fb.sentiment === 'negative').length;

    const pctPositive = Math.round((positive / total) * 100);
    const pctNeutral = Math.round((neutral / total) * 100);
    const pctNegative = Math.round((negative / total) * 100);

    return {
      percentage: pctPositive,
      chartData: [
        { name: 'พอใจ (Positive)', value: pctPositive, color: '#057A55' },
        { name: 'เฉยๆ (Neutral)', value: pctNeutral, color: '#92400E' },
        { name: 'ไม่พอใจ (Negative)', value: pctNegative, color: '#C81E1E' }
      ]
    };
  }, [filteredFeedbacks]);

  // 3. Data for Line Chart: Weekly CSAT rating score trend
  const weeklyTrendsData = useMemo(() => {
    if (filteredFeedbacks.length === 0) {
      return [
        { name: 'สัปดาห์ 1', score: 4.0 },
        { name: 'สัปดาห์ 2', score: 4.0 },
        { name: 'สัปดาห์ 3', score: 4.0 },
        { name: 'สัปดาห์ 4', score: 4.0 }
      ];
    }

    const sorted = [...filteredFeedbacks].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const minTime = new Date(sorted[0].created_at).getTime();
    const maxTimeOriginal = new Date(sorted[sorted.length - 1].created_at).getTime();
    const maxTime = minTime === maxTimeOriginal
      ? minTime + 1000 * 60 * 60 * 24 * 28 // 4 weeks fallback
      : maxTimeOriginal;

    const totalDuration = maxTime - minTime;
    const interval = totalDuration / 4;

    const trends = [];
    let lastAvg = 4.0;

    for (let i = 0; i < 4; i++) {
      const start = minTime + i * interval;
      const end = start + interval;

      const periodFeedbacks = sorted.filter(fb => {
        const t = new Date(fb.created_at).getTime();
        return t >= start && t < end;
      });

      let avg = lastAvg;
      if (periodFeedbacks.length > 0) {
        avg = periodFeedbacks.reduce((acc, f) => acc + f.rating, 0) / periodFeedbacks.length;
        lastAvg = avg;
      }

      trends.push({
        name: `สัปดาห์ ${i + 1}`,
        score: parseFloat(avg.toFixed(1))
      });
    }

    return trends;
  }, [filteredFeedbacks]);

  // Handle bar click to toggle branch filter
  const handleBarClick = (data: any) => {
    if (data && data.name) {
      const isAlreadySelected = selectedBranch === data.name;
      setSelectedBranch(isAlreadySelected ? '' : data.name);
    }
  };

  // Custom tooltips for premium aesthetics
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl shadow-xl text-[10px] font-bold">
          <p className="text-gray-400 font-extrabold uppercase tracking-wider mb-1">{payload[0].payload.name}</p>
          <p className="text-sm font-black">{payload[0].value} {payload[0].unit || 'ราย'}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-body text-slate-800">

      {/* 📊 1. ลูกค้าจำแนกรายสาขา (Bar Chart with Recharts) */}
      <div className="bg-white p-6 rounded-3xl border border-white/60 shadow-[6px_6px_15px_rgba(163,177,198,0.35),-6px_-6px_15px_rgba(255,255,255,0.8)] flex flex-col justify-between min-h-[420px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-black text-gray-900 tracking-wide font-display uppercase">ลูกค้าจำแนกรายสาขา</h3>
            <p className="text-[10px] text-gray-400">ประมวลจำนวนสัญญาแยกแต่ละพื้นที่สาขา</p>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-64 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={branchCountsData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              onClick={(e) => {
                if (e && e.activePayload) {
                  handleBarClick(e.activePayload[0].payload);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fontWeight: 700, fill: '#6b7280' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: '#9ca3af' }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 81, 186, 0.04)', radius: 8 }} />
              <Bar
                dataKey="count"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
                cursor="pointer"
              >
                {branchCountsData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.isSelected
                        ? '#003a8c'
                        : selectedBranch
                        ? 'rgba(0, 81, 186, 0.25)'
                        : '#0051BA'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🍕 2. สัดส่วน Sentiment (Pie Chart with Recharts) */}
      <div className="bg-white p-6 rounded-3xl border border-white/60 shadow-[6px_6px_15px_rgba(163,177,198,0.35),-6px_-6px_15px_rgba(255,255,255,0.8)] flex flex-col justify-between min-h-[420px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-black text-gray-900 tracking-wide font-display uppercase">สัดส่วน Sentiment</h3>
            <p className="text-[10px] text-gray-400">วิเคราะห์อารมณ์รวมของคำประเมินติชม</p>
          </div>
        </div>

        {/* Content Chart Container */}
        <div className="h-64 flex flex-col sm:flex-row items-center justify-center gap-6 px-2 relative">
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={sentimentData.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={66}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sentimentData.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">เชิงบวก</span>
              <span className="text-base font-black text-emerald-600">{sentimentData.percentage}%</span>
            </div>
          </div>

          {/* Legends */}
          <div className="space-y-3 w-full">
            {sentimentData.chartData.map((d, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                <div className="flex justify-between w-full text-xs font-semibold text-gray-700">
                  <span>{d.name.split(' ')[0]}</span>
                  <span className="font-bold text-gray-900">{d.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📈 3. แนวโน้มคะแนน CSAT (Line Chart with Recharts) */}
      <div className="bg-white p-6 rounded-3xl border border-white/60 shadow-[6px_6px_15px_rgba(163,177,198,0.35),-6px_-6px_15px_rgba(255,255,255,0.8)] flex flex-col justify-between min-h-[420px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-black text-gray-900 tracking-wider font-display uppercase">แนวโน้มคะแนน CSAT</h3>
            <p className="text-[10px] text-gray-400">ประวัติค่าเฉลี่ยสถิติคะแนนความพอใจรายสัปดาห์</p>
          </div>
        </div>

        {/* Recharts Line Chart */}
        <div className="h-64 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={weeklyTrendsData}
              margin={{ top: 20, right: 15, left: -25, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fontWeight: 700, fill: '#6b7280' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[1, 5]}
                tick={{ fontSize: 9, fill: '#9ca3af' }}
                tickCount={5}
              />
              <Tooltip
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 border border-slate-800 text-white p-2 py-1.5 rounded-lg shadow-xl text-[9px] font-bold">
                        <p className="text-gray-400 mb-0.5">{payload[0].payload.name}</p>
                        <p className="text-[11px] font-black text-amber-400">{payload[0].value.toFixed(1)} ★</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#0051BA"
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 1.5, fill: '#0051BA', stroke: '#fff' }}
                activeDot={{ r: 7, strokeWidth: 2, fill: '#003a8c', stroke: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
