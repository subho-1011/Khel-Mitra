import { createBrowserRouter } from "react-router";

import { RootLayout, TicTacToeLayout } from "@/layout";

import Home from "@/pages/home";
import TicTacToe from "@/pages/tic-tac-toe";
import ErrorElement from "@/components/error-element";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
                errorElement: <ErrorElement />,
            },
            {
                path: "tic-tac-toe",
                element: (
                    <TicTacToeLayout>
                        <TicTacToe />
                    </TicTacToeLayout>
                ),
                handle: {
                    title: "Tic Tac Toe",
                },
            },
        ],
    },
    {
        path: "/auth",
        element: <h1>Authentication</h1>,
        children: [
            { path: "signin", element: <h2>Login</h2> },
            { path: "signup", element: <h2>Register</h2> },
        ],
    },
    {
        path: "*",
        element: <h1>Page not found</h1>,
    },
]);
