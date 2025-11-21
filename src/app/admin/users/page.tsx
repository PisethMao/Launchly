import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ManageUser from "./ManageUser";

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (session) {
        const role = session.user?.role;

        if (role === "admin") {
            redirect("/admin/dashboard");
        }

        redirect("/user");
    }

    return <ManageUser />;
}
