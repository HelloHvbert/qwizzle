import { useNavigate } from "react-router-dom";
import Button from "./Button"; // Assuming you have a Button component

export default function Error() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray">
      <div className="flex flex-col items-center justify-center gap-6 rounded-lg bg-light_gray p-8">
        <h1 className="text-3xl font-bold text-red">Ups😰</h1>
        <h1 className="text-3xl font-bold text-red">Something went wrong!</h1>
        <Button
          onClick={handleRedirect}
          className="bg-red-500 hover:bg-red-600 mt-4 rounded px-4 py-2 text-lg text-white"
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
}
