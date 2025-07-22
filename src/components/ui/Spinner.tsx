// =============== src/components/ui/Spinner.tsx ===============
import { Loader } from 'lucide-react';

export function Spinner({ size = 32 }: { size?: number }) {
  return (
    <div className="flex justify-center items-center p-4">
      <Loader className="animate-spin text-sky-500" size={size} />
    </div>
  );
}