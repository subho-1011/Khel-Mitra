import { Outlet } from "react-router";
import { Header } from "@/components/header";
import { usePageTitle } from "@/hooks/usePageTitle";
import React from "react";

export const RootLayout: React.FC = () => {
    usePageTitle();

    return (
        <div>
            <Header />
            <main className="min-h-[calc(100vh-64px)] flex w-full justify-center mt-24">
                <div className="flex justify-center w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
