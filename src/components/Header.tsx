import React from 'react';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  onGoHome: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMenu,
  onOpenNotifications,
  unreadNotificationsCount,
  onGoHome,
  showBackButton = false,
  onBack,
}) => {
  return (
    <header
      id="top-app-header"
      className="bg-[#f9f9ff] border-b border-[#c3c6d6]/60 sticky top-0 z-40 w-full transition-colors duration-200"
    >
      <div className="flex justify-between items-center w-full px-5 md:px-6 py-2 h-16 max-w-[1200px] mx-auto">
        {showBackButton ? (
          <button
            id="header-back-btn"
            onClick={onBack || onGoHome}
            aria-label="Go back"
            className="text-[#003d9b] hover:bg-[#e8edff] p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
        ) : (
          <button
            id="header-menu-btn"
            onClick={onOpenMenu}
            aria-label="Open menu"
            className="text-[#003d9b] hover:bg-[#e8edff] p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        )}

        <button
          id="header-logo-title-btn"
          onClick={onGoHome}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <h1 className="font-['Hanken_Grotesk'] text-2xl md:text-[26px] font-bold text-[#003d9b] tracking-tight group-hover:opacity-90 transition-opacity">
            석화고 취업길잡이
          </h1>
        </button>

        <button
          id="header-notifications-btn"
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="text-[#003d9b] hover:bg-[#e8edff] p-2 rounded-full transition-colors relative flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">notifications</span>
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadNotificationsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
