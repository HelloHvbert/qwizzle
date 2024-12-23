import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, To } from "react-router-dom";

type Props = {
  to?: string;
  label?: string;
};

export default function BackNavButton({ to, label }: Props) {
  const { t } = useTranslation();
  return (
    <Link
      to={to || (-1 as To)}
      className="mb-4 inline-block text-primary hover:underline"
    >
      <ChevronLeft className="mr-1 inline-block" size={20} />
      {label || t("pages.learn.setByID.back")}
    </Link>
  );
}
