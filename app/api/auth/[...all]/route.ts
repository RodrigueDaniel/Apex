import { auth } from "@/lib/auth"; // Make sure this path points to your lib/auth.ts
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);