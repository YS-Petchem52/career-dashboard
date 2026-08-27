import React, { useState, useMemo } from 'react';
import { JobOpening } from '../types';

interface SearchScreenProps {
  jobs: JobOpening[];
  onSelectJob: (job: JobOpening) => void;
  onQuickApply: (job: JobOpening) => void;
  bookmarkedJobIds: string[];
  onToggleBookmark: (jobId: string) => void;
  initialCategory?: string;
  initialQuery?: string;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  jobs,
  onSelectJob,
  onQuickApply,
  bookmarkedJobIds,
  onToggleBookmark,
  initialCategory = '전체',
  initialQuery = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [selectedSalary, setSelectedSalary] = useState<string>('전체');
  const [selectedLocation, setSelectedLocation] = useState<string>('전체');
  const [selectedCareer, setSelectedCareer] = useState<string>('전체');

  // Filter categories matching the screen + industrial fields
  const categories = [
    '전체',
    '공정/생산',
    '기계/정비',
    '전기/계장',
    '안전/환경',
    '품질/분석',
    '개발',
    '디자인',
    '기획·전략',
    '마케팅',
    '영업',
  ];

  // Filtered jobs logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Category match
      if (selectedCategory !== '전체') {
        if (selectedCategory === '개발' && job.category !== 'dev') return false;
        if (selectedCategory === '디자인' && job.category !== 'design') return false;
        if (selectedCategory === '기획·전략' && job.category !== 'strategy') return false;
        if (selectedCategory === '공정/생산' && job.category !== 'process') return false;
        if (selectedCategory === '기계/정비' && job.category !== 'maintenance') return false;
        if (selectedCategory === '전기/계장' && job.category !== 'electrical') return false;
        if (selectedCategory === '안전/환경' && job.category !== 'safety') return false;
      }

