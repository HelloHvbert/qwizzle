import React, { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { NavLink, useNavigate } from "react-router-dom";
import API_URL from "../config";
import useUserStore, { User } from "../store/store";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LoginForm() {
  //! temp admin login
  const { t } = useTranslation();
  const tLoginError = t("pages.auth.login.login.error");
  const tPasswordError = t("pages.auth.login.password.error");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setUser = useUserStore(
    (state: { setUser: (user: User) => void }) => state.setUser,
  );
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!username && !password) {
      setUsernameError(tLoginError);
      setPasswordError(tPasswordError);
      setLoading(false);
      return;
    } else if (!username) {
      setUsernameError(tLoginError);
      setPasswordError("");
      setLoading(false);
      return;
    } else if (!password) {
      setUsernameError("");
      setPasswordError(tPasswordError);
      setLoading(false);
      return;
    }

    setUsernameError("");
    setPasswordError("");

    const res = await fetch(API_URL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("data", data.data.token);
      const user: User = {
        id: data.data.userId,
        username: data.data.username,
        token: data.data.token,
        email: data.data.email,
      };
      setUser(user);
      navigate("/learn");
    } else {
      const data = await res.json();
      setPassword("");
      setError(data.message);
    }
    setLoading(false);
    // Handle login logic here
    // console.log("Login submitted", { username, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-6 py-10 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-md space-y-8 rounded-lg bg-gray sm:px-2 sm:py-5">
        <div>
          <ChevronLeft
            color="#88fc03"
            size={40}
            onClick={() => navigate("/")}
            className="absolute left-0 top-2 cursor-pointer"
          />
          <h2 className="upper mt-6 text-center text-4xl font-extrabold tracking-wider text-primary">
            Qwizzle
          </h2>
        </div>
        <form
          className="mt-8 space-y-6 px-5 pb-3 sm:mb-8 md:px-10"
          onSubmit={handleSubmit}
        >
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <Input
                placeholder={t("pages.auth.login.login.placeholder")}
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                className="rounded-t-md"
                value={username}
                handleChange={(e) => setUsername(e.target.value)}
                error={usernameError}
              />
            </div>
            <div>
              <Input
                placeholder={t("pages.auth.login.password.placeholder")}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="rounded-b-md"
                value={password}
                handleChange={(e) => setPassword(e.target.value)}
                error={passwordError}
              />
            </div>
          </div>

          <div>
            <Button
              disabled={loading}
              type="submit"
              className="border-transparent flex w-full justify-center rounded-md border bg-primary px-4 py-2 text-xl font-medium text-gray shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
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
                t("pages.auth.login.button")
              )}
            </Button>
          </div>
          {error && (
            <div className="mt-2 rounded-md bg-secondary p-2 text-center text-xl uppercase tracking-wider text-red">
              {error}
            </div>
          )}
          <div className="flex items-center justify-center">
            <div className="text-primar text-center font-medium">
              {/* Don't have an account yet? Register{" "} */}
              {t("pages.auth.login.register")}{" "}
              <NavLink
                to="/register"
                className="uppercase text-primary hover:underline"
              >
                {t("pages.auth.login.here")}
              </NavLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
