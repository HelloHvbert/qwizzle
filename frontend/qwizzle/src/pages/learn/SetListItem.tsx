import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface SetListItemProps {
  id: number;
  title?: string;
  name?: string;
  description: string;
  count: number;
}

export default function SetListItem({
  id,
  title,
  name,
  description,
  count,
}: SetListItemProps) {
  return (
    <div className="flex h-[180px] flex-col justify-between rounded-lg bg-white p-4 shadow-md transition-shadow duration-200 hover:shadow-lg">
      <div>
        <h3 className="line-clamp-1 text-lg font-semibold text-black">
          {title || name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-black">{description}</p>
      </div>
      <div className="mt-11 flex items-center justify-between">
        <span className="text-sm text-gray">{count} cards</span>
        <button className="hover:text-primary-dark text-primary">
          <Link to={`/learn/sets/${id}`}>
            <ChevronRight size={20} />
          </Link>
        </button>
      </div>
    </div>
  );
}
