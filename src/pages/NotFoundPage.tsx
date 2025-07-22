// =============== src/pages/NotFoundPage.tsx ===============
import { Link as LinkNotFound } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-sky-500">404</h1>
      <p className="text-2xl mt-4">Page Not Found</p>
      <p className="mt-2 text-gray-500">The page you are looking for does not exist.</p>
      <LinkNotFound to="/" className="mt-6 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">
        Go Home
      </LinkNotFound>
    </div>
  );
}
