import { Link } from "react-router-dom";
import { BookOpen, Award, Users, Zap, ChevronRight } from "lucide-react";
import Button from "../../ui/Button";
import Feature from "./Feature";
import { getToken } from "../../store/store";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();
  // temp
  const token = getToken();

  return (
    <div className="bg-gray-50 mt-5 flex min-h-screen w-11/12 flex-col items-center">
      {/* Hero Section */}
      <section className="rounded-xl bg-gray text-white md:w-full">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            {/* Welcome to Qwizzle */}
            {t("pages.home.mainBanner.title")}
          </h1>
          <p className="mb-8 text-xl md:text-2xl">
            {/* Your fun and interactive learning platform */}
            {t("pages.home.mainBanner.subtitle")}
          </p>
          <Link to={token ? "/learn" : "/login"}>
            <Button className="text-lg">
              {t("pages.home.mainBanner.button")}{" "}
              <ChevronRight className="ml-2 inline-block" size={24} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto xs:px-4 md:px-0">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            {/* Why Choose Qwizzle? */}
            {t("pages.home.features.title")}
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={<BookOpen className="h-8 w-8 text-white" color="#000" />}
              title={t("pages.home.features.diverseTopics.title")}
              description={t("pages.home.features.diverseTopics.description")}
            />
            <Feature
              icon={<Zap className="h-8 w-8 text-white" color="#000" />}
              title={t("pages.home.features.quickQuizzes.title")}
              description={t("pages.home.features.quickQuizzes.description")}
            />
            <Feature
              icon={<Award className="h-8 w-8 text-white" color="#000" />}
              title={t("pages.home.features.trackProgress.title")}
              description={t("pages.home.features.trackProgress.description")}
            />
            <Feature
              icon={<Users className="h-8 w-8 text-white" color="#000" />}
              title={t("pages.home.features.community.title")}
              description={t("pages.home.features.community.description")}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!token && (
        <section className="rounded-xl bg-gray py-20 text-white md:w-full">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {t("pages.home.boost.title")}
            </h2>
            <p className="mb-8 text-xl">{t("pages.home.boost.subtitle")}</p>
            <Link to="/register">
              <Button className="hover:bg-gray-100 bg-primary text-lg text-white">
                {t("pages.home.boost.button")}{" "}
                <ChevronRight className="ml-2 inline-block" size={24} />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Testimonial Section */}
      <section className="pb-10 pt-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            {t("pages.home.reviews.title")}
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <p className="text-gray-600 mb-4">
                "{t("pages.home.reviews.review1")}"
              </p>
              <p className="font-semibold">- Sarah J.</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <p className="text-gray-600 mb-4">
                "{t("pages.home.reviews.review2")}"
              </p>
              <p className="font-semibold">- Mike T.</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <p className="text-gray-600 mb-4">
                "{t("pages.home.reviews.review3")}"
              </p>
              <p className="font-semibold">- Emily R.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
