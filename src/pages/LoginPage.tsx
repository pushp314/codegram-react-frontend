// =============== src/pages/LoginPage.tsx ===============
import { Github } from 'lucide-react';
import { API_BASE_URL as API_BASE_URL_LOGIN } from '../config/constants';
import { Navigate } from 'react-router-dom';
import { useAuthStore as useAuthStoreLogin } from '../store/authStore';

export function LoginPage() {
  const { user, isLoading } = useAuthStoreLogin();

  const handleLogin = () => {
    window.location.href = `${API_BASE_URL_LOGIN}/auth/github`;
  };

  if (isLoading) {
    return null;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-sky-500 mb-4">Welcome to CodeGram</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">The social platform for developers.</p>
        <button 
          onClick={handleLogin} 
          className="flex items-center justify-center gap-3 w-full bg-gray-800 text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-700 transition-colors"
        >
          <Github size={24} /> Login with GitHub
        </button>
      </div>
    </div>
  );
}
