import { Position } from '@/types';
import { ArrowRight } from 'lucide-react';

interface ShowPathProps {
    path: Position[];
    index: number;
}

export default function ShowPath({ path, index }: ShowPathProps) {
  return (
    <div className="w-full flex items-center overflow-scroll hide-scrollbar bg-white p-2">
    {path.slice(1).map((item, positionIndex) => (
      <div key={`${index}-${positionIndex}`} className=" flex items-center">
        <p className="whitespace-nowrap">
          ({item.x}, {item.y})
        </p>

        {positionIndex < path.length - 2 && (
          <ArrowRight className="w-4 h-4" />
        )}
      </div>
    ))}
  </div>
  );
}