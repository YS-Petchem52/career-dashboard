import React from 'react';
import { JobOpening } from '../types';

interface JobDetailModalProps {
  job: JobOpening | null;
  onClose: () => void;
  onApply: (job: JobOpening) => void;
  onViewCompany: (companyId: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (jobId: string) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  onApply,
  onViewCompany,
  isBookmarked,
  onToggleBookmark,
}) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative bg-[#ffffff] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 animate-in zoom-in-95 duration-150 flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#ffffff] border-b border-[#c3c6d6]/40 p-4 md:p-5 flex justify-between items-center z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f9f9ff] border border-[#c3c6d6]/60 p-1 flex items-center justify-center">
              <img
                src={job.companyLogo}
                alt={`${job.companyName} Logo`}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <button
                onClick={() => {
                  onViewCompany(job.companyId);
                  onClose();
                }}
                className="text-xs font-semibold text-[#0052cc] hover:underline flex items-center gap-1"
              >
                {job.companyName}
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </button>
              <span className="text-[11px] text-[#737685]">{job.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleBookmark(job.id)}
              className={`p-2 rounded-full hover:bg-[#f1f3ff] transition-colors ${
                isBookmarked ? 'text-[#003d9b]' : 'text-[#737685]'
              }`}
              title={isBookmarked ? '북마크 해제' : '북마크 저장'}
            >
              <span className={`material-symbols-outlined ${isBookmarked ? 'fill-1' : ''}`}>
                {isBookmarked ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#737685] hover:text-[#041b3c] hover:bg-[#f1f3ff] rounded-full"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 space-y-6 flex-1">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-[#004b59] bg-[#afecff]/50 px-2 py-0.5 rounded">
                {job.dDay}
              </span>
              <span className="text-xs font-semibold text-[#003d9b] bg-[#e8edff] px-2 py-0.5 rounded">
                {job.educationReq}
              </span>
              {job.isMeisterRecommended && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  마이스터고 추천
                </span>
              )}
            </div>

            <h2 className="font-['Hanken_Grotesk'] text-xl md:text-2xl font-bold text-[#041b3c] mb-2">
              {job.title}
            </h2>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {job.tags.map((t, idx) => (
                <span key={idx} className="text-xs text-[#0052cc] bg-[#0052cc]/5 px-2 py-0.5 rounded font-medium">
                  {t}
                </span>
              ))}
            </div>

            {/* Quick Specs Card */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#f1f3ff] p-4 rounded-xl text-xs">
              <div>
                <span className="text-[#737685] block mb-0.5">급여 안내</span>
                <strong className="text-[#041b3c] font-semibold">{job.salaryGuide || '회사 내규에 따름'}</strong>
              </div>
              <div>
                <span className="text-[#737685] block mb-0.5">근무 형태</span>
                <strong className="text-[#041b3c] font-semibold">{job.workSchedule || '교대 근무'}</strong>
              </div>
              <div>
                <span className="text-[#737685] block mb-0.5">근무 지역</span>
                <strong className="text-[#041b3c] font-semibold">{job.location}</strong>
              </div>
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div>
              <h3 className="font-bold text-sm text-[#041b3c] mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#003d9b] text-[18px]">info</span>
                포지션 소개
              </h3>
              <p className="text-sm text-[#434654] leading-relaxed bg-[#ffffff] border border-[#c3c6d6]/40 p-3.5 rounded-xl">
                {job.description}
              </p>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="font-bold text-sm text-[#041b3c] mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#003d9b] text-[18px]">checklist</span>
                주요 업무 (Responsibilities)
              </h3>
              <ul className="space-y-1.5 bg-[#f9f9ff] p-4 rounded-xl border border-[#c3c6d6]/30">
                {job.responsibilities.map((item, idx) => (
                  <li key={idx} className="text-xs md:text-sm text-[#434654] flex items-start gap-2">
                    <span className="text-[#0052cc] font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements & Preferred */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {job.requirements && (
              <div>
                <h3 className="font-bold text-sm text-[#041b3c] mb-2">지원 자격 (Requirements)</h3>
                <ul className="space-y-1 text-xs text-[#434654] bg-[#f9f9ff] p-3.5 rounded-xl border border-[#c3c6d6]/30">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#003d9b]">✓</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.preferred && (
              <div>
                <h3 className="font-bold text-sm text-[#041b3c] mb-2">우대 사항 (Preferred)</h3>
                <ul className="space-y-1 text-xs text-[#434654] bg-[#e8edff]/50 p-3.5 rounded-xl border border-[#c3c6d6]/30">
                  {job.preferred.map((pref, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600">★</span>
                      <span>{pref}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-[#ffffff] border-t border-[#c3c6d6]/40 p-4 md:p-5 flex items-center justify-between gap-3 z-20">
          <button
            onClick={() => {
              onViewCompany(job.companyId);
              onClose();
            }}
            className="px-4 py-2.5 rounded-lg border border-[#c3c6d6] text-xs font-semibold text-[#434654] hover:bg-[#f1f3ff] transition-colors"
          >
            기업 정보 보기
          </button>

          <button
            id="modal-direct-apply-btn"
            onClick={() => {
              onApply(job);
              onClose();
            }}
            className="flex-1 bg-[#003d9b] hover:bg-[#0052cc] text-white py-2.5 px-6 rounded-lg text-sm font-bold shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            간편 입사지원하기
          </button>
        </div>
      </div>
    </div>
  );
};
