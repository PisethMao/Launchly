import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import RegisterPage from "./RegisterPage";

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (session) {
        const role = session.user?.role;

        if (role === "admin") {
            redirect("/admin/dashboard");
        }

        redirect("/user");
    }

    return <RegisterPage />;
}
