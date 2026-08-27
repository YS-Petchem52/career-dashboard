import { useState } from 'react';
import { Header } from './components/Header';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { SidebarDrawer } from './components/SidebarDrawer';
import { HomeScreen } from './components/HomeScreen';
import { SearchScreen } from './components/SearchScreen';
import { CompanyDetailScreen } from './components/CompanyDetailScreen';
import { MyPageScreen } from './components/MyPageScreen';
import RecommendationScreen from './components/RecommendationScreen';
import TrendScreen from './components/TrendScreen';
import CertificationScreen from './components/CertificationScreen';
import { JobDetailModal } from './components/JobDetailModal';
import { ApplyModal } from './components/ApplyModal';
import { NotificationsModal } from './components/NotificationsModal';
import {
  COMPANIES_DATA,
  JOB_OPENINGS_DATA,
  INITIAL_NOTIFICATIONS,
  INITIAL_APPLICATIONS,
  SECTOR_TRENDS,
  CERTIFICATIONS_DATA,
  USER_CERTIFICATIONS,
  CERTIFICATION_ROUTES,
} from './data/mockData';
import { JobOpening, ApplicationRecord } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [applyingJob, setApplyingJob] = useState<JobOpening | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<string[]>([
    'job-lg-1',
    'job-gs-1',
  ]);
  const [followedCompanyIds, setFollowedCompanyIds] = useState<string[]>([
    'gs-caltex',
    'lg-chem',
  ]);
  const [applications, setApplications] = useState<ApplicationRecord[]>(INITIAL_APPLICATIONS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Unread notification count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Selected company object
  const activeCompany = selectedCompanyId
    ? COMPANIES_DATA.find((c) => c.id === selectedCompanyId) || COMPANIES_DATA[0]
    : null;

  // Bookmarked jobs
  const bookmarkedJobs = JOB_OPENINGS_DATA.filter((j) => bookmarkedJobIds.includes(j.id));

  // Followed companies
  const followedCompanies = COMPANIES_DATA.filter((c) => followedCompanyIds.includes(c.id));

  // Toggle Bookmark
  const handleToggleBookmark = (jobId: string) => {
    setBookmarkedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  // Toggle Follow Company
  const handleToggleFollow = (companyId: string) => {
    setFollowedCompanyIds((prev) =>
      prev.includes(companyId) ? prev.filter((id) => id !== companyId) : [...prev, companyId]
    );
  };

  // Navigation helpers
  const handleGoHome = () => {
    setSelectedCompanyId(null);
    setActiveTab('home');
  };

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  const handleViewAllJobsForCompany = (companyName: string) => {
    setSelectedCompanyId(null);
    setActiveTab('search');
    setSearchQuery(companyName);
  };

  const handleTabChange = (tab: TabType) => {
    setSelectedCompanyId(null);
    setActiveTab(tab);
  };

  // Application Submission
  const handleSubmitApplication = (
    job: JobOpening,
    applicantDetails: { name: string; school: string; phone: string; certs: string[]; note: string }
  ) => {
    const newApp: ApplicationRecord = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      appliedDate: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      status: '서류접수',
      applicantName: applicantDetails.name,
      school: applicantDetails.school,
    };

    setApplications([newApp, ...applications]);

    // Add a confirmation notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: `${job.companyName} 지원서 접수 완료`,
      content: `${job.title} 포지션에 서류가 성공적으로 접수되었습니다.`,
      time: '방금 전',
      isRead: false,
      type: 'job' as const,
      companyName: job.companyName,
      jobId: job.id,
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Mark notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleSelectJobById = (jobId: string) => {
    const target = JOB_OPENINGS_DATA.find((j) => j.id === jobId);
    if (target) {
      setSelectedJob(target);
    }
  };

  const handleSelectCompanyByName = (companyName: string) => {
    const target = COMPANIES_DATA.find((c) => c.name === companyName);
    if (target) {
      setSelectedCompanyId(target.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#041b3c] flex flex-col font-sans selection:bg-[#dae2ff] selection:text-[#001848]">
      {/* Top App Header */}
      <Header
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadCount}
        onGoHome={handleGoHome}
        showBackButton={!!selectedCompanyId}
        onBack={() => setSelectedCompanyId(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedCompanyId && activeCompany ? (
          <CompanyDetailScreen
            company={activeCompany}
            allCompanies={COMPANIES_DATA}
            onSelectCompany={handleSelectCompany}
            jobs={JOB_OPENINGS_DATA}
            onSelectJob={(job) => setSelectedJob(job)}
            onQuickApply={(job) => setApplyingJob(job)}
            onViewAllJobsForCompany={handleViewAllJobsForCompany}
            onBack={() => setSelectedCompanyId(null)}
            isFollowed={followedCompanyIds.includes(activeCompany.id)}
            onToggleFollow={handleToggleFollow}
          />
        ) : activeTab === 'home' ? (
          <HomeScreen
            companies={COMPANIES_DATA}
            jobs={JOB_OPENINGS_DATA}
            onSelectCompany={handleSelectCompany}
            onSelectJob={(job) => setSelectedJob(job)}
            onQuickApply={(job) => setApplyingJob(job)}
            onSearchFocus={() => setActiveTab('search')}
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              if (q.trim()) setActiveTab('search');
            }}
          />
        ) : activeTab === 'search' ? (
          <SearchScreen
            jobs={JOB_OPENINGS_DATA}
            onSelectJob={(job) => setSelectedJob(job)}
            onQuickApply={(job) => setApplyingJob(job)}
            bookmarkedJobIds={bookmarkedJobIds}
            onToggleBookmark={handleToggleBookmark}
            initialQuery={searchQuery}
          />
        ) : activeTab === 'recommendation' ? (
          <RecommendationScreen
            companies={COMPANIES_DATA}
            onSelectCompany={(company) => setSelectedCompanyId(company.id)}
          />
        ) : activeTab === 'trend' ? (
          <TrendScreen trends={SECTOR_TRENDS} />
        ) : activeTab === 'certification' ? (
          <CertificationScreen
            certifications={CERTIFICATIONS_DATA}
            userCertifications={USER_CERTIFICATIONS}
            routes={CERTIFICATION_ROUTES}
          />
        ) : (
          <MyPageScreen
            applications={applications}
            bookmarkedJobs={bookmarkedJobs}
            followedCompanies={followedCompanies}
            onSelectJob={(job) => setSelectedJob(job)}
            onSelectCompany={handleSelectCompany}
            onToggleBookmark={handleToggleBookmark}
            onToggleFollow={handleToggleFollow}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNavBar activeTab={activeTab} onChangeTab={handleTabChange} />

      {/* Slide Navigation Drawer */}
      <SidebarDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        onSelectCompany={handleSelectCompany}
        bookmarkedJobIds={bookmarkedJobIds}
        appliedCount={applications.length}
      />

      {/* Job Details Modal */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onApply={(job) => {
          setSelectedJob(null);
          setApplyingJob(job);
        }}
        onViewCompany={(companyId) => {
          setSelectedJob(null);
          setSelectedCompanyId(companyId);
        }}
        isBookmarked={selectedJob ? bookmarkedJobIds.includes(selectedJob.id) : false}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Apply Modal */}
      <ApplyModal
        job={applyingJob}
        onClose={() => setApplyingJob(null)}
        onSubmitApplication={handleSubmitApplication}
      />

      {/* Notifications Center Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onSelectJobById={handleSelectJobById}
        onSelectCompanyByName={handleSelectCompanyByName}
      />
    </div>
  );
}
