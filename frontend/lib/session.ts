import { cookies } from "next/headers";

export async function getToken() {
    const store = await cookies();
    return store.get("token")?.value;
}