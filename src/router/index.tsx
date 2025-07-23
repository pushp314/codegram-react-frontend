// =============== src/router/index.tsx ===============
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { Spinner } from '../components/ui/Spinner';
import { AdminRoute } from './AdminRoute';

// --- Lazy-loaded Page Components ---
const HomePage = lazy(() => import('../pages/HomePage').then(module => ({ default: module.HomePage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then(module => ({ default: module.LoginPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));
const CreateSnippetPage = lazy(() => import('../pages/CreateSnippetPage').then(module => ({ default: module.CreateSnippetPage })));
const SnippetDetailPage = lazy(() => import('../pages/SnippetDetailPage').then(module => ({ default: module.SnippetDetailPage })));
const PublicFeedPage = lazy(() => import('../pages/PublicFeedPage').then(module => ({ default: module.PublicFeedPage })));
const SearchPage = lazy(() => import('../pages/SearchPage').then(module => ({ default: module.SearchPage })));
const TrendingPage = lazy(() => import('../pages/TrendingPage').then(module => ({ default: module.TrendingPage })));
const CreateDocPage = lazy(() => import('../pages/CreateDocPage').then(module => ({ default: module.CreateDocPage })));
const DocDetailPage = lazy(() => import('../pages/DocDetailPage').then(module => ({ default: module.DocDetailPage })));
const EditDocPage = lazy(() => import('../pages/EditDocPage').then(module => ({ default: module.EditDocPage }))); // New
const CreateBugPage = lazy(() => import('../pages/CreateBugPage').then(module => ({ default: module.CreateBugPage })));
const BugDetailPage = lazy(() => import('../pages/BugDetailPage').then(module => ({ default: module.BugDetailPage })));
const EditProfilePage = lazy(() => import('../pages/EditProfilePage').then(module => ({ default: module.EditProfilePage })));
const PrivacySettingsPage = lazy(() => import('../pages/settings/PrivacySettingsPage').then(module => ({ default: module.PrivacySettingsPage })));
const NotificationSettingsPage = lazy(() => import('../pages/settings/NotificationSettingsPage').then(module => ({ default: module.NotificationSettingsPage })));
const AppearanceSettingsPage = lazy(() => import('../pages/settings/AppearanceSettingsPage').then(module => ({ default: module.AppearanceSettingsPage })));
const BlockedUsersPage = lazy(() => import('../pages/settings/BlockedUsersPage').then(module => ({ default: module.BlockedUsersPage })));
const AdminPage = lazy(() => import('../pages/admin/AdminPage').then(module => ({ default: module.AdminPage })));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage').then(module => ({ default: module.NotificationsPage })));

export function AppRouter() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Spinner /></div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          {/* Public routes */}
          <Route path="/snippets/:id" element={<SnippetDetailPage />} />
          <Route path="/docs/:id" element={<DocDetailPage />} />
          <Route path="/bugs/:id" element={<BugDetailPage />} />
          <Route path="/public" element={<PublicFeedPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />}>
                  <Route index element={<Navigate to="/settings/profile" replace />} />
                  <Route path="profile" element={<EditProfilePage />} />
                  <Route path="privacy" element={<PrivacySettingsPage />} />
                  <Route path="notifications" element={<NotificationSettingsPage />} />
                  <Route path="appearance" element={<AppearanceSettingsPage />} />
                  <Route path="blocked" element={<BlockedUsersPage />} />
              </Route>
              <Route path="/create/snippet" element={<CreateSnippetPage />} />
              <Route path="/create/doc" element={<CreateDocPage />} />
              <Route path="/docs/:id/edit" element={<EditDocPage />} /> {/* New */}
              <Route path="/create/bug" element={<CreateBugPage />} />

              {/* Admin routes */}
              <Route path="/admin" element={<AdminRoute />}>
                  <Route index element={<AdminPage />} />
              </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
