import React, { useState } from 'react';
import { Company, JobOpening } from '../types';

interface CompanyDetailScreenProps {
  company: Company;
  allCompanies: Company[];
  onSelectCompany: (companyId: string) => void;
  jobs: JobOpening[];
  onSelectJob: (job: JobOpening) => void;
  onQuickApply: (job: JobOpening) => void;
  onViewAllJobsForCompany: (companyName: string) => void;
  onBack: () => void;
  isFollowed: boolean;
  onToggleFollow: (companyId: string) => void;
}

export const CompanyDetailScreen: React.FC<CompanyDetailScreenProps> = ({
  company,
  allCompanies,
  onSelectCompany,
  jobs,
  onSelectJob,
  onQuickApply,
  onViewAllJobsForCompany,
  onBack,
  isFollowed,
  onToggleFollow,
}) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewRole, setNewReviewRole] = useState('공정운전원');
  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
  const [reviewsList, setReviewsList] = useState(company.reviews);

  // Openings belonging to this company
  const companyJobs = jobs.filter((j) => j.companyId === company.id);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle.trim() || !newReviewText.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      rating: newReviewRating,
      date: '2026.08.26',
      role: newReviewRole,
      title: newReviewTitle,
      content: newReviewText,
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewTitle('');
    setNewReviewText('');
    setShowWriteReviewModal(false);
  };

  return (
    <div id="company-detail-container" className="max-w-[1200px] mx-auto px-5 md:px-6 pt-4 pb-24">
      {/* Quick Company Switcher Bar */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-3 mb-4 border-b border-[#c3c6d6]/30">
        <span className="text-xs font-semibold text-[#737685] shrink-0 mr-1">다른 기업 보기:</span>
        {allCompanies.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCompany(c.id)}
            className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
              c.id === company.id
                ? 'bg-[#003d9b] text-white font-bold'
                : 'bg-[#f1f3ff] text-[#434654] hover:bg-[#e8edff]'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Company Header Section */}
      <section
        id="company-header-hero"
        className="bg-[#ffffff] rounded-xl shadow-sm border border-[#c3c6d6]/30 p-4 md:p-6 mb-6 flex flex-col md:flex-row items-start md:items-center gap-4 relative overflow-hidden"
      >
        {/* Background ambient pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#dae2ff]/30 to-transparent pointer-events-none" />

        <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-[#f9f9ff] shrink-0 border border-[#c3c6d6]/50 p-2 overflow-hidden relative z-10 shadow-sm flex items-center justify-center">
          <img
            src={company.logo}
            alt={`${company.name} Logo`}
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex-grow z-10">
          <h2 className="font-['Hanken_Grotesk'] text-2xl md:text-3xl font-bold text-[#041b3c] mb-1">
            {company.name}
          </h2>
          <p className="text-sm md:text-base text-[#434654] mb-2 font-normal">
            {company.industryDetail}
          </p>
          <div className="flex flex-wrap gap-2">
            {company.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-[#dae2ff]/40 text-[#003d9b] text-xs font-semibold rounded-full"
              >
                {tag}
              </span>
            ))}
            <span className="px-3 py-1 bg-[#f1f3ff] text-[#434654] text-xs font-medium rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              {company.location}
            </span>
          </div>
        </div>

        <button
          id="company-follow-btn"
          onClick={() => onToggleFollow(company.id)}
          className={`mt-3 md:mt-0 z-10 px-5 py-2 border rounded font-semibold text-xs md:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
            isFollowed
              ? 'bg-[#003d9b] text-white border-[#003d9b]'
              : 'border-[#003d9b] text-[#003d9b] bg-[#ffffff] hover:bg-[#0052cc]/10'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isFollowed ? 'check' : 'add'}
          </span>
          {isFollowed ? '팔로잉' : '팔로우'}
        </button>
      </section>

      {/* Main Content Layout (70% Content, 30% Sidebar) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Overview, Benefits, Reviews */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Overview Bento Grid */}
          <section id="company-overview-section">
            <h3 className="font-['Hanken_Grotesk'] text-lg md:text-xl font-bold text-[#041b3c] mb-3">
              기업 개요
            </h3>

            <div className="bg-[#ffffff] border border-[#c3c6d6]/30 rounded-xl p-4 md:p-5 mb-3 shadow-xs">
              <p className="text-sm md:text-base text-[#434654] leading-relaxed">
                {company.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Stat 1: 사원수 */}
              <div className="bg-[#ffffff] border border-[#c3c6d6]/30 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center text-center shadow-xs">
                <span className="material-symbols-outlined text-[#003d9b] mb-1.5 text-2xl md:text-3xl">
                  groups
                </span>
                <span className="text-xs text-[#737685]">사원수</span>
                <span className="text-sm md:text-base text-[#041b3c] font-bold mt-0.5">
                  {company.stats.employees}
                </span>
              </div>

              {/* Stat 2: 평균 연봉 */}
              <div className="bg-[#ffffff] border border-[#c3c6d6]/30 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center text-center shadow-xs">
                <span className="material-symbols-outlined text-[#003d9b] mb-1.5 text-2xl md:text-3xl">
                  payments
                </span>
                <span className="text-xs text-[#737685]">평균 연봉</span>
                <span className="text-sm md:text-base text-[#041b3c] font-bold mt-0.5">
                  {company.stats.avgSalary}
                </span>
              </div>

              {/* Stat 3: 설립일 */}
              <div className="bg-[#ffffff] border border-[#c3c6d6]/30 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center text-center shadow-xs">
                <span className="material-symbols-outlined text-[#003d9b] mb-1.5 text-2xl md:text-3xl">
                  calendar_month
                </span>
                <span className="text-xs text-[#737685]">설립일</span>
                <span className="text-sm md:text-base text-[#041b3c] font-bold mt-0.5">
                  {company.stats.establishedYear}
                </span>
              </div>

              {/* Stat 4: 근무 형태 */}
              <div className="bg-[#ffffff] border border-[#c3c6d6]/30 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center text-center shadow-xs">
                <span className="material-symbols-outlined text-[#003d9b] mb-1.5 text-2xl md:text-3xl">
                  schedule
                </span>
                <span className="text-xs text-[#737685]">근무 형태</span>
                <span className="text-sm md:text-base text-[#041b3c] font-bold mt-0.5">
                  {company.stats.shiftSystem}
                </span>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section id="company-benefits-section">
            <h3 className="font-['Hanken_Grotesk'] text-lg md:text-xl font-bold text-[#041b3c] mb-3">
              복리후생
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {company.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3.5 bg-[#ffffff] p-4 rounded-xl border border-[#c3c6d6]/30 shadow-xs"
                >
                  <div className="bg-[#e8edff] w-10 h-10 flex items-center justify-center rounded-full shrink-0 text-[#003d9b]">
                    <span className="material-symbols-outlined text-[20px]">
                      {benefit.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#041b3c]">{benefit.title}</h4>
                    <p className="text-xs text-[#434654] mt-1 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Employee Reviews Section */}
          <section id="company-reviews-section">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-['Hanken_Grotesk'] text-lg md:text-xl font-bold text-[#041b3c]">
                현직자 리뷰
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowWriteReviewModal(true)}
                  className="text-xs font-semibold text-[#003d9b] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  리뷰 작성
                </button>
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="text-xs font-semibold text-[#0052cc] hover:underline"
                >
                  {showAllReviews ? '접기' : '더보기'}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {(showAllReviews ? reviewsList : reviewsList.slice(0, 2)).map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[#ffffff] border border-[#c3c6d6]/30 rounded-xl p-4 md:p-5 shadow-xs"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => {
                        if (star <= Math.floor(rev.rating)) {
                          return (
                            <span
                              key={star}
                              className="material-symbols-outlined fill-1 text-[16px] text-amber-500"
                            >
                              star
                            </span>
                          );
                        } else if (star - rev.rating < 1) {
                          return (
                            <span
                              key={star}
                              className="material-symbols-outlined text-[16px] text-amber-500"
                            >
                              star_half
                            </span>
                          );
                        } else {
                          return (
                            <span
                              key={star}
                              className="material-symbols-outlined text-[16px] text-amber-500"
                            >
                              star_border
                            </span>
                          );
                        }
                      })}
                    </div>
                    <span className="text-xs text-[#737685]">
                      {rev.date} · {rev.role}
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm md:text-base text-[#041b3c] mb-1">
                    {rev.title}
                  </h4>
                  <p className="text-xs md:text-sm text-[#434654] leading-relaxed">
                    {rev.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Openings Sidebar */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <section className="bg-[#ffffff] rounded-xl shadow-[0px_8px_24px_rgba(0,0,0,0.08)] border border-[#c3c6d6]/30 p-4 md:p-5 sticky top-[88px]">
            <div className="flex justify-between items-center mb-3.5">
              <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#041b3c]">
                채용 중인 포지션
              </h3>
              <span className="text-xs font-semibold text-[#003d9b] bg-[#e8edff] px-2 py-0.5 rounded-full">
                {companyJobs.length}건
              </span>
            </div>

            <div className="space-y-3">
              {companyJobs.map((job) => {
                const isClosed = job.status === 'closed';
                return (
                  <div
                    key={job.id}
                    onClick={() => !isClosed && onSelectJob(job)}
                    className={`border border-[#c3c6d6]/50 rounded-lg p-3.5 hover:border-[#003d9b] transition-all bg-[#f9f9ff] ${
                      isClosed ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-xs group'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-sm ${
                          isClosed
                            ? 'bg-[#e1e2e4] text-[#444749]'
                            : 'bg-[#004b59] text-white'
                        }`}
                      >
                        {isClosed ? '마감' : '채용중'}
                      </span>
                      <span className="text-xs text-[#737685] font-medium">{job.dDay}</span>
                    </div>

                    <h4 className="font-semibold text-sm text-[#041b3c] group-hover:text-[#003d9b] transition-colors leading-snug">
                      {job.title}
                    </h4>

                    <p className="text-xs text-[#434654] mt-1">
                      {job.educationReq} · {job.location}
                    </p>

                    {!isClosed && (
                      <div className="mt-2 pt-2 border-t border-[#c3c6d6]/20 flex justify-between items-center">
                        <span className="text-[11px] text-[#0052cc] font-medium">상세보기</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickApply(job);
                          }}
                          className="bg-[#003d9b] hover:bg-[#0052cc] text-white text-xs px-2.5 py-1 rounded font-semibold transition-colors"
                        >
                          지원하기
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onViewAllJobsForCompany(company.name)}
              className="w-full mt-4 py-2.5 text-center bg-[#e8edff] border border-[#c3c6d6]/50 rounded-lg text-xs md:text-sm font-semibold text-[#003d9b] hover:bg-[#d7e2ff] transition-colors cursor-pointer"
            >
              전체 채용공고 보기
            </button>
          </section>
        </div>
      </div>

      {/* Write Review Modal */}
      {showWriteReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowWriteReviewModal(false)}
          />
          <div className="bg-[#ffffff] rounded-2xl max-w-md w-full p-6 relative z-10 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-[#041b3c]">
                {company.name} 현직자/동문 리뷰 등록
              </h3>
              <button
                onClick={() => setShowWriteReviewModal(false)}
                className="text-[#737685] hover:text-[#041b3c]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#434654] mb-1">
                  직무 / 부서
                </label>
                <input
                  type="text"
                  value={newReviewRole}
                  onChange={(e) => setNewReviewRole(e.target.value)}
                  className="w-full border border-[#c3c6d6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#003d9b]"
                  placeholder="예: 공정운전원, 설비보전팀"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434654] mb-1">
                  평점 (1 ~ 5점)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className="cursor-pointer"
                    >
                      <span
                        className={`material-symbols-outlined text-2xl ${
                          star <= newReviewRating ? 'fill-1 text-amber-500' : 'text-gray-300'
                        }`}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434654] mb-1">
                  한 줄 요약 제목
                </label>
                <input
                  type="text"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  className="w-full border border-[#c3c6d6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#003d9b]"
                  placeholder="예: 복지와 급여 만족도가 높습니다"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434654] mb-1">
                  솔직한 후기 내용
                </label>
                <textarea
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  rows={4}
                  className="w-full border border-[#c3c6d6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#003d9b]"
                  placeholder="근무 환경, 기숙사, 교대 근무, 사내 분위기 등을 작성해주세요."
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowWriteReviewModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#737685] bg-[#f1f3ff] rounded-lg hover:bg-[#e8edff]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#003d9b] hover:bg-[#0052cc] rounded-lg shadow-sm"
                >
                  리뷰 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
