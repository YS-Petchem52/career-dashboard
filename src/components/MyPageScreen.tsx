import React, { useState } from 'react';
import { ApplicationRecord, JobOpening, Company } from '../types';

interface MyPageScreenProps {
  applications: ApplicationRecord[];
  bookmarkedJobs: JobOpening[];
  followedCompanies: Company[];
  onSelectJob: (job: JobOpening) => void;
  onSelectCompany: (companyId: string) => void;
  onToggleBookmark: (jobId: string) => void;
  onToggleFollow: (companyId: string) => void;
}

export const MyPageScreen: React.FC<MyPageScreenProps> = ({
  applications,
  bookmarkedJobs,
  followedCompanies,
  onSelectJob,
  onSelectCompany,
  onToggleBookmark,
  onToggleFollow,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'bookmarks' | 'following'>('applications');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [meisterFilterOnly, setMeisterFilterOnly] = useState(true);

  return (
    <div id="mypage-screen-container" className="max-w-[1200px] mx-auto px-5 md:px-6 pt-4 pb-24">
      {/* Profile Card */}
      <section className="bg-[#ffffff] rounded-xl border border-[#c3c6d6]/40 p-5 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#003d9b] text-white flex items-center justify-center text-xl font-bold border-2 border-[#b2c5ff]">
            철현
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#041b3c]">임철현</h2>
              <span className="text-xs bg-[#006477] text-white px-2 py-0.5 rounded-full font-semibold">
                공정운전과 2학년
              </span>
            </div>
            <p className="text-xs text-[#434654] mt-0.5">
              여수석유화학고등학교 공정운전과 (2028년 2월 졸업예정)
            </p>
            <div className="flex gap-1.5 mt-2">
              <span className="text-[11px] bg-[#e8edff] text-[#003d9b] px-2 py-0.5 rounded font-medium">
                위험물산업기사
              </span>
              <span className="text-[11px] bg-[#e8edff] text-[#003d9b] px-2 py-0.5 rounded font-medium">
                가스기능사
              </span>
              <span className="text-[11px] bg-[#e8edff] text-[#003d9b] px-2 py-0.5 rounded font-medium">
                화학분석기능사
              </span>
            </div>
          </div>
        </div>

        {/* Alarm Settings Toggle in Profile */}
        <div className="flex flex-col gap-2 w-full md:w-auto bg-[#f9f9ff] p-3 rounded-lg border border-[#c3c6d6]/30 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#434654] font-medium">실시간 채용 공고 알림</span>
            <button
              onClick={() => setPushEnabled(!pushEnabled)}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                pushEnabled ? 'bg-[#003d9b]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  pushEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-[#434654] font-medium">마이스터고 추천 전형만 보기</span>
            <button
              onClick={() => setMeisterFilterOnly(!meisterFilterOnly)}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                meisterFilterOnly ? 'bg-[#006477]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  meisterFilterOnly ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Sub Tabs */}
      <div className="flex border-b border-[#c3c6d6]/50 mb-6 gap-2">
        <button
          onClick={() => setActiveSubTab('applications')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'applications'
              ? 'border-[#003d9b] text-[#003d9b]'
              : 'border-transparent text-[#737685] hover:text-[#041b3c]'
          }`}
        >
          지원 현황 ({applications.length})
        </button>

        <button
          onClick={() => setActiveSubTab('bookmarks')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'bookmarks'
              ? 'border-[#003d9b] text-[#003d9b]'
              : 'border-transparent text-[#737685] hover:text-[#041b3c]'
          }`}
        >
          스크랩한 공고 ({bookmarkedJobs.length})
        </button>

        <button
          onClick={() => setActiveSubTab('following')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'following'
              ? 'border-[#003d9b] text-[#003d9b]'
              : 'border-transparent text-[#737685] hover:text-[#041b3c]'
          }`}
        >
          관심 기업 ({followedCompanies.length})
        </button>
      </div>

      {/* Tab 1: Application Records Pipeline */}
      {activeSubTab === 'applications' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="bg-[#ffffff] rounded-xl p-8 text-center border border-[#c3c6d6]/30">
              <span className="material-symbols-outlined text-4xl text-[#737685] mb-2">
                assignment_late
              </span>
              <p className="text-sm font-semibold text-[#041b3c]">아직 지원한 공고가 없습니다.</p>
              <p className="text-xs text-[#737685] mt-1">
                추천 채용 공고를 둘러보고 간편하게 지원해보세요.
              </p>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="bg-[#ffffff] rounded-xl border border-[#c3c6d6]/40 p-4 md:p-5 shadow-xs"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded border border-[#c3c6d6]/60 p-1 flex items-center justify-center bg-[#f9f9ff]">
                      <img
                        src={app.companyLogo}
                        alt={app.companyName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#0052cc]">{app.companyName}</span>
                      <h3 className="font-bold text-sm md:text-base text-[#041b3c]">{app.jobTitle}</h3>
                    </div>
                  </div>
                  <span className="text-xs text-[#737685]">지원일: {app.appliedDate}</span>
                </div>

                {/* Status Pipeline Step Indicator */}
                <div className="mt-4 pt-3 border-t border-[#c3c6d6]/30">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-[#434654] font-medium">전형 단계:</span>
                    <span className="font-bold text-[#003d9b] bg-[#e8edff] px-2.5 py-0.5 rounded-full">
                      {app.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center text-[11px]">
                    {['서류접수', '서류합격', '인적성검사', '최종면접'].map((step, idx) => {
                      const currentIdx = ['서류접수', '서류합격', '인적성검사', '최종면접'].indexOf(
                        app.status
                      );
                      const isPassed = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div
                          key={step}
                          className={`p-2 rounded-lg font-medium transition-all ${
                            isCurrent
                              ? 'bg-[#003d9b] text-white font-bold shadow-xs'
                              : isPassed
                              ? 'bg-[#e8edff] text-[#003d9b]'
                              : 'bg-[#f1f3ff] text-[#737685]'
                          }`}
                        >
                          {step}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Bookmarked Jobs */}
      {activeSubTab === 'bookmarks' && (
        <div className="space-y-3">
          {bookmarkedJobs.length === 0 ? (
            <div className="bg-[#ffffff] rounded-xl p-8 text-center border border-[#c3c6d6]/30">
              <span className="material-symbols-outlined text-4xl text-[#737685] mb-2">
                bookmark_border
              </span>
              <p className="text-sm font-semibold text-[#041b3c]">스크랩한 채용공고가 없습니다.</p>
              <p className="text-xs text-[#737685] mt-1">
                관심 있는 공고의 북마크 아이콘을 눌러 저장해보세요.
              </p>
            </div>
          ) : (
            bookmarkedJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="bg-[#ffffff] rounded-xl border border-[#c3c6d6]/40 p-4 shadow-xs hover:border-[#003d9b] transition-all cursor-pointer flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded border border-[#c3c6d6]/60 p-1 flex items-center justify-center bg-white shrink-0">
                    <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#0052cc]">{job.companyName}</span>
                    <h3 className="font-bold text-sm text-[#041b3c]">{job.title}</h3>
                    <p className="text-xs text-[#737685] mt-0.5">{job.location} · {job.educationReq}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(job.id);
                  }}
                  className="text-[#003d9b] p-2 hover:bg-[#f1f3ff] rounded-full"
                >
                  <span className="material-symbols-outlined fill-1">bookmark</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Following Companies */}
      {activeSubTab === 'following' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {followedCompanies.length === 0 ? (
            <div className="col-span-2 bg-[#ffffff] rounded-xl p-8 text-center border border-[#c3c6d6]/30">
              <span className="material-symbols-outlined text-4xl text-[#737685] mb-2">
                corporate_fare
              </span>
              <p className="text-sm font-semibold text-[#041b3c]">팔로우한 기업이 없습니다.</p>
              <p className="text-xs text-[#737685] mt-1">
                기업 상세 페이지에서 팔로우 버튼을 눌러 채용 소식을 받아보세요.
              </p>
            </div>
          ) : (
            followedCompanies.map((comp) => (
              <div
                key={comp.id}
                className="bg-[#ffffff] rounded-xl border border-[#c3c6d6]/40 p-4 shadow-xs flex items-center justify-between"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => onSelectCompany(comp.id)}
                >
                  <div className="w-12 h-12 rounded-lg bg-[#f9f9ff] border border-[#c3c6d6]/50 p-1 flex items-center justify-center">
                    <img src={comp.logo} alt={comp.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#041b3c]">{comp.name}</h4>
                    <p className="text-xs text-[#737685]">{comp.industry}</p>
                    <p className="text-[11px] text-[#0052cc] mt-0.5">{comp.stats.avgSalary} / {comp.stats.shiftSystem}</p>
                  </div>
                </div>

                <button
                  onClick={() => onToggleFollow(comp.id)}
                  className="text-xs bg-[#003d9b] text-white px-3 py-1.5 rounded font-semibold hover:bg-[#ba1a1a] hover:before:content-['언팔로우'] transition-all"
                >
                  팔로잉
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
