import React from 'react';
import { Company, JobOpening } from '../types';

interface HomeScreenProps {
  companies: Company[];
  jobs: JobOpening[];
  onSelectCompany: (companyId: string) => void;
  onSelectJob: (job: JobOpening) => void;
  onQuickApply: (job: JobOpening) => void;
  onSearchFocus: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  companies,
  jobs,
  onSelectCompany,
  onSelectJob,
  onQuickApply,
  onSearchFocus,
  searchQuery,
  onSearchChange,
}) => {
  // Sort popular companies 1 to 5
  const popularCompanies = [...companies]
    .filter((c) => c.isPopularRank)
    .sort((a, b) => (a.isPopularRank || 0) - (b.isPopularRank || 0));

  // Recommended jobs for meister high school students
  const meisterJobs = jobs.filter((j) => j.isMeisterRecommended || j.tags.includes('#MeisterHighSchool') || j.educationReq.includes('고졸'));

  return (
    <div id="home-screen-container" className="max-w-[1200px] mx-auto px-5 md:px-6 pt-4 pb-24">
      {/* Search Bar Section */}
      <section className="mb-6">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#434654] text-[20px] pointer-events-none">
            search
          </span>
          <input
            id="home-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={onSearchFocus}
            placeholder="어떤 기업, 직무를 찾으시나요?"
            className="w-full bg-[#ffffff] border border-[#c3c6d6] rounded-full py-3.5 pl-12 pr-4 font-normal text-sm md:text-base text-[#041b3c] placeholder:text-[#737685] focus:outline-none focus:border-[#003d9b] focus:ring-1 focus:ring-[#003d9b] shadow-[0_2px_6px_rgba(0,0,0,0.02)] transition-all"
          />
        </div>
      </section>

      {/* Featured Companies Carousel */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-3.5">
          <h2 className="font-['Hanken_Grotesk'] text-xl md:text-[22px] font-bold text-[#041b3c]">
            주목할 만한 기업
          </h2>
          <span className="text-xs text-[#737685]">좌우로 스크롤하여 확인</span>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 pt-0.5">
          {companies.map((company) => (
            <div
              key={company.id}
              id={`featured-company-${company.id}`}
              onClick={() => onSelectCompany(company.id)}
              className="flex-none w-32 bg-[#ffffff] rounded-xl p-3 flex flex-col items-center justify-center border border-[#c3c6d6]/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,61,155,0.09)] hover:border-[#0052cc]/40 transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full bg-[#f1f3ff] mb-2 flex items-center justify-center overflow-hidden p-2 group-hover:scale-105 transition-transform">
                <img
                  src={company.logo}
                  alt={`${company.name} Logo`}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <span className="text-sm font-semibold text-[#041b3c] text-center line-clamp-1 w-full truncate group-hover:text-[#003d9b] transition-colors">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Grid: Weekly Popular + Meister Recommended Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Weekly Popular Companies */}
        <section className="md:col-span-5 lg:col-span-4">
          <div className="bg-[#ffffff] rounded-xl p-4 md:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#c3c6d6]/20">
            <h2 className="font-['Hanken_Grotesk'] text-lg md:text-xl font-bold mb-4 text-[#041b3c] flex items-center">
              <span className="material-symbols-outlined mr-2 text-[#003d9b] text-[22px]">trending_up</span>
              주간 인기 기업
            </h2>

            <ul className="flex flex-col gap-1">
              {popularCompanies.map((company, index) => {
                const rank = index + 1;
                return (
                  <li
                    key={company.id}
                    id={`popular-company-rank-${rank}`}
                    onClick={() => onSelectCompany(company.id)}
                    className="flex items-center p-2.5 hover:bg-[#f1f3ff] rounded-lg transition-colors cursor-pointer group"
                  >
                    <span
                      className={`font-['Hanken_Grotesk'] text-lg w-8 text-center font-bold ${
                        rank === 1 ? 'text-[#003d9b]' : 'text-[#434654]'
                      }`}
                    >
                      {rank}
                    </span>
                    <div className="ml-2 flex-1">
                      <p className="text-sm font-semibold text-[#041b3c] group-hover:text-[#003d9b] transition-colors">
                        {company.name}
                      </p>
                      <p className="text-xs text-[#434654] opacity-80 mt-0.5">
                        {company.industry}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[#c3c6d6] text-[20px] group-hover:text-[#003d9b] group-hover:translate-x-0.5 transition-all">
                      chevron_right
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Meister High School Info Tip Banner */}
          <div className="mt-4 bg-[#e8edff] rounded-xl p-4 border border-[#c3c6d6]/30 shadow-sm">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#003d9b] text-[22px] shrink-0 mt-0.5">
                verified
              </span>
              <div>
                <h4 className="font-bold text-sm text-[#003d9b] mb-1">
                  2026 여수산단 마이스터 취업가이드
                </h4>
                <p className="text-xs text-[#434654] leading-relaxed">
                  위험물기능사 및 가스기능사 자격증 소지자는 서류 전형 가산점이 부여됩니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Jobs for Petrochemical Meister High School */}
        <section className="md:col-span-7 lg:col-span-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-['Hanken_Grotesk'] text-lg md:text-xl font-bold text-[#041b3c]">
              석유화학 마이스터 추천 채용
            </h2>
            <span className="text-xs text-[#0052cc] font-semibold bg-[#e8edff] px-2.5 py-1 rounded-full">
              우대전형
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {meisterJobs.slice(0, 4).map((job) => (
              <div
                key={job.id}
                id={`recommended-job-${job.id}`}
                className="bg-[#ffffff] rounded-xl p-4 md:p-5 border border-[#c3c6d6]/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-[#0052cc]/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-3.5"
              >
                <div
                  className="flex-1 cursor-pointer w-full"
                  onClick={() => onSelectJob(job)}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-[#003d9b] bg-[#003d9b]/10 px-2 py-0.5 rounded">
                      Hiring
                    </span>
                    <span className="text-xs font-medium text-[#434654]">
                      {job.companyName}
                    </span>
                    <span className="text-[11px] text-[#006477] bg-[#afecff]/50 px-1.5 py-0.5 rounded font-medium">
                      {job.dDay}
                    </span>
                  </div>

                  <h3 className="font-['Hanken_Grotesk'] text-base md:text-lg font-bold text-[#041b3c] mb-1.5 hover:text-[#003d9b] transition-colors line-clamp-1">
                    {job.title}
                  </h3>

                  <div className="flex items-center text-[#434654] text-xs gap-3 opacity-90 flex-wrap">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#0052cc]">
                        location_on
                      </span>
                      {job.location}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#737685]"></span>
                    <span>{job.educationReq}</span>
                    {job.salaryGuide && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-[#737685]"></span>
                        <span className="text-[#003d9b] font-medium">{job.salaryGuide}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[#c3c6d6]/20">
                  <button
                    onClick={() => onSelectJob(job)}
                    className="text-xs text-[#0052cc] bg-[#f1f3ff] hover:bg-[#e8edff] px-3 py-2 rounded-lg font-semibold transition-colors"
                  >
                    상세보기
                  </button>
                  <button
                    onClick={() => onQuickApply(job)}
                    className="bg-[#003d9b] hover:bg-[#0052cc] text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer active:scale-95 shadow-sm"
                  >
                    지원하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
