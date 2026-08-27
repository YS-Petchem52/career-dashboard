import React, { useState, useMemo } from 'react';
import { Company, CompanyCharacteristics } from '../types';
import { ChevronRight, Filter } from 'lucide-react';

interface RecommendationScreenProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
}

type Sector = '정유' | '석화' | '가스' | '배터리' | '발전' | '반도체' | '기타';
type Characteristic = 'salary' | 'welfare' | 'workLifeBalance' | 'safety' | 'growth' | 'stability';

const SECTORS: { value: Sector; label: string }[] = [
  { value: '정유', label: '정유' },
  { value: '석화', label: '석화(석유화학)' },
  { value: '가스', label: '가스' },
  { value: '배터리', label: '배터리' },
  { value: '발전', label: '발전' },
  { value: '반도체', label: '반도체' },
  { value: '기타', label: '기타' },
];

const CHARACTERISTICS: { value: Characteristic; label: string; icon: string }[] = [
  { value: 'salary', label: '연봉', icon: '💰' },
  { value: 'welfare', label: '복지', icon: '🎁' },
  { value: 'workLifeBalance', label: '워라밸', icon: '⚖️' },
  { value: 'safety', label: '안전', icon: '🛡️' },
  { value: 'growth', label: '성장성', icon: '📈' },
  { value: 'stability', label: '안정성', icon: '🏢' },
];

const characteristicNames = {
  salary: '연봉',
  welfare: '복지',
  workLifeBalance: '워라밸',
  safety: '안전',
  growth: '성장성',
  stability: '안정성',
};

export default function RecommendationScreen({ companies, onSelectCompany }: RecommendationScreenProps) {
  const [selectedSectors, setSelectedSectors] = useState<Sector[]>([]);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<Characteristic[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const toggleSector = (sector: Sector) => {
    setSelectedSectors(prev =>
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
    );
  };

  const toggleCharacteristic = (char: Characteristic) => {
    setSelectedCharacteristics(prev =>
      prev.includes(char) ? prev.filter(c => c !== char) : [...prev, char]
    );
  };

  // 추천 기업 계산
  const recommendedCompanies = useMemo(() => {
    if (selectedSectors.length === 0 || selectedCharacteristics.length === 0) {
      return [];
    }

    return companies
      .filter(company => {
        // 선택된 분야에 속하는지 확인
        return selectedSectors.includes((company.sector as Sector) || '기타');
      })
      .map(company => {
        // 각 회사별 점수 계산
        let score = 0;
        let matchedCharacteristics = 0;

        selectedCharacteristics.forEach(char => {
          const characteristics = company.characteristics;
          if (characteristics && characteristics[char]) {
            score += characteristics[char];
            matchedCharacteristics++;
          }
        });

        return {
          company,
          score,
          matchedCharacteristics,
          avgScore: matchedCharacteristics > 0 ? score / matchedCharacteristics : 0,
        };
      })
      .sort((a, b) => b.avgScore - a.avgScore)
      .map(item => item.company);
  }, [companies, selectedSectors, selectedCharacteristics]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-24">
      {/* 헤더 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">🎯 나에게 맞는 기업 찾기</h1>
          <p className="text-gray-600 text-sm mt-1">분야와 중요한 조건을 선택해서 맞춤 추천을 받아보세요!</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* 분야 선택 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2 text-indigo-600" />
            분야 선택 (복수선택 가능)
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {SECTORS.map(sector => (
              <button
                key={sector.value}
                onClick={() => toggleSector(sector.value)}
                className={`p-3 rounded-lg font-medium transition-all border-2 ${
                  selectedSectors.includes(sector.value)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-indigo-400'
                }`}
              >
                {sector.label}
              </button>
            ))}
          </div>
        </div>

        {/* 특성 선택 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            💡 중요하게 생각하는 조건 선택 (복수선택 가능)
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {CHARACTERISTICS.map(char => (
              <button
                key={char.value}
                onClick={() => toggleCharacteristic(char.value)}
                className={`p-3 rounded-lg font-medium transition-all border-2 flex items-center justify-center ${
                  selectedCharacteristics.includes(char.value)
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-green-400'
                }`}
              >
                <span className="mr-2 text-lg">{char.icon}</span>
                {char.label}
              </button>
            ))}
          </div>
        </div>

        {/* 추천 버튼 */}
        {selectedSectors.length > 0 && selectedCharacteristics.length > 0 && (
          <button
            onClick={() => setShowRecommendations(true)}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all text-lg"
          >
            맞춤 기업 추천받기
          </button>
        )}

        {selectedSectors.length === 0 || selectedCharacteristics.length === 0 ? (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-700 text-sm font-medium">
              💡 분야와 중요한 조건을 각각 선택해주세요!
            </p>
          </div>
        ) : null}

        {/* 추천 결과 */}
        {showRecommendations && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                ✨ 당신에게 추천하는 기업 ({recommendedCompanies.length})
              </h2>

              {recommendedCompanies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>선택한 조건에 맞는 기업이 없습니다.</p>
                  <p className="text-sm mt-2">다른 조건을 선택해 주세요.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendedCompanies.map((company, index) => {
                    const characteristics = company.characteristics;
                    const scores = selectedCharacteristics
                      .map(char => ({
                        name: characteristicNames[char],
                        score: characteristics?.[char] || 0,
                      }))
                      .sort((a, b) => b.score - a.score);

                    return (
                      <div
                        key={company.id}
                        onClick={() => onSelectCompany(company)}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-md transition-all p-4 rounded-lg border-l-4 border-indigo-600 cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className="text-sm font-bold bg-indigo-600 text-white px-2 py-1 rounded-full mr-2">
                                #{index + 1}
                              </span>
                              <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded ml-2">
                                {company.sector || '기타'}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {company.industryDetail}
                            </p>

                            {/* 점수 표시 */}
                            <div className="space-y-2">
                              {scores.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="flex items-center">
                                  <span className="text-xs font-semibold text-gray-600 w-12">{item.name}</span>
                                  <div className="flex-1 h-2 bg-gray-300 rounded-full mx-2 overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all"
                                      style={{ width: `${(item.score / 5) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-bold text-indigo-600 w-6 text-right">{item.score}/5</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 mt-1 ml-2 flex-shrink-0" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 초기화 버튼 */}
        {(selectedSectors.length > 0 || selectedCharacteristics.length > 0) && (
          <button
            onClick={() => {
              setSelectedSectors([]);
              setSelectedCharacteristics([]);
              setShowRecommendations(false);
            }}
            className="w-full bg-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-300 transition-all"
          >
            초기화
          </button>
        )}
      </div>
    </div>
  );
}
