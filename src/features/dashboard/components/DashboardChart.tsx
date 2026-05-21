import { useState } from 'react';
import { Customer, Feedback } from '../../../types';

interface DashboardChartProps {
  customers: Customer[];
  feedbacks: Feedback[];
}

export default function DashboardChart({ customers, feedbacks }: DashboardChartProps) {
  const [activeTab, setActiveTab] = useState<'branch' | 'sentiment' | 'weekly'>('branch');

  const branches = ['ลาดพร้าว', 'เชียงใหม่ นิมาน', 'ขอนแก่น มข.', 'หาดใหญ่ เซ็นทรัล', 'ชลบุรี อมตะ'];
  const branchCounts = branches.map(br => ({
    name: br,
    count: customers.filter(c => c.branch === br).length
  }));
  const maxCount = Math.max(...branchCounts.map(b => b.count), 1);

  const totalFeedbacks = feedbacks.length || 1;
  const positiveCount = feedbacks.filter(fb => fb.sentiment === 'positive').length;
  const neutralCount = feedbacks.filter(fb => fb.sentiment === 'neutral').length;
  const negativeCount = feedbacks.filter(fb => fb.sentiment === 'negative').length;
  
  const sentimentPct = {
    positive: Math.round((positiveCount / totalFeedbacks) * 100),
    neutral: Math.round((neutralCount / totalFeedbacks) * 100),
    negative: Math.round((negativeCount / totalFeedbacks) * 100)
  };

  const weeklyTrends = [
    { week: 'สัปดาห์ 1', score: 4.0 },
    { week: 'สัปดาห์ 2', score: 4.2 },
    { week: 'สัปดาห์ 3', score: 3.8 },
    { week: 'สัปดาห์ 4', score: 4.5 }
  ];

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
        <div className="flex bg-gray-100 p-1 rounded-lg self-start">
          <button
            onClick={() => setActiveTab('branch')}
            className={`px-3 py-1.5 rounded text-[11px] font-bold tracking-wide transition-all ${
              activeTab === 'branch'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            จำแนกตามสาขา
          </button>
          <button
            onClick={() => setActiveTab('sentiment')}
            className={`px-3 py-1.5 rounded text-[11px] font-bold tracking-wide transition-all ${
              activeTab === 'sentiment'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            สัดส่วน Sentiment
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-3 py-1.5 rounded text-[11px] font-bold tracking-wide transition-all ${
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
                const heightPct = (b.count / maxCount) * 100;
                return (
                  <div key={i} className="flex flex-col items-center group w-1/5 max-w-[90px]">
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-gray-950 text-white text-[10px] py-1 px-2.5 rounded transition-opacity duration-200 pointer-events-none shadow z-20">
                      สาขา {b.name}: {b.count} ราย
                    </div>
                    <div 
                      className="w-full bg-primary rounded-t transition-all duration-700 ease-out hover:bg-primary-dark shadow-sm"
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
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" stroke="#057A55" strokeWidth="4.2" 
                  strokeDasharray={`${sentimentPct.positive} ${100 - sentimentPct.positive}`} 
                  strokeDashoffset="25"
                />
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" stroke="#92400E" strokeWidth="4.2" 
                  strokeDasharray={`${sentimentPct.neutral} ${100 - sentimentPct.neutral}`} 
                  strokeDashoffset={`${25 - sentimentPct.positive}`}
                />
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" stroke="#C81E1E" strokeWidth="4.2" 
                  strokeDasharray={`${sentimentPct.negative} ${100 - sentimentPct.negative}`} 
                  strokeDashoffset={`${25 - sentimentPct.positive - sentimentPct.neutral}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">เชิงบวก</span>
                <span className="text-md font-black text-gray-900">{sentimentPct.positive}%</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-sentiment-positive"></span>
                <div>
                  <p className="text-[11px] font-bold text-gray-800">พอใจ (Positive)</p>
                  <p className="text-[10px] text-gray-500 font-medium">{positiveCount} รายการ ({sentimentPct.positive}%)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-sentiment-neutral"></span>
                <div>
                  <p className="text-[11px] font-bold text-gray-800">เฉยๆ (Neutral)</p>
                  <p className="text-[10px] text-gray-500 font-medium">{neutralCount} รายการ ({sentimentPct.neutral}%)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-sentiment-negative"></span>
                <div>
                  <p className="text-[11px] font-bold text-gray-800">ไม่พอใจ (Negative)</p>
                  <p className="text-[10px] text-gray-500 font-medium">{negativeCount} รายการ ({sentimentPct.negative}%)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📈 LINE CHART: Weekly CSAT Score Trend */}
        {activeTab === 'weekly' && (
          <div className="w-full h-full flex flex-col justify-end px-4">
            <div className="w-full h-36 relative">
              <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0051BA" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0051BA" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M 50 80 Q 150 60 250 90 T 350 40" 
                  fill="none" 
                  stroke="#0051BA" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                <path 
                  d="M 50 80 Q 150 60 250 90 T 350 40 L 350 120 L 50 120 Z" 
                  fill="url(#chartGrad)" 
                />
                <circle cx="50" cy="80" r="4" fill="#0051BA" stroke="white" strokeWidth="1" />
                <circle cx="150" cy="65" r="4" fill="#0051BA" stroke="white" strokeWidth="1" />
                <circle cx="250" cy="83" r="4" fill="#0051BA" stroke="white" strokeWidth="1" />
                <circle cx="350" cy="40" r="5" fill="#0051BA" stroke="white" strokeWidth="1" />
              </svg>

              <div className="absolute left-[3%] top-[55%] -translate-y-1/2 bg-slate-900 text-white text-[9px] px-1 py-0.5 rounded font-bold">สัปดาห์ 1: 4.0 ★</div>
              <div className="absolute left-[30%] top-[45%] -translate-y-1/2 bg-slate-900 text-white text-[9px] px-1 py-0.5 rounded font-bold">สัปดาห์ 2: 4.2 ★</div>
              <div className="absolute left-[58%] top-[60%] -translate-y-1/2 bg-slate-900 text-white text-[9px] px-1 py-0.5 rounded font-bold">สัปดาห์ 3: 3.8 ★</div>
              <div className="absolute left-[85%] top-[25%] -translate-y-1/2 bg-slate-900 text-white text-[9px] px-1 py-0.5 rounded font-bold">สัปดาห์ 4: 4.5 ★</div>
            </div>

            <div className="flex justify-between items-center px-4 mt-2 border-t border-gray-100 pt-2">
              {weeklyTrends.map((t, idx) => (
                <span key={idx} className="text-[10px] text-gray-500 font-bold">
                  {t.week} (คะแนน: {t.score.toFixed(1)})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
