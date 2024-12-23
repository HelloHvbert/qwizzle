import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface DialogProps {
  isOpen: boolean; // Czy dialog jest widoczny
  onClose: () => void; // Funkcja zamykająca dialog
  title: string; // Tytuł dialogu
  description?: string; // Opcjonalny opis w dialogu
  onConfirm?: () => void; // Opcjonalna funkcja dla przycisku "Confirm"
}

function Dialog({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
}: DialogProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Match the duration of your CSS transition
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md scale-95 transform rounded-lg border-2 border-solid border-white bg-secondary p-6 shadow-lg transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()} // Zapobiega zamykaniu dialogu przy kliknięciu w jego wnętrze
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="hover:text-black focus:outline-none"
          >
            <X color="red" className="hover:bg-light_gray" size={30} />
          </button>
        </div>
        {description && <p className="mb-4 text-white">{description}</p>}
        <div className="mt-4 flex justify-end gap-2">
          {/* Przycisk Confirm lub OK */}
          {onConfirm ? (
            <>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary_hover"
              >
                Confirm
              </button>
              <button
                onClick={onClose}
                className="rounded-md bg-gray px-4 py-2 text-red hover:bg-light_gray"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="rounded-md bg-primary px-4 py-2 font-bold text-black hover:bg-primary_hover hover:ring-2 hover:ring-white active:translate-y-0.5"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default Dialog;
