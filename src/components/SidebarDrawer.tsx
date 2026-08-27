import React from 'react';
import { TabType } from './BottomNavBar';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onSelectCompany: (companyId: string) => void;
  bookmarkedJobIds: string[];
  appliedCount: number;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  onChangeTab,
  onSelectCompany,
  bookmarkedJobIds,
  appliedCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        id="sidebar-drawer-panel"
        className="relative flex flex-col w-4/5 max-w-sm bg-[#ffffff] h-full shadow-2xl z-10 overflow-y-auto animate-in slide-in-from-left duration-200"
      >
        {/* User Card */}
        <div className="bg-[#003d9b] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border border-white/30 text-white font-bold text-lg">
              석유
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-bold text-lg">김석유</h2>
                <span className="text-[11px] bg-[#006477] text-white px-2 py-0.5 rounded-full font-medium">
                  마이스터 3학년
                </span>
              </div>
              <p className="text-xs text-white/80">여수석유화학고등학교 · 공정운전 전공</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/20 text-center">
            <button
              onClick={() => {
                onChangeTab('mypage');
                onClose();
              }}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors text-left"
            >
              <span className="text-[11px] text-white/70 block">지원 완료</span>
              <span className="text-base font-bold text-white">{appliedCount}건</span>
            </button>
            <button
              onClick={() => {
                onChangeTab('mypage');
                onClose();
              }}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors text-left"
            >
              <span className="text-[11px] text-white/70 block">스크랩 공고</span>
              <span className="text-base font-bold text-white">{bookmarkedJobIds.length}개</span>
            </button>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-4 flex-1 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-[#737685] tracking-wider uppercase mb-2 px-2">
              서비스 바로가기
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  id="drawer-link-home"
                  onClick={() => {
                    onChangeTab('home');
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#041b3c] hover:bg-[#f1f3ff] transition-colors font-medium text-sm text-left"
                >
                  <span className="material-symbols-outlined text-[#0052cc] text-[20px]">home</span>
                  홈 (주요 채용 피드)
                </button>
              </li>
              <li>
                <button
                  id="drawer-link-search"
                  onClick={() => {
                    onChangeTab('search');
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#041b3c] hover:bg-[#f1f3ff] transition-colors font-medium text-sm text-left"
                >
                  <span className="material-symbols-outlined text-[#0052cc] text-[20px]">search</span>
                  전체 채용 공고 탐색
                </button>
              </li>
              <li>
                <button
                  id="drawer-link-mypage"
                  onClick={() => {
                    onChangeTab('mypage');
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#041b3c] hover:bg-[#f1f3ff] transition-colors font-medium text-sm text-left"
                >
                  <span className="material-symbols-outlined text-[#0052cc] text-[20px]">person</span>
                  마이페이지 (지원현황 및 북마크)
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Company Insights */}
          <div>
            <h3 className="text-xs font-semibold text-[#737685] tracking-wider uppercase mb-2 px-2">
              주요 기업 상세 정보
            </h3>
            <div className="grid grid-cols-1 gap-1">
              {[
                { id: 'gs-caltex', name: 'GS칼텍스', desc: '정유/석유화학 · 초봉 6,000만' },
                { id: 'lg-chem', name: 'LG화학', desc: '석유화학 · 복지 최고 수준' },
                { id: 'hanwha-solutions', name: '한화솔루션', desc: '화학/태양광 · 여수/울산' },
                { id: 'posco-future-m', name: '포스코퓨처엠', desc: '2차전지 양극재/음극재' },
                { id: 'lg-energy-solution', name: 'LG에너지솔루션', desc: '배터리 글로벌 리더' },
              ].map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => {
                    onSelectCompany(comp.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-[#f1f3ff] transition-colors group"
                >
                  <div>
                    <div className="font-semibold text-sm text-[#041b3c] group-hover:text-[#0052cc]">
                      {comp.name}
                    </div>
                    <div className="text-xs text-[#737685]">{comp.desc}</div>
                  </div>
                  <span className="material-symbols-outlined text-[#737685] text-sm group-hover:translate-x-0.5 transition-transform">
                    chevron_right
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Meister High School Support Card */}
          <div className="bg-[#e8edff] rounded-xl p-3.5 border border-[#c3c6d6]/40">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-[#003d9b] text-[20px]">school</span>
              <h4 className="font-bold text-xs text-[#003d9b]">마이스터고 전용 취업 멘토링</h4>
            </div>
            <p className="text-xs text-[#434654] leading-relaxed mb-2.5">
              위험물산업기사, 가스기능사, 화학분석기능사 취득 노하우와 산단 현직 선배 모의면접을 무료로 확인하세요.
            </p>
            <div className="text-[11px] text-[#0052cc] font-semibold flex items-center gap-1">
              <span>여수산단 취업지원센터 연계</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#c3c6d6]/40 bg-[#f9f9ff] text-xs text-[#737685] flex justify-between items-center">
          <span>취업알리미 v2.4.0</span>
          <span>© 2026 여수산단 취업알리미</span>
        </div>
      </div>
    </div>
  );
};
