import { Github } from 'lucide-react';
import { API_BASE_URL } from '../config/constants';

export function LoginPage() {
  const handleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-sky-500 mb-4">Welcome to CodeGram</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">The social platform for developers.</p>
      <button onClick={handleLogin} className="flex items-center gap-3 bg-gray-800 text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-700 transition-colors">
        <Github size={24} /> Login with GitHub
      </button>
    </div>
  );
}
