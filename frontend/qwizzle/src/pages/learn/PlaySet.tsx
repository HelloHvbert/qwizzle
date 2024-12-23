import { useState } from "react";
import { useParams, Link, useLoaderData, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, RotateCcw, Check, X } from "lucide-react";
import Button from "../../ui/Button";
import { useTranslation } from "react-i18next";
import { SetWithExtraType } from "./SetByIdOverview";
import Dialog from "../../ui/Dialog";

export default function PlaySet() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<number[]>([]);
  const { items: set, name } = useLoaderData() as SetWithExtraType;

  const flashcardSet = set.map((item, index) => ({
    id: index,
    front: item.front,
    back: item.back,
  }));

  if (!flashcardSet) {
    return (
      <div className="mt-8 text-center text-gray">Flashcard set not found</div>
    );
  }

  const currentCard = flashcardSet[currentCardIndex];
  const isLastCard = currentCardIndex === flashcardSet.length - 1;

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (!isLastCard) {
      setIsFlipped(false);
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setIsFlipped(false);
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleKnownCard = () => {
    if (!knownCards.includes(currentCard.id)) {
      setKnownCards([...knownCards, currentCard.id]);
    }
    handleNextCard();
  };

  const handleUnknownCard = () => {
    setKnownCards(knownCards.filter((id) => id !== currentCard.id));
    handleNextCard();
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setKnownCards([]);
  };

  function handleFinish() {
    navigate(`/learn/sets/${id}`);
  }

  return (
    <div className="mx-auto max-w-4xl select-none bg-white p-4">
      <Link
        to={`/learn/sets/${id}`}
        className="mb-4 inline-block text-blue hover:underline"
      >
        <ChevronLeft className="mr-1 inline-block" size={20} />

        {t("pages.learn.setByIDPlay.back")}
      </Link>
      <Dialog
        isOpen={knownCards.length === flashcardSet.length}
        title="Congratulations!🎖"
        onClose={handleFinish}
        description="Great job! You've learned all the words in this set. Choose a new set, or take a break. Keep up the amazing work!"
      />

      <h1 className="mb-4 text-3xl font-bold text-secondary">{name}</h1>
      <div className="mb-8 rounded-lg bg-secondary p-6 text-white shadow-md">
        <div className="mb-4 text-center">
          <span>
            {t("pages.learn.setByIDPlay.card")} {currentCardIndex + 1} of{" "}
            {flashcardSet.length}
          </span>
        </div>
        <div className="relative h-64 w-full [perspective:1000px]">
          <div
            className={`absolute h-full w-full cursor-pointer transition-transform duration-500 [transform-style:preserve-3d] ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
            onClick={handleFlipCard}
          >
            <div className="absolute flex h-full w-full items-center justify-center rounded-lg bg-primary p-4 text-secondary [backface-visibility:hidden]">
              <span className="text-center text-2xl font-bold">
                {currentCard.front}
              </span>
            </div>
            <div className="absolute flex h-full w-full items-center justify-center rounded-lg bg-primary p-4 text-secondary [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <span
                className={`text-center text-2xl font-bold ${!isFlipped && "hidden"}`}
              >
                {currentCard.back}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <span>{t("pages.learn.setByIDPlay.flip")}</span>
        </div>
      </div>
      <div className="mb-8 flex items-center justify-between">
        <Button
          onClick={handlePrevCard}
          disabled={currentCardIndex === 0}
          variant="secondary"
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={20} className="mr-2" />
          {t("pages.learn.setByIDPlay.previous")}
        </Button>
        <div className="text-center text-gray">
          <p>{t("pages.learn.setByIDPlay.progress")}:</p>
          <progress value={knownCards.length} max={flashcardSet.length} />
          <p>
            {knownCards.length} / {flashcardSet.length}
          </p>
        </div>
        <Button
          onClick={handleNextCard}
          disabled={isLastCard}
          variant="secondary"
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("pages.learn.setByIDPlay.next")}
          <ChevronRight size={20} className="ml-2" />
        </Button>
      </div>
      <div className="flex justify-center space-x-4">
        <Button
          onClick={handleKnownCard}
          variant="primary"
          className="flex items-center"
        >
          <Check size={20} className="mr-2" />
          {t("pages.learn.setByIDPlay.iKnowThis")}
        </Button>
        <Button
          onClick={handleUnknownCard}
          variant="outline"
          className="flex items-center"
        >
          <X size={20} className="mr-2" />
          {t("pages.learn.setByIDPlay.stillLearning")}
        </Button>
        <Button
          onClick={handleRestart}
          variant="secondary"
          className="flex items-center"
        >
          <RotateCcw size={20} className="mr-2" />
          {t("pages.learn.setByIDPlay.restart")}
        </Button>
      </div>
    </div>
  );
}
