import React from "react";
import { useMatches } from "react-router";

interface RouterHandler {
    title?: string;
}

const DEFAULT_TITLE = "Khel Mitra";

export const usePageTitle = () => {
    // Implementation for updating the page title
    const matches = useMatches();

    React.useEffect(() => {
        const currentMatch = matches.find((match) => (match.handle as RouterHandler)?.title);
        const title = (currentMatch?.handle as RouterHandler)?.title;

        const customTitle = title + " | " + DEFAULT_TITLE;

        if (title) {
            document.title = customTitle;
        } else {
            document.title = DEFAULT_TITLE;
        }
    }, [matches]);
};
