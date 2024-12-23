import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import { useTranslation } from "react-i18next";
import API_URL from "../../config";
import { getToken } from "../../store/store";
import Dialog from "../../ui/Dialog";
import Input from "../../ui/Input";
import BackNavButton from "../../ui/BackNavButton";
import Loader2 from "../../ui/Loader2";

const initialErrors = {
  title: "",
  fromLanguage: "",
  toLanguage: "",
};

export default function CreateSet() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fromLanguage, setFromLanguage] = useState("");
  const [toLanguage, setToLanguage] = useState("");
  const [cards, setCards] = useState([{ front: "", back: "" }]);
  const [addNewEnabled, setAddNewEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSetId, setNewSetId] = useState<number>();
  const [errors, setErrors] = useState(initialErrors);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const isMoreThanOneCard =
    cards.filter((card) => card.front && card.back).length > 1;

  useEffect(() => {
    const front = cards[cards.length - 1].front;
    const back = cards[cards.length - 1].back;
    if (front && back) {
      setAddNewEnabled(true);
    } else {
      setAddNewEnabled(false);
    }
  }, [addNewEnabled, cards]);

  const handleAddCard = () => {
    setCards([...cards, { front: "", back: "" }]);
  };

  const handleRemoveCard = (index: number) => {
    const newCards = cards.filter((_, i) => i !== index);
    setCards(newCards);
  };

  const handleCardChange = (
    index: number,
    side: "front" | "back",
    value: string,
  ) => {
    const newCards = [...cards];
    newCards[index][side] = value;
    setCards(newCards);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Lokalny obiekt do przechowywania błędów
    const newErrors: Record<string, string> = {};

    if (!title) {
      newErrors.title = "Title is required";
    }

    if (!fromLanguage) {
      newErrors.fromLanguage = "From language is required";
    }

    if (toLanguage === "") {
      newErrors.toLanguage = "To language is required";
    }

    // Zaktualizuj błędy w stanie
    setErrors(newErrors as typeof errors);

    // Sprawdź, czy istnieją błędy
    const ifErrorsNull = Object.values(newErrors).every(
      (error) => error === "",
    );

    if (!ifErrorsNull) {
      setIsLoading(false);
      return;
    }

    const filteredCards = cards.filter(
      (card: { front: string; back: string }) => card.front && card.back,
    );

    const token = getToken();

    const res = await fetch(API_URL + "/sets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        name: title.trim(),
        description: description,
        langFrom: fromLanguage.trim(),
        langTo: toLanguage.trim(),
        items: filteredCards,
      }),
    });

    if (res.ok) {
      console.log("Set created successfully");
      const data = await res.json();
      setNewSetId(data.data.id);
    } else {
      console.error("Failed to create set");
    }
    setIsLoading(false);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex h-screen flex-col rounded-lg bg-gray">
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

      {
        <Dialog
          isOpen={isDialogOpen}
          title="Set created😀"
          description={`Your new set "${title}" has been created successfully!`}
          onClose={() => navigate(`/learn/sets/${newSetId}`)}
        />
      }
      <div className="border-b border-gray p-4">
        <BackNavButton to="/learn" />
        <h1 className="text-3xl font-bold text-white">
          {t("pages.learn.setCreateNew.title")}
        </h1>
      </div>

      {isLoading ? (
        <Loader2 />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="custom-scrollbar flex-grow overflow-y-auto xs:p-8 lg:p-4"
        >
          <div className="mb-4" id="title">
            <Input
              handleChange={(e) => setTitle(e.target.value)}
              value={title}
              label={t("pages.learn.setCreateNew.setTitle")}
              error={errors.title}
              id="title"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-primary"
            >
              {t("pages.learn.setCreateNew.description")}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray p-2 pl-2 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              rows={3}
            />
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div id="fromLang">
              <Input
                value={fromLanguage}
                handleChange={(e) => setFromLanguage(e.target.value)}
                label={t("pages.learn.setCreateNew.fromLang")}
                error={errors.fromLanguage}
                id="langFrom"
              />
            </div>
            <div id="toLang">
              <Input
                label={t("pages.learn.setCreateNew.toLang")}
                value={toLanguage}
                handleChange={(e) => setToLanguage(e.target.value)}
                error={errors.toLanguage}
                id="langTo"
              />
            </div>
          </div>

          <div className="mb-4" id="cards">
            <h2 className="mb-2 text-xl font-semibold text-white">
              {t("pages.learn.setCreateNew.cards")}
            </h2>
            {cards.map((card, index) => (
              <div
                key={index}
                className="mb-4 rounded-md border border-gray bg-secondary p-4"
              >
                <div className="mb-2 flex justify-between">
                  <span className="font-medium text-primary">
                    {t("pages.learn.setCreateNew.card")} {index + 1}
                  </span>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(index)}
                      className="text-red hover:text-opacity-80"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`front-${index}`}
                      className="block text-sm font-medium text-white"
                    >
                      {fromLanguage
                        ? `${t("pages.learn.setCreateNew.front")} (${fromLanguage.slice(0, 3).toUpperCase()})`
                        : t("pages.learn.setCreateNew.front")}
                    </label>
                    <input
                      type="text"
                      id={`front-${index}`}
                      value={card.front}
                      onChange={(e) =>
                        handleCardChange(index, "front", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray pl-2 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`back-${index}`}
                      className="block text-sm font-medium text-white"
                    >
                      {toLanguage
                        ? `${t("pages.learn.setCreateNew.back")} (${toLanguage.slice(0, 3).toUpperCase()})`
                        : t("pages.learn.setCreateNew.back")}
                    </label>
                    <input
                      type="text"
                      id={`back-${index}`}
                      value={card.back}
                      onChange={(e) =>
                        handleCardChange(index, "back", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray pl-2 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={handleAddCard}
              className="flex items-center disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!addNewEnabled}
              id="addCard"
            >
              <Plus size={20} className="mr-2" />
              {t("pages.learn.setCreateNew.add")}
            </Button>
          </div>
        </form>
      )}

      <div className="border-t border-gray p-4">
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            className="bg-red text-white"
            onClick={() => window.history.back()}
          >
            {t("pages.learn.setCreateNew.cancel")}
          </Button>
          <Button
            type="submit"
            className="flex items-center disabled:cursor-not-allowed disabled:opacity-50"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }}
            disabled={!isMoreThanOneCard || isLoading || !addNewEnabled}
          >
            <Save size={20} className="mr-2" />
            {t("pages.learn.setCreateNew.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
