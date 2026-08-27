import React, { useState, useMemo } from 'react';
import { SectorTrend } from '../types';
import { ChevronDown, TrendingUp, Lightbulb, AlertCircle, Target } from 'lucide-react';

interface TrendScreenProps {
  trends: SectorTrend[];
}

export default function TrendScreen({ trends }: TrendScreenProps) {
  const [expandedSector, setExpandedSector] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'growth'>('growth');

  const sortedTrends = useMemo(() => {
    return [...trends].sort((a, b) => {
      if (sortBy === 'growth') {
        const aGrowth = parseInt(a.growthRate) || 0;
        const bGrowth = parseInt(b.growthRate) || 0;
        return bGrowth - aGrowth;
      }
      return a.sector.localeCompare(b.sector, 'ko');
    });
  }, [trends, sortBy]);

  const getGrowthColor = (growthRate: string) => {
    const rate = parseInt(growthRate);
    if (rate >= 15) return 'text-red-600';
    if (rate >= 10) return 'text-orange-600';
    if (rate >= 5) return 'text-amber-600';
    if (rate >= 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getOutlookBadge = (status: 'positive' | 'neutral' | 'caution') => {
    switch (status) {
      case 'positive':
        return {
          label: '🌟 미래가 창창',
          color: 'bg-green-100 text-green-800',
        };
      case 'neutral':
        return {
          label: '📊 변화 중',
          color: 'bg-blue-100 text-blue-800',
        };
      case 'caution':
        return {
          label: '⚠️ 주의 필요',
          color: 'bg-orange-100 text-orange-800',
        };
      default:
        return {
          label: '📈 분석 중',
          color: 'bg-gray-100 text-gray-800',
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900">분야별 트렌드</h1>
          <p className="text-sm text-slate-600 mt-1">산업 동향 및 성장 가능성 분석</p>
        </div>

        {/* Sort Options */}
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => setSortBy('growth')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              sortBy === 'growth'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            성장률순
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              sortBy === 'name'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            분야명순
          </button>
        </div>
      </div>

      {/* Trends List */}
      <div className="px-3 py-4 space-y-3">
        {sortedTrends.map((trend) => (
          <div
            key={trend.sector}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Collapsed Header */}
            <button
              onClick={() =>
                setExpandedSector(expandedSector === trend.sector ? null : trend.sector)
              }
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 text-left">
                <span className="text-3xl">{trend.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{trend.sector}</h3>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                    {trend.currentStatus}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={`text-sm font-bold ${getGrowthColor(trend.growthRate)}`}>
                    {trend.growthRate}
                  </p>
                  <p className="text-xs text-slate-600">성장률</p>
                </div>
                <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${getOutlookBadge(trend.outlookStatus).color}`}>
                  {getOutlookBadge(trend.outlookStatus).label}
                </div>
                <ChevronDown
                  size={20}
                  className={`text-slate-400 transition-transform ${
                    expandedSector === trend.sector ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Expanded Content */}
            {expandedSector === trend.sector && (
              <div className="border-t border-slate-200 px-4 py-4 bg-slate-50 space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">시장 규모</p>
                    <p className="font-semibold text-slate-900 text-sm">{trend.marketSize}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">영문명</p>
                    <p className="font-semibold text-slate-900 text-sm">{trend.englishName}</p>
                  </div>
                </div>

                {/* Key Trends */}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-blue-600" />
                    <p className="font-semibold text-slate-900 text-sm">주요 트렌드</p>
                  </div>
                  <ul className="space-y-1.5">
                    {trend.trends.slice(0, 4).map((t, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Opportunities */}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-green-600" />
                    <p className="font-semibold text-slate-900 text-sm">기회 요인</p>
                  </div>
                  <ul className="space-y-1.5">
                    {trend.opportunities.slice(0, 3).map((opp, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Challenges */}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-orange-600" />
                    <p className="font-semibold text-slate-900 text-sm">도전 요인</p>
                  </div>
                  <ul className="space-y-1.5">
                    {trend.challenges.slice(0, 3).map((challenge, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex gap-2">
                        <span className="text-orange-600 font-bold">⚠</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Future Outlook */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb size={16} className="text-blue-600" />
                    <p className="font-semibold text-slate-900 text-sm">향후 전망</p>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{trend.futureOutlook}</p>
                </div>

                {/* Key Technologies */}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-900 text-sm mb-2">핵심 기술</p>
                  <div className="flex flex-wrap gap-1.5">
                    {trend.keyTechnologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Career Opportunities */}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-900 text-sm mb-2">경력 기회</p>
                  <div className="flex flex-wrap gap-1.5">
                    {trend.careerOpportunities.map((career, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-medium"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skill Demand */}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-900 text-sm mb-2">필요 기술</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">기술 스킬</p>
                      <div className="flex flex-wrap gap-1">
                        {trend.skillDemand.technical.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">소프트 스킬</p>
                      <div className="flex flex-wrap gap-1">
                        {trend.skillDemand.soft.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary & Job Outlook */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <p className="text-xs text-emerald-700 font-semibold mb-1">연봉 트렌드</p>
                    <p className="text-xs text-slate-700">{trend.salaryTrend}</p>
                  </div>
                  <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                    <p className="text-xs text-cyan-700 font-semibold mb-1">채용 전망</p>
                    <p className="text-xs text-slate-700">{trend.jobOutlook}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
