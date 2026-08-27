import React from 'react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectJobById: (jobId: string) => void;
  onSelectCompanyByName: (companyName: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectJobById,
  onSelectCompanyByName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-[#ffffff] rounded-2xl max-w-md w-full p-5 md:p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center pb-3 border-b border-[#c3c6d6]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003d9b]">notifications</span>
            <h3 className="font-bold text-lg text-[#041b3c]">알림 센터</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-[#0052cc] hover:underline font-semibold"
            >
              모두 읽음
            </button>
            <button onClick={onClose} className="text-[#737685] hover:text-[#041b3c] p-1">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto py-3 space-y-3 flex-1">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-[#737685] text-sm">
              새로운 알림이 없습니다.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onMarkAsRead(item.id);
                  if (item.jobId) {
                    onSelectJobById(item.jobId);
                    onClose();
                  } else if (item.companyName) {
                    onSelectCompanyByName(item.companyName);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  item.isRead
                    ? 'bg-[#ffffff] border-[#c3c6d6]/30 opacity-75'
                    : 'bg-[#f1f3ff] border-[#0052cc]/30 shadow-xs'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      item.type === 'deadline'
                        ? 'bg-rose-100 text-rose-700'
                        : item.type === 'job'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-teal-100 text-teal-700'
                    }`}
                  >
                    {item.type === 'deadline' ? '마감임박' : item.type === 'job' ? '신규채용' : '공지'}
                  </span>
                  <span className="text-[11px] text-[#737685]">{item.time}</span>
                </div>

                <h4 className="font-bold text-sm text-[#041b3c] mb-1">{item.title}</h4>
                <p className="text-xs text-[#434654] leading-relaxed">{item.content}</p>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-[#c3c6d6]/40 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-[#f1f3ff] hover:bg-[#e8edff] text-xs font-semibold text-[#003d9b] rounded-lg"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
