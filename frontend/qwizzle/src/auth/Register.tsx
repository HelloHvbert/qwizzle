import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { ChevronLeft } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import useUserStore from "../store/store";
import API_URL from "../config";
import { useTranslation } from "react-i18next";
import Dialog from "../ui/Dialog";

const initialErrorsState = {
  username: "",
  name: "",
  surname: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export default function Register() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const token = useUserStore((state) => state.user?.token);
  const [errors, setErrors] = useState(initialErrorsState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();

  if (token) {
    return <Navigate to="/learn" replace />;
  }

  function handleClear() {
    setName("");
    setSurname("");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors(initialErrorsState);
    setError("");
  }

  function handleChanges(e: React.ChangeEvent<HTMLInputElement>) {
    switch (e.target.id) {
      case "username":
        setUsername(e.target.value);
        console.log(username + e.target.value.slice(-1));
        break;
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      case "confirmPassword":
        setConfirmPassword(e.target.value);
        break;
      case "name":
        setName(e.target.value);
        break;
      case "surname":
        setSurname(e.target.value);
        break;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const newErrors: Record<string, string> = {};

    if (!username) {
      newErrors.username = t("pages.auth.register.username.error");
    }

    if (!name) {
      newErrors.name = t("pages.auth.register.name.error");
    }

    if (!surname) {
      newErrors.surname = t("pages.auth.register.surname.error");
    }

    if (!email) {
      newErrors.email = t("pages.auth.register.email.error");
    } else if (!emailRegex.test(email)) {
      newErrors.email = t("pages.auth.register.email.errors.invalid");
    }

    if (!password) {
      newErrors.password = t("pages.auth.register.password.error");
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t(
        "pages.auth.register.confirmPassword.errors.required",
      );
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t(
        "pages.auth.register.confirmPassword.errors.noMatch",
      );
    }

    // Zaktualizuj błędy w stanie
    setErrors(newErrors as typeof errors);

    // Sprawdź, czy istnieją błędy
    const ifErrorsNull = Object.values(newErrors).every(
      (error) => error === "",
    );

    if (!ifErrorsNull) {
      setLoading(false);
      return;
    }

    const res = await fetch(API_URL + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, surname, username, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      console.log("user created");
      setOpenDialog(true);
      handleClear();
    } else {
      console.log("error");
      console.log(data);
      if (data.message.toString().includes("Username")) {
        setError("Username or email is already taken");
      }
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-6 py-10 sm:px-6 lg:px-8">
      <Dialog
        isOpen={openDialog}
        onClose={() => navigate("/")}
        title={t("pages.auth.register.success.title")}
        description={t("pages.auth.register.success.message")}
      />
      <div className="relative w-full max-w-md space-y-8 rounded-lg bg-gray sm:px-2 sm:py-5">
        {/* <Link to="/" className="absolute left-0 top-2"> */}
        <ChevronLeft
          color="#88fc03"
          size={40}
          onClick={() => navigate(-1)}
          className="absolute left-0 top-2 cursor-pointer"
        />
        {/* </Link> */}
        <div>
          <h2 className="upper text-center text-4xl font-extrabold tracking-wider text-primary">
            {t("pages.auth.register.title")}
          </h2>
        </div>
        <form
          className="mt-8 space-y-1 px-5 pb-3 sm:mb-8 md:px-10"
          onSubmit={handleSubmit}
        >
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <Input
                placeholder={t("pages.auth.register.name.placeholder")}
                id="name"
                name="name"
                type="text"
                className="rounded-t-md"
                value={name}
                handleChange={handleChanges}
                error={errors.name}
              />
            </div>
            <div>
              <Input
                placeholder={t("pages.auth.register.surname.placeholder")}
                id="surname"
                name="surname"
                type="text"
                className="rounded-t-md"
                value={surname}
                handleChange={handleChanges}
                error={errors.surname}
              />
            </div>
            <div>
              <Input
                placeholder="Email"
                id="email"
                name="email"
                autoComplete="email"
                className="rounded-t-md"
                value={email}
                handleChange={handleChanges}
                error={errors.email}
              />
            </div>

            <div>
              <Input
                placeholder={t("pages.auth.register.username.placeholder")}
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                className="rounded-t-md"
                value={username}
                handleChange={handleChanges}
                error={errors.username}
              />
            </div>
            <div>
              <Input
                placeholder={t("pages.auth.register.password.placeholder")}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="rounded-b-md"
                value={password}
                handleChange={handleChanges}
                error={errors.password}
              />
            </div>
            <div>
              <Input
                placeholder={t(
                  "pages.auth.register.confirmPassword.placeholder",
                )}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="current-password"
                className="rounded-b-md"
                value={confirmPassword}
                handleChange={handleChanges}
                error={errors.confirmPassword}
              />
            </div>
          </div>

          <div className="flex justify-center font-bold uppercase">
            <span
              className="cursor-pointer rounded-md bg-light_gray px-4 py-2 text-secondary hover:bg-primary_hover/90 active:translate-y-0.5"
              onClick={handleClear}
            >
              {t("pages.auth.register.clear")}
            </span>
          </div>

          {error && (
            <div className="mt-2 rounded-md bg-secondary p-2 text-center text-xl uppercase tracking-wider text-red">
              {error}
            </div>
          )}

          <div className="pt-3 xs:pb-4">
            <Button
              type="submit"
              disabled={loading}
              className="border-transparent flex w-full justify-center rounded-md border bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {loading ? (
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                t("pages.auth.register.button")
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
