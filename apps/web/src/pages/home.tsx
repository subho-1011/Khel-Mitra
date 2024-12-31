export default function Home() {
    return (
        <div className="w-full -px-10 -m-10">
            <Hero />
            <GamesSection />
        </div>
    );
}

import { TypingAnimation } from "@/components/TypingAnimation";

const Title = "Welcome to KhelMitra";

function Hero() {
    const navigate = useNavigate();

    const description =
        "Discover, play, and connect with your friends. Create your own gaming community and explore new games together.";

    return (
        <section className="py-24 md:py-32 bg-gradient-to-t from-primary/10 to-primary/5">
            <div className="container mx-auto text-center">
                <TypingAnimation
                    className="text-2xl md:text-5xl mb-4 text-orange-500"
                    startOnView={true}
                    duration={150}
                >
                    {Title}
                </TypingAnimation>
                <p className="text-base md:text-xl mb-8 max-w-2xl mx-auto">{description}</p>
                <HeroHoverButton className="w-60" text="Explore Games" onClick={() => navigate("/games")} />
            </div>
        </section>
    );
}

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
}

const HeroHoverButton = React.forwardRef<HTMLButtonElement, InteractiveHoverButtonProps>(
    ({ text = "Button", className, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "group relative w-32 cursor-pointer overflow-hidden rounded-full border bg-background p-2 text-center font-semibold ring-2 ring-orange-500 hover:shadow-md hover:shadow-orange-500",
                    className
                )}
                {...props}
            >
                <span className="inline-block translate-x-1 transition-all text-secondary-foreground duration-300 group-hover:translate-x-12 group-hover:opacity-0">
                    {text}
                </span>
                <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
                    <span>{text}</span>
                    <ArrowRight />
                </div>
                <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-primary transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-primary"></div>
            </button>
        );
    }
);

HeroHoverButton.displayName = "HeroButton";

export { HeroHoverButton };

import { Badge } from "@/components/ui/badge";
import { FeaturedGames } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link, useNavigate } from "react-router";

export function GamesSection() {
    const navigate = useNavigate();

    return (
        <section className="pt-6 pb-16 w-full flex items-center justify-center mx-auto">
            <div className="w-full lg:max-w-7xl">
                <h2 id="games" className="text-xl md:text-2xl">
                    Games
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {FeaturedGames.map((game, index) => (
                        <Card
                            key={index}
                            className="border border-muted rounded-md hover:shadow-lg hover:shadow-primary/40 hover:border-primary/40 duration-300 delay-150 transition-shadow"
                        >
                                <CardContent className="p-0" onClick={() => navigate(`${game.href}`)}>
                                    <img
                                        src={"/images/khel-mitra.png"}
                                        alt={game.name}
                                        width={300}
                                        height={200}
                                        className="w-full rounded-t-md aspect-video object-cover hover:opacity-90 hover:cursor-pointer duration-300"
                                    />
                                </CardContent>
                            <CardFooter className="flex justify-between items-center p-4">
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-bold">{game.name}</h3>
                                    <div className="flex text-sm text-muted-foreground gap-4">
                                        <p>{game.genre}</p>
                                        <Badge variant="secondary">{game.type}</Badge>
                                    </div>
                                </div>
                                <Button variant="outline" onClick={() => navigate(`${game.href}`)}>
                                    Play Now
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
