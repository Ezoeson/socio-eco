import { NextResponse } from "next/server";
import fs from "fs";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }
  // Dans app/api/upload/route.ts
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Type de fichier non autorisé" },
      { status: 400 }
    );
  }

  if (file.size > maxSize) {
    return NextResponse.json(
      { error: "Fichier trop volumineux (max 5MB)" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Créez un nom de fichier unique
  const timestamp = Date.now();
  const ext = path.extname(file.name);
  const filename = `enqueteur_${timestamp}${ext}`;

  // Chemin où enregistrer le fichier
  const uploadDir = path.join(process.cwd(), "public/uploads");
  const filePath = path.join(uploadDir, filename);

  try {
    // Créez le répertoire s'il n'existe pas
    await fs.promises.mkdir(uploadDir, { recursive: true });

    // Écrivez le fichier
    await writeFile(filePath, buffer);

    // Retournez seulement le chemin relatif
    return NextResponse.json({
      success: true,
      path: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ success: false });
  }
}
