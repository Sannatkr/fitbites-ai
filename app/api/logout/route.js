// app/api/auth/logout/route.js
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();

  // Delete all possible auth cookie names
  cookieStore.delete("token");
  cookieStore.delete("user-token");
  cookieStore.delete("authToken");
  cookieStore.delete("jwt");
  cookieStore.delete("session");
  cookieStore.delete(".session.token");

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
