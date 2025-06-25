import { PrismaClient } from "@prisma/client";
import { unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const enqueteur = await prisma.enqueteur.findUnique({
      where: { id: id },
      include: {
        enquetes: true,
      },
    });

    if (!enqueteur) {
      return NextResponse.json(
        { error: "Enqueteur not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(enqueteur);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch enqueteur" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await request.json();
    if (!json.image) {
      delete json.image;
    }

    const enqueteurExists = await prisma.enqueteur.findUnique({
      where: { id: id },
    });

    if (!enqueteurExists) {
      return NextResponse.json(
        { error: "Enqueteur not found" },
        { status: 404 }
      );
    }

    // Check for unique fields
    if (!json.code && !json.email) {
      return NextResponse.json(
        { error: "Code or email must be provided" },
        { status: 400 }
      );
    }

    if (json.code && json.code !== enqueteurExists.code) {
      const existingByCode = await prisma.enqueteur.findUnique({
        where: { code: json.code },
      });
      if (existingByCode) {
        return NextResponse.json(
          { error: "Enqueteur with this code already exists" },
          { status: 400 }
        );
      }
    }

    if (json.email && json.email !== enqueteurExists.email) {
      const existingByEmail = await prisma.enqueteur.findUnique({
        where: { email: json.email },
      });
      if (existingByEmail) {
        return NextResponse.json(
          { error: "Enqueteur with this email already exists" },
          { status: 400 }
        );
      }
    }

    const updatedEnqueteur = await prisma.enqueteur.update({
      where: { id: id },
      data: json,
      include: {
        enquetes: true,
      },
    });

    return NextResponse.json({
      message: "Enqueteur updated successfully",
      data: updatedEnqueteur,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update enqueteur" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const enqueteur = await prisma.enqueteur.findUnique({
      where: { id: id },
    });

    if (!enqueteur) {
      return NextResponse.json(
        { error: "Enqueteur not found" },
        { status: 404 }
      );
    }

    await prisma.enqueteur.delete({
      where: { id: id },
    });

    if (enqueteur?.image) {
      const imagePath = path.join(process.cwd(), "public", enqueteur.image);
      try {
        await unlink(imagePath);
      } catch (err) {
        console.error("Erreur lors de la suppression de l'image:", err);
      }
    }

    return NextResponse.json({
      message: "Enqueteur deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete enqueteur" },
      { status: 500 }
    );
  }
}