      // Keyword match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query) || (job.koreanTitle && job.koreanTitle.toLowerCase().includes(query));
        const matchesCompany = job.companyName.toLowerCase().includes(query);
        const matchesTags = job.tags.some((t) => t.toLowerCase().includes(query));
        const matchesLocation = job.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany && !matchesTags && !matchesLocation) {
          return false;
        }
      }

      // Location match
      if (selectedLocation !== '전체') {
        if (selectedLocation === '여수' && !job.location.includes('여수') && !job.location.includes('Yeosu')) return false;
        if (selectedLocation === '광양/포항' && !job.location.includes('광양') && !job.location.includes('포항') && !job.location.includes('Gwangyang')) return false;
        if (selectedLocation === '청주/오창' && !job.location.includes('청주') && !job.location.includes('오창')) return false;
      }

      // Career match
      if (selectedCareer !== '전체') {
        if (selectedCareer === '고졸 신입' && !job.educationReq.includes('고졸')) return false;
        if (selectedCareer === '경력' && !job.educationReq.includes('경력')) return false;
      }

      // Salary filter
      if (selectedSalary !== '전체') {
        if (selectedSalary === '5,000만 이상' && (!job.salaryGuide || (!job.salaryGuide.includes('5,') && !job.salaryGuide.includes('6,') && !job.salaryGuide.includes('7,') && !job.salaryGuide.includes('8,')))) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, selectedCategory, searchQuery, selectedLocation, selectedCareer, selectedSalary]);

  return (
    <div id="search-screen-container" className="max-w-[1200px] mx-auto px-5 md:px-6 pt-4 pb-24">
      {/* Search Input Filter */}
      <div className="mb-4">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#434654] text-[20px]">
            search
          </span>
          <input
            id="search-page-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="기업명, 직무명, 태그(#YeosuPetro) 검색"
            className="w-full bg-[#ffffff] border border-[#c3c6d6] rounded-full py-2.5 pl-11 pr-10 text-sm text-[#041b3c] focus:outline-none focus:border-[#003d9b] focus:ring-1 focus:ring-[#003d9b] shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737685] hover:text-[#041b3c] p-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills and Dropdown Filters */}
      <section className="mb-6 sticky top-16 bg-[#f9f9ff] z-30 py-2">
        {/* Main Categories Pills */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-3 pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-semibold text-sm px-4 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#003d9b] text-white shadow-xs'
                    : 'bg-[#e8edff] text-[#041b3c] border border-[#c3c6d6]/60 hover:bg-[#d7e2ff]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Sub Filters with Dropdowns */}
        <div className="flex gap-2 flex-wrap items-center">
          {/* Salary filter */}
          <div className="relative">
            <select
              value={selectedSalary}
              onChange={(e) => setSelectedSalary(e.target.value)}
              className="appearance-none bg-[#ffffff] border border-[#c3c6d6] rounded px-3 py-1.5 pr-7 text-xs font-medium text-[#434654] hover:border-[#003d9b] focus:outline-none cursor-pointer"
            >
              <option value="전체">연봉: 전체</option>
              <option value="5,000만 이상">5,000만원 이상</option>
              <option value="6,000만 이상">6,000만원 이상</option>
            </select>
            <span className="material-symbols-outlined text-[16px] text-[#737685] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Location filter */}
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="appearance-none bg-[#ffffff] border border-[#c3c6d6] rounded px-3 py-1.5 pr-7 text-xs font-medium text-[#434654] hover:border-[#003d9b] focus:outline-none cursor-pointer"
            >
              <option value="전체">지역: 전체</option>
              <option value="여수">전남 여수</option>
              <option value="광양/포항">광양 / 포항</option>
              <option value="청주/오창">충북 청주/오창</option>
            </select>
            <span className="material-symbols-outlined text-[16px] text-[#737685] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Career filter */}
          <div className="relative">
            <select
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="appearance-none bg-[#ffffff] border border-[#c3c6d6] rounded px-3 py-1.5 pr-7 text-xs font-medium text-[#434654] hover:border-[#003d9b] focus:outline-none cursor-pointer"
            >
              <option value="전체">경력: 전체</option>
              <option value="고졸 신입">고졸 신입</option>
              <option value="경력">경력직</option>
            </select>
            <span className="material-symbols-outlined text-[16px] text-[#737685] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Reset filters if any active */}
          {(selectedCategory !== '전체' || selectedSalary !== '전체' || selectedLocation !== '전체' || selectedCareer !== '전체' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('전체');
                setSelectedSalary('전체');
                setSelectedLocation('전체');
                setSelectedCareer('전체');
                setSearchQuery('');
              }}
              className="text-xs text-[#ba1a1a] hover:underline flex items-center gap-0.5 ml-1 py-1"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              초기화
            </button>
          )}
        </div>
      </section>

      {/* Result Count */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs text-[#737685]">
          총 <strong className="text-[#003d9b] font-bold">{filteredJobs.length}</strong>개의 채용공고
        </span>
      </div>

      {/* Job List */}
      <div className="flex flex-col gap-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-[#ffffff] rounded-xl p-10 text-center border border-[#c3c6d6]/40">
            <span className="material-symbols-outlined text-4xl text-[#737685] mb-2">
              search_off
            </span>
            <p className="text-sm font-semibold text-[#041b3c] mb-1">
              선택한 조건에 맞는 채용공고가 없습니다.
            </p>
            <p className="text-xs text-[#737685] mb-4">
              필터 조건을 변경하거나 검색어를 다시 입력해보세요.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('전체');
                setSelectedSalary('전체');
                setSelectedLocation('전체');
                setSelectedCareer('전체');
                setSearchQuery('');
              }}
              className="bg-[#003d9b] text-white text-xs px-4 py-2 rounded-lg font-semibold"
            >
              전체 공고 보기
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isBookmarked = bookmarkedJobIds.includes(job.id);
            return (
              <article
                key={job.id}
                id={`job-card-${job.id}`}
                className="bg-[#ffffff] rounded-[8px] border border-[#DFE1E6] p-4 md:p-5 flex flex-col gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all cursor-pointer group"
                onClick={() => onSelectJob(job)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded object-cover border border-[#c3c6d6]/60 p-1 flex items-center justify-center bg-white shrink-0">
                      <img
                        className="w-full h-full object-contain"
                        alt={`${job.companyName} Logo`}
                        src={job.companyLogo}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-[#434654] font-medium mb-0.5">
                        {job.companyName}
                      </p>
                      <h2 className="font-['Hanken_Grotesk'] text-base md:text-lg font-bold text-[#041b3c] group-hover:text-[#003d9b] transition-colors leading-snug">
                        {job.title}
                      </h2>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(job.id);
                    }}
                    className={`p-1 rounded hover:bg-[#f1f3ff] transition-colors ${
                      isBookmarked ? 'text-[#003d9b]' : 'text-[#737685] hover:text-[#003d9b]'
                    }`}
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark job'}
                  >
                    <span className={`material-symbols-outlined ${isBookmarked ? 'fill-1' : ''}`}>
                      {isBookmarked ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {job.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#0052cc]/5 text-[#0052cc] text-xs font-semibold px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {job.salaryGuide && (
                    <span className="bg-[#e8edff] text-[#003d9b] text-xs font-medium px-2 py-0.5 rounded">
                      {job.salaryGuide}
                    </span>
                  )}
                </div>

                {/* Footer divider and info */}
                <div className="flex justify-between items-center mt-2 pt-3 border-t border-[#dee0e2]">
                  <p className="text-xs text-[#434654] opacity-80 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {job.location}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickApply(job);
                      }}
                      className="text-xs font-semibold text-[#003d9b] bg-[#f1f3ff] hover:bg-[#e8edff] px-2.5 py-1 rounded transition-colors"
                    >
                      지원하기
                    </button>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded ${
                        job.status === 'closed'
                          ? 'bg-[#e1e2e4] text-[#444749]'
                          : job.dDay === 'Ongoing' || job.dDay === '상시채용'
                          ? 'bg-[#d7e2ff] text-[#041b3c]'
                          : 'bg-[#004b59] text-white'
                      }`}
                    >
                      {job.dDay}
                    </span>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
