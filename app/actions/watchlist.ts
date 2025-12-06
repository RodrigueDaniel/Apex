'use server'

import { auth } from "@/lib/auth" 
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

export async function toggleWatchlist(symbol: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    // 1. Check if it exists in WATCHLIST
    const existing = await db.watchlist.findUnique({
      where: { 
        userId_symbol: {
          userId: session.user.id,
          symbol: symbol
        }
      }
    });

    if (existing) {
      // 2. Remove
      await db.watchlist.delete({ where: { id: existing.id } });
      revalidatePath('/'); 
      revalidatePath('/market');
      return { status: 'removed' };
    } else {
      // 3. Add
      await db.watchlist.create({
        data: { userId: session.user.id, symbol: symbol }
      });
      revalidatePath('/'); 
      revalidatePath('/market');
      return { status: 'added' };
    }
  } catch (error) {
    console.error(error);
    return { error: "Database error" };
  }
}