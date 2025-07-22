import { Loader } from 'lucide-react';

export function Spinner() {
  return (
    <div className="flex justify-center items-center p-4">
      <Loader className="animate-spin text-sky-500" size={32} />
    </div>
  );
}
