import React from 'react';

export type TabType = 'home' | 'search' | 'mypage';

interface BottomNavBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onChangeTab }) => {
  return (
    <nav
      id="bottom-nav-bar"
      className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 bg-[#f9f9ff] border-t border-[#c3c6d6]/60 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]"
    >
      {/* Home Tab */}
      <button
        id="nav-tab-home"
        onClick={() => onChangeTab('home')}
        className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
          activeTab === 'home'
            ? 'bg-[#0052cc] text-[#c4d2ff] rounded-full px-5 py-1.5 shadow-sm scale-100'
            : 'text-[#434654] p-2 hover:text-[#003d9b]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            activeTab === 'home' ? 'fill-1 text-white' : ''
          }`}
        >
          home
        </span>
        <span
          className={`text-[12px] font-medium mt-0.5 leading-none ${
            activeTab === 'home' ? 'text-white font-semibold' : ''
          }`}
        >
          Home
        </span>
      </button>

      {/* Search Tab */}
      <button
        id="nav-tab-search"
        onClick={() => onChangeTab('search')}
        className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
          activeTab === 'search'
            ? 'bg-[#0052cc] text-[#c4d2ff] rounded-full px-5 py-1.5 shadow-sm scale-100'
            : 'text-[#434654] p-2 hover:text-[#003d9b]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            activeTab === 'search' ? 'fill-1 text-white font-bold' : ''
          }`}
        >
          search
        </span>
        <span
          className={`text-[12px] font-medium mt-0.5 leading-none ${
            activeTab === 'search' ? 'text-white font-semibold' : ''
          }`}
        >
          Search
        </span>
      </button>

      {/* My Page Tab */}
      <button
        id="nav-tab-mypage"
        onClick={() => onChangeTab('mypage')}
        className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
          activeTab === 'mypage'
            ? 'bg-[#0052cc] text-[#c4d2ff] rounded-full px-5 py-1.5 shadow-sm scale-100'
            : 'text-[#434654] p-2 hover:text-[#003d9b]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            activeTab === 'mypage' ? 'fill-1 text-white' : ''
          }`}
        >
          person
        </span>
        <span
          className={`text-[12px] font-medium mt-0.5 leading-none ${
            activeTab === 'mypage' ? 'text-white font-semibold' : ''
          }`}
        >
          My Page
        </span>
      </button>
    </nav>
  );
};
