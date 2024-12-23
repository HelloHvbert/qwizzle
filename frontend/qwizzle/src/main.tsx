import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Template from "./ui/Template";
import Login from "./auth/Login";
import Register from "./auth/Register";
import HomePage from "./pages/home/HomePage";
import SetList from "./pages/learn/SetsList";
import SetOverview from "./pages/learn/SetByIdOverview";
import PlaySet from "./pages/learn/PlaySet";
import CreateNewSet from "./pages/learn/CreateNewSet";
import EditSet from "./pages/learn/EditSet";
import { GetOwnedSets, GetSetById, getSetsByCategory } from "./store/loaders";
import Error from "./ui/Error";
import "./i18n";
import ProtectedRoute from "./auth/ProtectedPath";
import NewProfile from "./pages/user/NewProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Template />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "learn",
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <SetList />
              </ProtectedRoute>
            ),
            // loader: GetAllSets,
            loader: getSetsByCategory,
          },
          {
            path: "create",
            element: (
              <ProtectedRoute>
                <CreateNewSet />
              </ProtectedRoute>
            ),
          },
          {
            path: "sets/:id",
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoute>
                    <SetOverview />
                  </ProtectedRoute>
                ),
                loader: GetSetById,
              },
              {
                path: "edit",
                element: (
                  <ProtectedRoute>
                    <EditSet />
                  </ProtectedRoute>
                ),
                loader: GetSetById,
              },
              {
                path: "play",
                element: (
                  <ProtectedRoute>
                    <PlaySet />
                  </ProtectedRoute>
                ),
                loader: GetSetById,
              },
            ],
          },
        ],
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <NewProfile />
          </ProtectedRoute>
        ),
        loader: GetOwnedSets,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "*",
    element: <Error />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
