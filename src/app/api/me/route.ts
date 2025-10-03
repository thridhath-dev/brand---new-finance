// src/app/api/me/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export const runtime = "nodejs";         // Prisma needs Node runtime (not edge)
export const dynamic = "force-dynamic";  // always run on server

// GET /api/me  -> current user + their transactions
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // ensure a User row exists (adjust fields to your schema)
    const usr = await currentUser();
    const email =
      usr?.emailAddresses?.[0]?.emailAddress ??
      usr?.primaryEmailAddress?.emailAddress ??
      null;

    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { email: email ?? undefined },
      create: {
        clerkId: userId,
        email: email ?? "",
        firstName: usr?.firstName ?? null,
        lastName: usr?.lastName ?? null,
      },
    });

    const transactions = await prisma.transaction.findMany({
      where: { userId: dbUser.id },
      orderBy: { date: "desc" }, // assumes you have a `date` field
    });

    return NextResponse.json(
      {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
        },
        transactions,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/me error", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}

// POST /api/me -> create a new transaction
// body: { amount:number, description:string, type:'income'|'expense', date?:string, category?:string }
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, description, type, date, category } = body ?? {};

    if (typeof amount !== "number" || !description || !type) {
      return NextResponse.json(
        { error: "amount, description and type are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "user_not_found" }, { status: 404 });
    }

    const tx = await prisma.transaction.create({
      data: {
        amount,
        description,
        type,
        category: category ?? null,
        date: date ? new Date(date) : new Date(),
        user: { connect: { id: user.id } },
      },
    });

    return NextResponse.json({ ok: true, transaction: tx }, { status: 201 });
  } catch (err) {
    console.error("POST /api/me error", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
