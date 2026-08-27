import React, { useState, useMemo } from 'react';
import { Certification, UserCertification, CertificationRoute } from '../types';
import { Award, CheckCircle, Target, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface CertificationScreenProps {
  certifications: Certification[];
  userCertifications: UserCertification[];
  routes: CertificationRoute[];
}

export default function CertificationScreen({
  certifications,
  userCertifications,
  routes,
}: CertificationScreenProps) {
  const [expandedCertId, setExpandedCertId] = useState<string | null>(null);
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);

  // 취득한 자격증 목록
  const acquiredCerts = useMemo(
    () =>
      userCertifications
        .filter((u) => u.status === 'acquired')
        .map((u) => certifications.find((c) => c.id === u.certificationId))
        .filter(Boolean) as Certification[],
    [userCertifications, certifications]
  );

  // 응시 가능한 자격증 (취득하지 않은)
  const availableCerts = useMemo(
    () =>
      certifications.filter(
        (c) => !userCertifications.some((u) => u.certificationId === c.id)
      ),
    [certifications, userCertifications]
  );

  // 우선순위로 정렬된 추천 루트
  const sortedRoutes = useMemo(() => {
    return [...routes].sort((a, b) => a.priority - b.priority);
  }, [routes]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '쉬움';
      case 'medium':
        return '보통';
      case 'hard':
        return '어려움';
      default:
        return difficulty;
    }
  };

  const getRouteDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-purple-100 text-purple-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRouteDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '초급';
      case 'intermediate':
        return '중급';
      case 'advanced':
        return '고급';
      default:
        return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Award size={28} className="text-amber-600" />
            자격증 관리
          </h1>
          <p className="text-sm text-slate-600 mt-1">취득 자격증과 취득 루트를 확인하세요</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* 취득한 자격증 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={20} className="text-green-600" />
            <h2 className="text-lg font-bold text-slate-900">
              보유 자격증
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full ml-2 font-normal">
                {acquiredCerts.length}개
              </span>
            </h2>
          </div>

          {acquiredCerts.length === 0 ? (
            <div className="bg-white rounded-lg p-6 text-center border border-slate-200">
              <p className="text-slate-600 text-sm">아직 취득한 자격증이 없습니다.</p>
              <p className="text-slate-500 text-xs mt-2">아래 추천 루트를 따라 자격증을 취득해보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {acquiredCerts.map((cert) => {
                // 필기 자격증 (파란색): 산업기사들과 필기 시험
                const isWrittenTest = ['cert-7', 'cert-9', 'cert-10', 'cert-11', 'cert-12'].includes(cert.id);
                return (
                  <div
                    key={cert.id}
                    className={`bg-white rounded-lg p-4 border-2 shadow-sm ${
                      isWrittenTest
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-green-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{cert.name}</h3>
                        <p className="text-xs text-slate-600 mt-1">
                          발급기관: {cert.issuer}
                        </p>
                        {isWrittenTest && (
                          <p className="text-xs text-blue-700 font-semibold mt-1.5">
                            ✓ 필기 시험 합격
                          </p>
                        )}
                        <div className="mt-2 flex gap-2 flex-wrap">
                          <span className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded">
                            {cert.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded font-medium ${getDifficultyColor(
                            cert.difficulty
                          )}`}>
                            {getDifficultyLabel(cert.difficulty)}
                          </span>
                        </div>
                      </div>
                      <CheckCircle size={24} className={isWrittenTest ? "text-blue-600 flex-shrink-0" : "text-green-600 flex-shrink-0"} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 응시 가능한 자격증 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Target size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              응시 가능한 자격증
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full ml-2 font-normal">
                {availableCerts.length}개
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            {availableCerts.map((cert) => (
              <div
                key={cert.id}
                onClick={() =>
                  setExpandedCertId(expandedCertId === cert.id ? null : cert.id)
                }
                className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md hover:border-blue-300 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{cert.name}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {cert.issuer}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded font-medium ${getDifficultyColor(
                      cert.difficulty
                    )}`}>
                      {getDifficultyLabel(cert.difficulty)}
                    </div>
                  </div>
                </div>

                {/* 요약 정보 */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded">
                    <p className="text-slate-600">합격률</p>
                    <p className="font-bold text-slate-900">{cert.passingRate}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <p className="text-slate-600">응시료</p>
                    <p className="font-bold text-slate-900">{cert.examFee}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <p className="text-slate-600">분류</p>
                    <p className="font-bold text-slate-900">{cert.category}</p>
                  </div>
                </div>

                {/* 확장 콘텐츠 */}
                {expandedCertId === cert.id && (
                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 mb-2">관련 분야</h4>
                      <div className="flex flex-wrap gap-1">
                        {cert.relevantFields.map((field) => (
                          <span
                            key={field}
                            className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded"
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors">
                      응시 계획 추가
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 추천 자격증 루트 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-purple-600" />
            <h2 className="text-lg font-bold text-slate-900">
              추천 자격증 루트
              <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full ml-2 font-normal">
                {sortedRoutes.length}개
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {sortedRoutes.map((route, idx) => {
              const routeCerts = route.route
                .map((certId) => certifications.find((c) => c.id === certId))
                .filter(Boolean) as Certification[];

              return (
                <div
                  key={route.id}
                  onClick={() =>
                    setExpandedRouteId(expandedRouteId === route.id ? null : route.id)
                  }
                  className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg hover:border-purple-400 cursor-pointer transition-all"
                >
                  {/* Route Header */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full">
                            #{idx + 1}
                          </span>
                          <h3 className="font-bold text-slate-900 text-lg">
                            {route.title}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">
                          {route.description}
                        </p>
                      </div>
                      <div className={`text-xs px-3 py-1 rounded font-medium flex-shrink-0 ${getRouteDifficultyColor(
                        route.difficulty
                      )}`}>
                        {getRouteDifficultyLabel(route.difficulty)}
                      </div>
                    </div>

                    {/* 기본 정보 */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="bg-slate-50 p-2 rounded">
                        <p className="text-xs text-slate-600">예상 기간</p>
                        <p className="font-bold text-slate-900 text-sm">
                          {route.estimatedDuration}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded">
                        <p className="text-xs text-slate-600">자격증 수</p>
                        <p className="font-bold text-slate-900 text-sm">
                          {routeCerts.length}개
                        </p>
                      </div>
                    </div>

                    {/* 관련 분야 */}
                    <div className="mt-3">
                      <p className="text-xs text-slate-600 mb-1">관련 분야</p>
                      <div className="flex flex-wrap gap-1">
                        {route.targetSectors.map((sector) => (
                          <span
                            key={sector}
                            className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
                          >
                            {sector}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 확장 콘텐츠: 자격증 순서 */}
                  {expandedRouteId === route.id && (
                    <div className="bg-slate-50 p-4 border-t border-slate-200">
                      <h4 className="text-sm font-bold text-slate-900 mb-3">
                        학습 순서
                      </h4>
                      <div className="space-y-3">
                        {routeCerts.map((cert, certIdx) => {
                          const isAcquired = acquiredCerts.some(
                            (ac) => ac.id === cert.id
                          );

                          return (
                            <div key={cert.id} className="flex items-start gap-3">
                              {/* 순서 표시 */}
                              <div className="flex flex-col items-center gap-1">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                    isAcquired
                                      ? 'bg-green-600 text-white'
                                      : 'bg-slate-300 text-slate-700'
                                  }`}
                                >
                                  {certIdx + 1}
                                </div>
                                {certIdx < routeCerts.length - 1 && (
                                  <div className="w-1 h-6 bg-slate-300" />
                                )}
                              </div>

                              {/* 자격증 정보 */}
                              <div className="flex-1 py-2">
                                <p
                                  className={`font-bold ${
                                    isAcquired
                                      ? 'text-green-700 line-through'
                                      : 'text-slate-900'
                                  }`}
                                >
                                  {cert.name}
                                </p>
                                <p className="text-xs text-slate-600 mt-1">
                                  {cert.issuer} • {cert.category} •{' '}
                                  {getDifficultyLabel(cert.difficulty)}
                                </p>
                                {isAcquired && (
                                  <div className="mt-1 inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                                    <CheckCircle size={14} />
                                    취득 완료
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* 진행률 */}
                      <div className="mt-4 pt-4 border-t border-slate-300">
                        <p className="text-xs text-slate-600 mb-2">진행률</p>
                        <div className="w-full bg-slate-300 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${(
                                (acquiredCerts.filter((ac) =>
                                  routeCerts.some((rc) => rc.id === ac.id)
                                ).length /
                                  routeCerts.length) *
                                100
                              ).toFixed(0)}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-slate-600 mt-2">
                          {acquiredCerts.filter((ac) =>
                            routeCerts.some((rc) => rc.id === ac.id)
                          ).length}
                          /{routeCerts.length} 완료
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 팁 섹션 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-900 text-sm">💡 자격증 취득 팁</h4>
              <ul className="text-xs text-blue-800 mt-2 space-y-1">
                <li>• 기능사 → 산업기사 → 기사 → 기술사 순서로 단계적 진행</li>
                <li>• 같은 분야 자격증은 응시자격 및 과목면제 혜택이 있습니다</li>
                <li>• 회사별로 선호하는 자격증이 다르니 채용공고를 참고하세요</li>
                <li>• 취업 후에도 계속 자격증을 취득하는 것을 추천합니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
