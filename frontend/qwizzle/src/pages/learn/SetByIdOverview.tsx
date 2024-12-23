import { useEffect, useState } from "react";
import { useParams, Link, useLoaderData, useNavigate } from "react-router-dom";
import {
  Book,
  Clock,
  Award,
  Play,
  Edit,
  Trash,
  ChevronLeft,
  ChevronRight,
  ContactRound,
  Bookmark,
  ArrowDownZA,
} from "lucide-react";
import Button from "../../ui/Button";
import { useTranslation } from "react-i18next";
import {
  addSetToBookmarks,
  getToken,
  isSetOwner,
  isSetSaved,
  removeSetFromBookmarks,
} from "../../store/store";
import { SetType } from "./SetsList";
import Dialog from "../../ui/Dialog";
import API_URL from "../../config";
import { scrollToTop } from "../../store/loaders";
import { motion } from "motion/react";
import BackNavButton from "../../ui/BackNavButton";

export interface SetWithExtraType extends SetType {
  creator: string;
  updatedAt: string;
  langFrom: string;
  langTo: string;
  user: string;
  userId: number;
  items: { front: string; back: string; id: number | 0 }[];
}

export default function SetOverviewByIdOverview() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [saved, setSaved] = useState<boolean>();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isUpdatingSaved, setIsUpdatingSaved] = useState(false);
  const setFromLoader = useLoaderData() as SetWithExtraType;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const setLength = setFromLoader.items.length;
  const isOwner = isSetOwner(setFromLoader);

  // console.log(setFromLoader);

  const flashcardSet = setFromLoader.items;

  useEffect(() => {
    async function checkIfSaved() {
      const isSaved = await isSetSaved(id || "");
      setSaved(isSaved);
    }
    checkIfSaved();
  }, [id]);

  useEffect(() => {
    scrollToTop();
  }, []);

  if (!flashcardSet) {
    return <div className="mt-8 text-center">Flashcard set not found</div>;
  }

  const handlePrevCard = () => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex,
    );
    setIsFlipped(false);
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex < flashcardSet.length - 1 ? prevIndex + 1 : prevIndex,
    );
    setIsFlipped(false);
  };

  const handleFlipCard = () => {
    setIsFlipped((prev) => !prev);
  };

  async function handleSave() {
    setIsUpdatingSaved(true);
    if (saved) {
      await removeSetFromBookmarks(setFromLoader.id);
      setSaved(false);
    } else {
      await addSetToBookmarks(setFromLoader.id);
      setSaved(true);
    }
    setIsUpdatingSaved(false);
  }

  function handleDelete() {
    setDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    const token = getToken();
    const res = await fetch(`${API_URL}/sets/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });

    if (res.ok) {
      navigate("/learn");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.3,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      className="mx-auto p-4 lg:min-w-[45%]"
    >
      <BackNavButton to="/learn" />
      {deleteDialogOpen && isOwner && (
        <Dialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
          }}
          title="Are you sure?"
          description="After this action you will not be able to come back to this set"
          onConfirm={handleConfirmDelete}
        />
      )}
      <h1
        className="mb-4 text-3xl font-bold text-primary underline underline-offset-4"
        id="set-title"
      >
        {setFromLoader.name}
      </h1>
      <p className="mb-6 text-white">{setFromLoader.description}</p>
      <div className="mb-8 rounded-lg bg-light_gray p-6 shadow-md">
        <div className="flex flex-col items-center justify-center pb-3">
          <div className="text-2xl font-semibold">{setFromLoader.langFrom}</div>
          <ArrowDownZA className="mx-3" size={40} color="green" />
          <div className="text-2xl font-semibold">{setFromLoader.langTo}</div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center">
            <Book className="mr-2 text-primary" size={20} />
            <span>
              {setLength} {t("pages.learn.setByID.cards")}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 text-primary" size={20} />
            <span>
              {t("pages.learn.setByID.estimatedTime")}:{" "}
              {/* {flashcardSet.estimatedTime} */ `${setLength * 2} min`}
            </span>
          </div>
          <div className="flex items-center">
            <Award className="mr-2 text-primary" size={20} />
            <span>
              {t("pages.learn.setByID.difficulty")}: {`Begginner`}
            </span>
          </div>
          <div className="flex items-center">
            {/*  */}
            <ContactRound className="mr-2 text-primary" size={20} />
            <span className="mr-2 font-medium">
              {t("pages.learn.setByID.createdBy")}:
            </span>
            <span>{setFromLoader.user}</span>
          </div>
        </div>
        <div className="text-gray-500 mt-4 text-sm">
          {/* {t("pages.learn.setByID.lastUpdated")}: {flashcardSet.lastUpdated} */}
          {t("pages.learn.setByID.lastUpdated")}:{" "}
          {setFromLoader.updatedAt.substring(0, 10)}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link to={`/learn/sets/${id}/play`} className="flex items-center">
          <Button className="flex items-center">
            <Play size={20} className="mr-2" />
            {t("pages.learn.setByID.buttons.start")}
          </Button>
        </Link>
        {!isOwner && (
          <Button
            variant="secondary"
            className="flex items-center disabled:cursor-progress"
            disabled={isUpdatingSaved}
            onClick={handleSave}
          >
            {saved ? (
              <Bookmark size={20} className="mr-2" fill="white" />
            ) : (
              <Bookmark size={20} className="mr-2" />
            )}
            {/* <Bookmark
            size={20}
            className="mr-2"
            fill={saved ? "#c71585" : "black"}
          /> */}
            {t("pages.learn.setByID.buttons.save")}
          </Button>
        )}
        {isOwner && (
          <>
            <Link to={`/learn/sets/${id}/edit`}>
              <Button variant="secondary" className="flex items-center">
                <Edit size={20} className="mr-2" />
                {t("pages.learn.setByID.buttons.edit")}
              </Button>
            </Link>
            <Button
              variant="danger"
              className="flex items-center"
              onClick={handleDelete}
            >
              <Trash size={20} className="mr-2" />
              {t("pages.learn.setByID.buttons.delete")}
            </Button>
          </>
        )}
      </div>

      <div className="mt-8 select-none">
        <h2 className="text-gray-800 mb-4 text-2xl font-bold">
          {t("pages.learn.setByID.preview.title")}
        </h2>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 text-center">
            <span className="text-gray-600">
              {t("pages.learn.setByID.preview.card")} {currentCardIndex + 1} of{" "}
              {flashcardSet.length}
            </span>
          </div>
          <div className="perspective-1000 relative h-48 w-full">
            <div
              className={`transform-style-preserve-3d absolute h-full w-full cursor-pointer transition-transform duration-500 ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              onClick={handleFlipCard}
            >
              <div className="backface-hidden bg-gray-100 absolute flex h-full w-full items-center justify-center rounded-lg p-4">
                <span
                  className={`select-none text-center text-2xl font-bold ${!isFlipped && "hidden"}`}
                >
                  {flashcardSet[currentCardIndex].back}
                </span>
              </div>
              <div className="backface-hidden bg-gray-100 rotate-y-180 absolute flex h-full w-full items-center justify-center rounded-lg p-4">
                <span
                  className={`text-center text-2xl font-bold ${isFlipped && "hidden"}`}
                >
                  {flashcardSet[currentCardIndex].front}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Button
              onClick={handlePrevCard}
              disabled={currentCardIndex === 0}
              variant="secondary"
            >
              <ChevronLeft size={20} />
            </Button>
            <span className="text-gray-600">
              {t("pages.learn.setByID.preview.flip")}
            </span>
            <Button
              onClick={handleNextCard}
              disabled={currentCardIndex === flashcardSet.length - 1}
              variant="secondary"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
        <div className="mt-4 text-center">
          <Link
            to={`/learn/sets/${id}/play`}
            className="text-primary hover:underline"
          >
            {t("pages.learn.setByID.preview.viewAll")}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
