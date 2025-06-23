// app/api/membre-famille/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const membres = await prisma.membreFamille.findMany({
      include: {
        enquete: true,
      },
    });
    return NextResponse.json(membres);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch family members" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    
    // Validate enquete exists
    const enqueteExists = await prisma.enquete.findUnique({
      where: { id: json.enqueteId },
    });
    
    if (!enqueteExists) {
      return NextResponse.json(
        { error: "Enquete not found" },
        { status: 404 }
      );
    }

    const membre = await prisma.membreFamille.create({
      data: json,
      include: {
        enquete: true,
      },
    });

    return NextResponse.json({
      message: "Family member created successfully",
      data: membre,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create family member" },
      { status: 500 }
    );
  }
}