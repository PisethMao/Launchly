import { nanoid } from "nanoid";

export function getOrCreateTempSessionClient(): string | null {
    if (typeof window === "undefined") {
        // Prevent running on the server
        return null;
    }

    let id = localStorage.getItem("launchly_session");
    if (!id) {
        id = nanoid();
        localStorage.setItem("launchly_session", id);
    }
    return id;
}
