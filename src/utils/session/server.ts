import { cookies } from "next/headers";
import { nanoid } from "nanoid";

export async function getOrCreateTempSessionServer() {
    const cookieStore = await cookies();
    let id = cookieStore.get("launchly_session")?.value;

    if (!id) {
        id = nanoid();
        cookieStore.set("launchly_session", id, {
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
    }

    return id;
}
