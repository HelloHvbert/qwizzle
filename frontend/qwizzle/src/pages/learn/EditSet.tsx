import { useState, useEffect, FormEvent } from "react";
import { Plus, Trash2, Save, Undo2 } from "lucide-react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import Button from "../../ui/Button";
import { useTranslation } from "react-i18next";
import { SetWithExtraType } from "./SetByIdOverview";
import API_URL from "../../config";
import { getToken } from "../../store/store";
import Dialog from "../../ui/Dialog";
import Loader2 from "../../ui/Loader2";
import Input from "../../ui/Input";
import BackNavButton from "../../ui/BackNavButton";

export default function EditSet() {
  const set = useLoaderData() as SetWithExtraType;
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [title, setTitle] = useState(set.name);
  const [description, setDescription] = useState(set.description);
  const [fromLanguage, setFromLanguage] = useState(set.langFrom);
  const [toLanguage, setToLanguage] = useState(set.langTo);
  const [cards, setCards] = useState(set.items);
  const [deletedCardIds, setDeletedCardIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [enableButton, setEnableButton] = useState(false);

  useEffect(() => {
    set.items.map((card, index) => (card.id = index + 1));
  }, [set]);

  useEffect(() => {
    const cardsWithoutDeleted = cards.filter(
      (card) => !deletedCardIds.includes(card.id),
    );
    const hasEmptyCard = cardsWithoutDeleted.some(
      (card) => card.front === "" || card.back === "",
    );
    setEnableButton(!hasEmptyCard && cardsWithoutDeleted.length > 0);
  }, [deletedCardIds, cards]);

  const handleAddCard = () => {
    const newId = Math.max(...cards.map((card) => card.id), 0) + 1;
    setCards([...cards, { id: newId, front: "", back: "" }]);
  };

  const handleRemoveCard = (id: number) => {
    setDeletedCardIds([...deletedCardIds, id]);
  };

  const handleUndoDelete = (id: number) => {
    setDeletedCardIds(deletedCardIds.filter((deletedId) => deletedId !== id));
  };

  const handleCardChange = (id: number, side: string, value: string) => {
    setCards(
      cards.map((card) => (card.id === id ? { ...card, [side]: value } : card)),
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const newCards = cards.filter((card) => !deletedCardIds.includes(card.id));
    const updatedSet = {
      name: title,
      description,
      langFrom: fromLanguage,
      langTo: toLanguage,
      items: newCards,
    };
    const token = getToken();

    const res = await fetch(API_URL + `/sets/${set.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        ...updatedSet,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.log(data.message);
      setIsSaving(false);
      return;
    }
    setOpenDialog(true);
    setIsSaving(false);
  };

  function handleCloseDialog() {
    setOpenDialog(false);
    navigate(`/learn/sets/${id}`);
  }

  return (
    <div className="flex h-auto flex-col rounded-lg bg-gray">
      <Dialog
        isOpen={openDialog}
        onClose={handleCloseDialog}
        title="Your set has been updated!"
        description="You will be redirected to the set overview page."
      />
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
      <div className="border-b border-gray p-4">
        <BackNavButton to={`/learn/sets/${id}`} label={"Back to set"} />
        {/* <Link
          to={`/learn/sets/${id}`}
          className="mb-4 inline-block text-blue hover:underline"
        >
          &larr; {t("pages.learn.setEdit.backBtn")}
        </Link> */}
        <h1 className="text-3xl font-bold text-secondary">
          {t("pages.learn.setEdit.title")}
        </h1>
      </div>

      {isSaving ? (
        <Loader2 />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="custom-scrollbar flex-grow overflow-y-auto p-4"
        >
          <div className="mb-4" id="title">
            <Input
              label={t("pages.learn.setEdit.setTitle")}
              handleChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-primary"
            >
              {t("pages.learn.setEdit.description")}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray p-2 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              rows={3}
            />
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div id="fromLang">
              <Input
                label={t("pages.learn.setEdit.fromLang")}
                value={fromLanguage}
                handleChange={(e) => setFromLanguage(e.target.value)}
              />
            </div>
            <div id="toLang">
              <Input
                label={t("pages.learn.setEdit.toLang")}
                value={toLanguage}
                handleChange={(e) => setToLanguage(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 text-xl font-semibold text-secondary">
              {t("pages.learn.setEdit.cards")}
            </h2>
            {cards.map((card, index) => (
              <div
                key={index}
                className={`mb-4 rounded-md border p-4 ${deletedCardIds.includes(card.id) ? "border-red-300 bg-red" : "border-white bg-secondary"}`}
              >
                <div className="mb-2 flex justify-between">
                  <span className="font-medium text-white">
                    {t("pages.learn.setEdit.card")} {card.id}
                  </span>
                  {deletedCardIds.includes(card.id) ? (
                    <Button
                      type="button"
                      onClick={() => handleUndoDelete(card.id)}
                      variant="outline"
                      className="flex items-center bg-white"
                    >
                      <Undo2 size={20} className="mr-2" />
                      {t("pages.learn.setEdit.undo")}
                    </Button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(card.id)}
                      className="text-red hover:text-opacity-80"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`front-${card.id}`}
                      className="block text-sm font-medium text-primary"
                    >
                      {t("pages.learn.setEdit.front")} ({fromLanguage})
                    </label>
                    <input
                      type="text"
                      id={`front-${card.id}`}
                      value={card.front}
                      onChange={(e) =>
                        handleCardChange(card.id, "front", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray p-2 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      required
                      disabled={deletedCardIds.includes(card.id)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`back-${card.id}`}
                      className="block text-sm font-medium text-primary"
                    >
                      {t("pages.learn.setEdit.back")} ({toLanguage})
                    </label>
                    <input
                      type="text"
                      id={`back-${card.id}`}
                      value={card.back}
                      onChange={(e) =>
                        handleCardChange(card.id, "back", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray p-2 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      required
                      disabled={deletedCardIds.includes(card.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={handleAddCard}
              className="flex items-center disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!enableButton}
            >
              <Plus size={20} className="mr-2" />
              {t("pages.learn.setEdit.add")}
            </Button>
          </div>
        </form>
      )}

      <div className="border-t border-gray p-4">
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.history.back()}
            disabled={isSaving}
            className="bg-light_gray text-white hover:bg-red"
          >
            {t("pages.learn.setEdit.cancel")}
          </Button>
          <Button
            type="submit"
            className="flex items-center disabled:cursor-not-allowed disabled:opacity-50"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
            }}
            disabled={isSaving || !enableButton}
          >
            <Save size={20} className="mr-2" />
            {t("pages.learn.setEdit.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
