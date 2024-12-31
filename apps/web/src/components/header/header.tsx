import React from "react";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router";
import { Gamepad2Icon, HomeIcon, Newspaper, Users2 } from "lucide-react";

export const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <header className="fixed z-50 top-0 flex items-center justify-center w-full h-16 bg-transparent backdrop-blur-xl border-b px-3 sm:px-6 md:px-12">
                <div className="flex w-full max-w-7xl items-center justify-between">
                    <h1 className="text-2xl md:text-4xl font-bold hover:cursor-pointer" onClick={() => navigate("/")}>
                        KH<span className="text-orange-600">8</span>L MITRA
                    </h1>

                    <div className="flex gap-6 items-center">
                        <div className="hidden md:flex gap-4">
                            <div>
                                <NavLink
                                    to="/games"
                                    className="text-sm hover:text-foreground/80 transition-all duration-500 peer"
                                >
                                    Games
                                </NavLink>
                                <div className="w-0 h-[2px] bg-primary/80 peer-hover:w-full transition-all duration-500" />
                            </div>
                            <div>
                                <NavLink
                                    to="/news"
                                    className="text-sm hover:text-foreground/80 transition-all duration-500 peer"
                                >
                                    News
                                </NavLink>
                                <div className="w-0 h-[2px] bg-primary/80 peer-hover:w-full transition-all duration-500" />
                            </div>
                            <div>
                                <NavLink
                                    to="/community"
                                    className="text-sm hover:text-foreground/80 transition-all duration-500 peer"
                                >
                                    Community
                                </NavLink>
                                <div className="w-0 h-[2px] bg-primary/80 peer-hover:w-full transition-all duration-500" />
                            </div>
                        </div>

                        <Button onClick={() => navigate("/auth/signin")}>Sign In</Button>
                    </div>
                </div>
            </header>
            <div className="md:hidden fixed z-50 h-16 w-full bg-transparent backdrop-blur-2xl bottom-0 border-t flex items-center justify-between px-6">
                <NavLink to="/">
                    <HomeIcon />
                </NavLink>
                <NavLink to="/games">
                    <Gamepad2Icon />
                </NavLink>
                <NavLink to="/news">
                    <Newspaper />
                </NavLink>
                <NavLink to="/community">
                    <Users2 />
                </NavLink>
            </div>
        </React.Fragment>
    );
};
