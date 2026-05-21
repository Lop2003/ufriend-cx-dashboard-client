import { useState, useEffect, useRef, useMemo } from 'react';
import useCX from '../../../hooks/useCX';

export default function DashboardChart() {
  const { filteredCustomers, filteredFeedbacks } = useCX();
  const [activeTab, setActiveTab] = useState<'branch' | 'sentiment' | 'weekly'>('branch');
  const [animate, setAnimate] = useState(false);
  const [pieProgress, setPieProgress] = useState(0);
  const rafRef = useRef<number>(0);

  // Trigger animation resets whenever the active tab changes
  useEffect(() => {
    setAnimate(false);
    setPieProgress(0);

    // Cancel any in-flight rAF from a previous tab
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const timer = setTimeout(() => {
      setAnimate(true);

      // Start rAF-driven pie animation
      if (activeTab === 'sentiment') {
        const duration = 1400; // 1.4 seconds (Perfect sweet spot)
        const startTime = performance.now();

        const tick = (now: number) => {
          const elapsed = now - startTime;
          const linear = Math.min(elapsed / duration, 1);
          // Ease-in-out curve
          const eased = linear < 0.5
            ? 2 * linear * linear
            : 1 - Math.pow(-2 * linear + 2, 2) / 2;
          setPieProgress(eased);
          if (linear < 1) {
            rafRef.current = requestAnimationFrame(tick);
          }
        };
        rafRef.current = requestAnimationFrame(tick);
      }
    }, 120);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [activeTab]);

  // --- Dynamic Branch Data ---
  const branchCounts = useMemo(() => {
    const branches = ['ลาดพร้าว', 'เชียงใหม่ นิมาน', 'ขอนแก่น มข.', 'หาดใหญ่ เซ็นทรัล', 'ชลบุรี อมตะ'];
    return branches.map(br => ({
      name: br,
      count: filteredCustomers.filter(c => c.branch === br).length
    }));
  }, [filteredCustomers]);

  const maxCount = useMemo(() => {
    const counts = branchCounts.map(b => b.count);
    return Math.max(...counts, 1);
  }, [branchCounts]);

  // --- Dynamic Sentiment Data ---
  const sentimentStats = useMemo(() => {
    const total = filteredFeedbacks.length || 1;
    const positive = filteredFeedbacks.filter(fb => fb.sentiment === 'positive').length;
    const neutral = filteredFeedbacks.filter(fb => fb.sentiment === 'neutral').length;
    const negative = filteredFeedbacks.filter(fb => fb.sentiment === 'negative').length;
    
    return {
      total,
      positive,
      neutral,
      negative,
      pct: {
        positive: Math.round((positive / total) * 100),
        neutral: Math.round((neutral / total) * 100),
        negative: Math.round((negative / total) * 100)
      }
    };
  }, [filteredFeedbacks]);

  // --- Dynamic Weekly CSAT Rating Score Trend ---
  const weeklyTrends = useMemo(() => {
    if (filteredFeedbacks.length === 0) {
      return [
        { week: 'สัปดาห์ 1', score: 4.0 },
        { week: 'สัปดาห์ 2', score: 4.0 },
        { week: 'สัปดาห์ 3', score: 4.0 },
        { week: 'สัปดาห์ 4', score: 4.0 }
      ];
    }

    // Sort feedbacks chronologically
    const sorted = [...filteredFeedbacks].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const minTime = new Date(sorted[0].created_at).getTime();
    const maxTimeOriginal = new Date(sorted[sorted.length - 1].created_at).getTime();
    // Pad interval if min/max are identical (single feedback or same instant)
    const maxTime = minTime === maxTimeOriginal 
      ? minTime + 1000 * 60 * 60 * 24 * 28 // 4 weeks
      : maxTimeOriginal;

    const totalDuration = maxTime - minTime;
    const interval = totalDuration / 4;

    const trends = [];
    let lastAvg = 4.0; // Seed value fallback

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
        lastAvg = avg; // Cache last valid score
      }
      
      trends.push({
        week: `สัปดาห์ ${i + 1}`,
        score: parseFloat(avg.toFixed(1))
      });
    }

    return trends;
  }, [filteredFeedbacks]);

  // Generate SVG coordinates dynamically for the Line Chart (viewBox="0 0 400 120")
  // X values: index 0 -> 50, 1 -> 150, 2 -> 250, 3 -> 350
  // Y values: Score 5.0 -> Y:20, Score 1.0 -> Y:100
  const lineCoords = useMemo(() => {
    const xCoords = [50, 150, 250, 350];
    return weeklyTrends.map((t, idx) => {
      const x = xCoords[idx];
      // Formula: map score [1, 5] to Y [100, 20]
      const score = Math.max(1, Math.min(5, t.score));
      const y = 100 - ((score - 1) / 4) * 80;
      return { x, y, score: t.score };
    });
  }, [weeklyTrends]);

  // Cubic Bezier curve paths computed dynamically
  const svgPaths = useMemo(() => {
    if (lineCoords.length < 4) return { line: '', fill: '' };
    const p0 = lineCoords[0];
    const p1 = lineCoords[1];
    const p2 = lineCoords[2];
    const p3 = lineCoords[3];

    // Smooth control offsets
    const strokePath = `M ${p0.x} ${p0.y} ` +
      `C ${(p0.x + p1.x) / 2} ${p0.y}, ${(p0.x + p1.x) / 2} ${p1.y}, ${p1.x} ${p1.y} ` +
      `C ${(p1.x + p2.x) / 2} ${p1.y}, ${(p1.x + p2.x) / 2} ${p2.y}, ${p2.x} ${p2.y} ` +
      `C ${(p2.x + p3.x) / 2} ${p2.y}, ${(p2.x + p3.x) / 2} ${p3.y}, ${p3.x} ${p3.y}`;

    const fillPath = `${strokePath} L ${p3.x} 120 L ${p0.x} 120 Z`;

    return { line: strokePath, fill: fillPath };
  }, [lineCoords]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-white/60 shadow-[6px_6px_15px_rgba(163,177,198,0.35),-6px_-6px_15px_rgba(255,255,255,0.8)] mb-6 font-body text-slate-800">
      {/* Header and navigation tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-6 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-wide font-display">รายงานการวิเคราะห์และกราฟสถิติ</h3>
            <p className="text-[11px] text-gray-400">ประมวลผลข้อมูลความพึงพอใจและสถิติสัญญาจำแนกแต่ละสาขา</p>
          </div>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto scrollbar-none self-stretch sm:self-start gap-1">
          <button
            onClick={() => setActiveTab('branch')}
            className={`flex-1 sm:flex-initial text-center whitespace-nowrap px-3 py-1.5 rounded text-[11px] font-bold tracking-wide transition-all ${
              activeTab === 'branch'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            จำแนกตามสาขา
          </button>
          <button
            onClick={() => setActiveTab('sentiment')}
            className={`flex-1 sm:flex-initial text-center whitespace-nowrap px-3 py-1.5 rounded text-[11px] font-bold tracking-wide transition-all ${
              activeTab === 'sentiment'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            สัดส่วน Sentiment
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex-1 sm:flex-initial text-center whitespace-nowrap px-3 py-1.5 rounded text-[11px] font-bold tracking-wide transition-all ${
              activeTab === 'weekly'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            แนวโน้ม CSAT
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-56 flex items-center justify-center relative">
        {/* 📊 BAR CHART: Customers per branch */}
        {activeTab === 'branch' && (
          <div className="w-full h-full flex flex-col justify-end px-4">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-4">
              <div className="border-b border-gray-100 w-full h-0"></div>
              <div className="border-b border-gray-100 w-full h-0"></div>
              <div className="border-b border-gray-200 w-full h-0"></div>
            </div>

            <div className="flex items-end justify-between h-40 relative z-10 w-full px-8">
              {branchCounts.map((b, i) => {
                const heightPct = animate ? (b.count / maxCount) * 100 : 0;
                return (
                  <div key={i} className="flex flex-col items-center h-full group w-1/5 max-w-[90px] justify-end">
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-gray-950 text-white text-[10px] py-1 px-2.5 rounded transition-opacity duration-200 pointer-events-none shadow z-20 whitespace-nowrap">
                      สาขา {b.name}: {b.count} ราย
                    </div>
                    <div 
                      className="w-full bg-primary rounded-t transition-all duration-[1300ms] cubic-bezier(0.16,1,0.3,1) hover:bg-primary-dark shadow-sm"
                      style={{ height: `${Math.max(heightPct, 8)}%` }}
                    ></div>
                    <span className="text-[10px] text-gray-500 font-semibold mt-2 text-center truncate w-full">
                      {b.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 🍕 PIE CHART: Sentiment Analysis */}
        {activeTab === 'sentiment' && (
          <div className="w-full h-full flex flex-col sm:flex-row items-center justify-center gap-12 px-8">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="4.2" />
                {/* Positive */}
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" stroke="#057A55" strokeWidth="4.2"
                  strokeDasharray={`${sentimentStats.pct.positive * pieProgress} ${100 - sentimentStats.pct.positive * pieProgress}`}
                  strokeDashoffset="25"
                />
                {/* Neutral */}
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" stroke="#92400E" strokeWidth="4.2"
                  strokeDasharray={`${sentimentStats.pct.neutral * pieProgress} ${100 - sentimentStats.pct.neutral * pieProgress}`}
                  strokeDashoffset={25 - sentimentStats.pct.positive * pieProgress}
                />
                {/* Negative */}
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" stroke="#C81E1E" strokeWidth="4.2"
                  strokeDasharray={`${sentimentStats.pct.negative * pieProgress} ${100 - sentimentStats.pct.negative * pieProgress}`}
                  strokeDashoffset={25 - sentimentStats.pct.positive * pieProgress - sentimentStats.pct.neutral * pieProgress}
                />
              </svg>
              <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${pieProgress > 0.3 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">เชิงบวก</span>
                <span className="text-md font-black text-gray-900">{Math.round(sentimentStats.pct.positive * pieProgress)}%</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-sentiment-positive"></span>
                <div>
                  <p className="text-[11px] font-bold text-gray-800">พอใจ (Positive)</p>
                  <p className="text-[10px] text-gray-500 font-medium">{sentimentStats.positive} รายการ ({sentimentStats.pct.positive}%)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-sentiment-neutral"></span>
                <div>
                  <p className="text-[11px] font-bold text-gray-800">เฉยๆ (Neutral)</p>
                  <p className="text-[10px] text-gray-500 font-medium">{sentimentStats.neutral} รายการ ({sentimentStats.pct.neutral}%)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-sentiment-negative"></span>
                <div>
                  <p className="text-[11px] font-bold text-gray-800">ไม่พอใจ (Negative)</p>
                  <p className="text-[10px] text-gray-500 font-medium">{sentimentStats.negative} รายการ ({sentimentStats.pct.negative}%)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📈 LINE CHART: Weekly CSAT Score Trend */}
        {activeTab === 'weekly' && (
          <div className="w-full h-full flex flex-col justify-end px-4 animate-fade-in-up">
            <div className="w-full h-36 relative">
              <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0051BA" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0051BA" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Dynamic fill gradient path */}
                {animate && svgPaths.fill && (
                  <path 
                    d={svgPaths.fill} 
                    fill="url(#chartGrad)" 
                    className="animate-fill-fade"
                  />
                )}
                {/* Dynamic draw stroke path */}
                {svgPaths.line && (
                  <path 
                    d={svgPaths.line} 
                    fill="none" 
                    stroke="#0051BA" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    className={animate ? 'animate-line-draw' : 'opacity-0'}
                  />
                )}
                
                {/* Points growing inside circles */}
                {animate && lineCoords.map((pt, idx) => (
                  <circle 
                    key={idx}
                    cx={pt.x} 
                    cy={pt.y} 
                    r={idx === 3 ? 5 : 4} 
                    fill="#0051BA" 
                    stroke="white" 
                    strokeWidth="1.5" 
                    className={`transition-all duration-300 transform scale-100 ease-out`}
                    style={{ transitionDelay: `${idx * 150}ms` }}
                  />
                ))}
              </svg>

              {/* Dynamic weekly data popups */}
              {lineCoords.map((pt, idx) => (
                <div 
                  key={idx}
                  className={`absolute -translate-x-1/2 -translate-y-6 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded-lg font-bold transition-all duration-500 shadow-md ${
                    animate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                  }`}
                  style={{
                    left: `${(pt.x / 400) * 100}%`,
                    top: `${(pt.y / 120) * 100}%`,
                    transitionDelay: `${idx * 100}ms`
                  }}
                >
                  สัปดาห์ {idx + 1}: {pt.score.toFixed(1)} ★
                </div>
              ))}
            </div>

            <div className={`relative h-6 mt-2 border-t border-gray-100 pt-2 transition-opacity duration-700 ${animate ? 'opacity-100' : 'opacity-0'}`}>
              {weeklyTrends.map((t, idx) => {
                const pct = (lineCoords[idx].x / 400) * 100;
                return (
                  <span 
                    key={idx} 
                    className="absolute -translate-x-1/2 text-[9px] sm:text-[10px] text-gray-500 font-bold whitespace-nowrap"
                    style={{ left: `${pct}%` }}
                  >
                    {t.week} ({t.score.toFixed(1)} ★)
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
