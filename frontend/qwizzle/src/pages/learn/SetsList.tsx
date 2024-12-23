import { useState } from "react";
import { Book, Bookmark, Plus, User } from "lucide-react";
import CategoryButton from "./CategoryButton";
import SetListItem, { SetListItemProps } from "./SetListItem";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

export interface SetType {
  id: number;
  name?: string;
  description: string;
  count: number;
}

export default function SetList() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("browse");
  const navigate = useNavigate();
  const sets = useLoaderData() as Record<
    "browse" | "saved" | "mine",
    SetType[]
  >;

  if (!sets) {
    return <div className="mt-8 text-center text-gray">Loading...</div>;
  }

  function handleCreateNewSetClick() {
    navigate("/learn/create");
  }

  const categories = [
    {
      id: "browse",
      label: t("pages.learn.allSets.browse"),
      icon: <Book size={20} />,
    },
    {
      id: "saved",
      label: t("pages.learn.allSets.saved"),
      icon: <Bookmark size={20} />,
    },
    {
      id: "mine",
      label: t("pages.learn.allSets.mine"),
      icon: <User size={20} />,
    },
  ];

  const allFlashcardSets: { [key: string]: SetType[] } = {
    browse: sets.browse,
    saved: sets.saved,
    mine: sets.mine,
  };

  const displayedSets = allFlashcardSets[activeCategory];

  return (
    <>
      <div className="mx-auto p-4 xs:max-w-[95%] md:min-w-[67%] lg:max-w-[53%]">
        <h2 className="mb-6 text-3xl font-bold text-gray">
          {t("pages.learn.allSets.title")}
        </h2>

        <div className="mb-6 flex flex-wrap space-x-4 xs:justify-center xs:gap-4 sm:flex-nowrap sm:gap-0 md:justify-start">
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              icon={category.icon}
              label={category.label}
              isActive={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={displayedSets ? displayedSets.length : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid flex-grow grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {displayedSets.length === 0 ? (
              <div className="col-span-full mx-auto flex min-h-40 items-center text-3xl uppercase text-blue">
                <div className="text-wrap">
                  {t("pages.learn.allSets.noSets")}
                </div>
              </div>
            ) : (
              displayedSets.map((set: SetListItemProps) => (
                <SetListItem
                  key={set.id}
                  id={set.id}
                  title={set.name}
                  description={set.description}
                  count={set.count}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <button
        className="fixed bottom-20 right-8 rounded-full bg-primary p-4 text-secondary shadow-lg hover:bg-primary_hover"
        onClick={handleCreateNewSetClick}
        id="createNewSet"
      >
        <Plus size={24} />
        <span className="sr-only">Create Set</span>
      </button>
    </>
  );
}
