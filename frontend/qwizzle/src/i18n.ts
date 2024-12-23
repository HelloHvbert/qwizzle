import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "en",
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          navbar: {
            home: "Home",
            learn: "Learn",
            profile: "Profile",
            login: "Login",
          },
          pages: {
            home: {
              mainBanner: {
                title: "Welcome to Qwizzle",
                subtitle: "Your fun and interactive learning platform",
                button: "Start learning",
              },
              features: {
                title: "Why Choose Qwizzle?",
                diverseTopics: {
                  title: "Diverse Topics",
                  description:
                    "Explore a wide range of subjects tailored to your interests.",
                },
                quickQuizzes: {
                  title: "Quick Quizzes",
                  description:
                    "Test your knowledge with fun, bite-sized quizzes.",
                },
                trackProgress: {
                  title: "Track Progress",
                  description:
                    "Monitor your learning journey and earn achievements.",
                },
                community: {
                  title: "Community",
                  description:
                    "Connect with other learners and share your knowledge.",
                },
              },
              boost: {
                title: "Ready to Boost Your Knowledge?",
                subtitle:
                  "Join thousands of learners and start your journey today!",
                button: "Sing up now",
              },
              reviews: {
                title: "What our users say ?",
                review1:
                  "Qwizzle has made learning fun again! I love the variety of topics and the quick quiz format.",
                review2:
                  "I've learned so much in just a few weeks. The progress tracking feature keeps me motivated!",
                review3:
                  "The community aspect of Qwizzle is fantastic. I've met so many like-minded learners!",
              },
            },
            auth: {
              login: {
                login: {
                  placeholder: "email",
                  error: "Email is required",
                },
                password: {
                  placeholder: "Password",
                  error: "Password is required",
                },
                button: "Sign in",
                register: "Don't have an account yet? Register ",
                here: "here",
              },
              register: {
                title: "Create account",
                name: {
                  placeholder: "Name",
                  error: "Name is required",
                },
                surname: {
                  placeholder: "Surname",
                  error: "Surname is required",
                },
                email: {
                  placeholder: "Email",
                  error: "Email is required",
                },
                username: {
                  placeholder: "Username",
                  error: "Username is required",
                },
                password: {
                  placeholder: "Password",
                  error: "Password is required",
                },
                confirmPassword: {
                  placeholder: "Confirm Password",
                  errors: {
                    noMatch: "Passwords do not match",
                    required: "Confirm password is required",
                  },
                },
                clear: "Clear",
                button: "Register",
                success: {
                  title: "Congratulations!🎈🎉",
                  message:
                    "Your account has been successfully created! We're thrilled to have you on board. You can now log in and start exploring all the features we have to offer. If you have any questions or need assistance, feel free to reach out to our support team. Welcome to the community!🚀",
                },
              },
            },
            learn: {
              allSets: {
                title: "Start learning",
                browse: "Browse",
                saved: "Saved",
                mine: "Mine",
                noSets: "No sets found",
              },
              setByID: {
                back: "Back to Sets",
                cards: "cards",
                difficulty: "Difficulty",
                beginner: "Beginner",
                intermediate: "Intermediate",
                advanced: "Advanced",
                createdBy: "Created by",
                estimatedTime: "Estimated time",
                lastUpdated: "Last updated",
                buttons: {
                  start: "Start learning",
                  save: "Save Set",
                  edit: "Edit Set",
                  delete: "Delete Set",
                },
                preview: {
                  title: "Preview",
                  card: "Card",
                  flip: "Click card to flip",
                  viewAll: "View all cards",
                },
              },
              setByIDPlay: {
                back: "Back to Overview",
                card: "Card",
                next: "Next",
                previous: "Previous",
                flip: "Click card to flip",
                progress: "Progress",
                iKnowThis: "I know this",
                stillLearning: "Still learning",
                restart: "Restart",
              },
              setEdit: {
                backBtn: "Back to Set Overview",
                title: "Edit Set",
                setTitle: "Set Title",
                description: "Description",
                fromLang: "From Language",
                toLang: "To Language",
                cards: "Flashards",
                card: "Card",
                front: "Front",
                back: "Back",
                undo: "Undo Delete",
                cancel: "Cancel",
                save: "Save Changes",
                add: "Add new card",
              },
              setCreateNew: {
                title: "Create New Set",
                setTitle: "Title",
                description: "Description",
                fromLang: "From Language",
                toLang: "To Language",
                cards: "Flashcards",
                card: "Card",
                front: "Front",
                back: "Back",
                add: "Add card",
                cancel: "Cancel",
                save: "Save Set",
              },
            },
          },
        },
      },
      pl: {
        translation: {
          // here we will place our translations...
          navbar: {
            home: "Strona główna",
            learn: "Nauka",
            profile: "Profil",
            login: "Zaloguj",
          },
          pages: {
            home: {
              mainBanner: {
                title: "Witaj w Qwizzle",
                subtitle: "Nauka języków nigdy nie była tak prosta",
                button: "Zacznij naukę",
              },
              features: {
                title: "Dlaczego warto wybrać Qwizzle?",
                diverseTopics: {
                  title: "Różnorodne tematy",
                  description:
                    "Odkrywaj szeroki zakres tematów dostosowanych do Twoich zainteresowań.",
                },
                quickQuizzes: {
                  title: "Szybkie quizy",
                  description:
                    "Sprawdź swoją wiedzę za pomocą zabawnych, krótkich quizów.",
                },
                trackProgress: {
                  title: "Śledź postępy",
                  description:
                    "Monitoruj swoją drogę nauki i zdobywaj osiągnięcia.",
                },
                community: {
                  title: "Społeczność",
                  description:
                    "Połącz się z innymi uczącymi się i podziel się swoją wiedzą.",
                },
              },
              boost: {
                title: "Gotowy na podniesienie swojej wiedzy?",
                subtitle:
                  "Dołącz do tysięcy uczących się i rozpocznij swoją podróż już dziś!",
                button: "Zarejestruj się teraz",
              },
              reviews: {
                title: "Co mówią nasi użytkownicy ?",
                review1:
                  "Qwizzle sprawił, że nauka stała się znowu zabawna! Uwielbiam różnorodność tematów i format szybkiego quizu.",
                review2:
                  "Nauczyłem się tak wiele w zaledwie kilka tygodni. Funkcja śledzenia postępów motywuje mnie!",
                review3:
                  "Aspekt społecznościowy Qwizzle jest fantastyczny. Poznałem wielu podobnie myślących uczących się!",
              },
            },
            auth: {
              login: {
                login: {
                  placeholder: "Adres email",
                  error: "Adres email is required",
                },
                password: {
                  placeholder: "Hasło",
                  error: "Hasło jest wymagane",
                },
                button: "Zaloguj",
                register: "Nie masz jeszcze konta? Zarejestruj się ",
                here: "tutaj",
              },
              register: {
                title: "Utwórz konto",
                name: {
                  placeholder: "Imię",
                  error: "Imię jest wymagane",
                },
                surname: {
                  placeholder: "Nazwisko",
                  error: "Nazwisko jest wymagane",
                },
                email: {
                  placeholder: "Email",
                  error: "Email jest wymagany",
                },
                username: {
                  placeholder: "Nazwa użytkownika",
                  error: "Nazwa użytkownika jest wymagana",
                },
                password: {
                  placeholder: "Hasło",
                  error: "Hasło jest wymagane",
                },
                confirmPassword: {
                  placeholder: "Potwierdź hasło",
                  errors: {
                    noMatch: "Hasła nie pasują do siebie",
                    required: "Potwierdzenie hasła jest wymagane",
                  },
                },
                clear: "Wyczyść",
                button: "Zarejestruj",
                success: {
                  title: "Gratulacje!🎈🎉",
                  message:
                    "Twoje konto zostało pomyślnie utworzone! Jesteśmy podekscytowani, że do nas dołączyłeś. Możesz teraz zalogować się i zacząć korzystać ze wszystkich funkcji, które mamy do zaoferowania. Jeśli masz jakieś pytania lub potrzebujesz pomocy, skontaktuj się z naszym zespołem wsparcia. Witaj w społeczności!🚀",
                },
              },
            },
            learn: {
              allSets: {
                title: "Rozpocznij naukę",
                browse: "Przeglądaj",
                saved: "Zapisane",
                mine: "Moje",
                noSets: "Nie znaleziono zestawów",
              },
              setByID: {
                back: "Powrót do zestawów",
                cards: "fiszek",
                difficulty: "Poziom trudności",
                beginner: "Początkujący",
                intermediate: "Średniozaawansowany",
                advanced: "Zaawansowany",
                createdBy: "Utworzony przez",
                estimatedTime: "Szacowany czas",
                lastUpdated: "Ostatnia aktualizacja",
                buttons: {
                  start: "Rozpocznij naukę",
                  save: "Zapisz zestaw",
                  edit: "Edytuj zestaw",
                  delete: "Usuń zestaw",
                },
                preview: {
                  title: "Podgląd",
                  card: "Karta",
                  flip: "Kliknij kartę, aby odwrócić",
                  viewAll: "Zobacz wszystkie karty",
                },
              },
              setByIDPlay: {
                back: "Powrót do podglądu",
                card: "Karta",
                next: "Następna",
                previous: "Poprzednia",
                flip: "Kliknij kartę, aby odwrócić",
                progress: "Postęp",
                iKnowThis: "Umiem to",
                stillLearning: "Nadal się uczę",
                restart: "Zacznij od nowa",
              },
              setEdit: {
                backBtn: "Powrót do zestawu",
                title: "Edytuj zestaw",
                setTitle: "Tytuł zestawu",
                description: "Opis",
                fromLang: "Z języka",
                toLang: "Na język",
                cards: "Fiszki",
                card: "Karta",
                front: "Przód",
                back: "Tył",
                undo: "Cofnij usunięcie",
                cancel: "Anuluj",
                save: "Zapisz zmiany",
                add: "Dodaj nową fiszke",
              },
              setCreateNew: {
                title: "Utwórz nowy zestaw",
                setTitle: "Tytuł",
                description: "Opis",
                fromLang: "Z języka",
                toLang: "Na język",
                cards: "Fiszki",
                card: "Fiszka",
                front: "Przód",
                back: "Tył",
                add: "Dodaj fiszkę",
                cancel: "Anuluj",
                save: "Zapisz zestaw",
              },
            },
          },
        },
      },
    },
  });

export default i18n;
