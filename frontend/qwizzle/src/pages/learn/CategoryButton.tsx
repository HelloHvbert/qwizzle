type CategoryButtonProps = {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;

  onClick: () => void;
};

export default function CategoryButton({
  icon,
  label,
  isActive,
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      className={`flex items-center rounded-md px-4 py-2 text-sm font-bold active:opacity-70 ${
        isActive
          ? "text-primary-foreground bg-primary"
          : "bg-white text-black hover:bg-gray"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
}
