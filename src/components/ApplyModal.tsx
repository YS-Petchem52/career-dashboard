import React, { useState } from 'react';
import { JobOpening } from '../types';

interface ApplyModalProps {
  job: JobOpening | null;
  onClose: () => void;
  onSubmitApplication: (job: JobOpening, applicantDetails: { name: string; school: string; phone: string; certs: string[]; note: string }) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ job, onClose, onSubmitApplication }) => {
  if (!job) return null;

  const [applicantName, setApplicantName] = useState('김석유');
  const [schoolName, setSchoolName] = useState('여수석유화학고등학교 (공정운전과 3학년)');
  const [phone, setPhone] = useState('010-8254-1053');
  const [selectedCerts, setSelectedCerts] = useState<string[]>([
    '위험물산업기사',
    '가스기능사',
    '화학분석기능사',
  ]);
  const [coverNote, setCoverNote] = useState(
    '여수석유화학고등학교에서 3년간 배운 석유화학 DCS 공정 운전 실습 경험과 자격증 역량을 바탕으로 안전 최우선 운전원이 되겠습니다.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const availableCerts = [
    '위험물산업기사',
    '가스기능사',
    '화학분석기능사',
    '산업안전기능사',
    '전기기능사',
    '기계정비기능사',
    '에너지관리기능사',
  ];

  const handleToggleCert = (cert: string) => {
    if (selectedCerts.includes(cert)) {
      setSelectedCerts(selectedCerts.filter((c) => c !== cert));
    } else {
      setSelectedCerts([...selectedCerts, cert]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onSubmitApplication(job, {
        name: applicantName,
        school: schoolName,
        phone,
        certs: selectedCerts,
        note: coverNote,
      });
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-[#ffffff] rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-150">
        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-[#041b3c] mb-1">지원이 완료되었습니다!</h3>
            <p className="text-sm text-[#434654] mb-2">
              {job.companyName} - {job.title}
            </p>
            <p className="text-xs text-[#737685]">
              [마이페이지] &gt; [지원 현황]에서 서류 전형 결과를 실시간 확인할 수 있습니다.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#c3c6d6]/40">
              <div>
                <span className="text-xs font-semibold text-[#0052cc]">{job.companyName}</span>
                <h3 className="font-bold text-lg text-[#041b3c]">{job.title} 간편 지원</h3>
              </div>
              <button onClick={onClose} className="text-[#737685] hover:text-[#041b3c]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#434654] mb-1">
                  지원자 성명
                </label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full border border-[#c3c6d6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#003d9b]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434654] mb-1">
                  출신 학교 및 전공
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full border border-[#c3c6d6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#003d9b]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434654] mb-1">
                  연락처 (휴대폰 번호)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-[#c3c6d6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#003d9b]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434654] mb-1">
                  보유 자격증 (복수 선택)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 bg-[#f9f9ff] border border-[#c3c6d6]/40 rounded-lg">
                  {availableCerts.map((cert) => {
                    const isChecked = selectedCerts.includes(cert);
                    return (
                      <button
                        type="button"
                        key={cert}
                        onClick={() => handleToggleCert(cert)}
                        className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                          isChecked
                            ? 'bg-[#003d9b] text-white border-[#003d9b]'
                            : 'bg-white text-[#434654] border-[#c3c6d6] hover:bg-[#f1f3ff]'
                        }`}
                      >
                        {isChecked ? '✓ ' : '+ '}
                        {cert}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434654] mb-1">
                  간편 자기소개 / 포부
                </label>
                <textarea
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  rows={3}
                  className="w-full border border-[#c3c6d6] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#003d9b]"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#737685] bg-[#f1f3ff] rounded-lg hover:bg-[#e8edff]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-xs font-bold text-white bg-[#003d9b] hover:bg-[#0052cc] rounded-lg shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>접수 처리 중...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      <span>지원서 최종 제출</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
