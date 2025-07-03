// validation.ts
import { z } from "zod";

export const positiveDecimalSchema = z
  .number()
  .min(0, "Le nombre ne peut pas être négatif")
  .refine(
    (val) => !val.toString().includes("e"),
    "La notation exponentielle n'est pas autorisée"
  );
export const positiveIntegerSchema = z
  .number()
  .min(0, "Le nombre ne peut pas être négatif")
  .refine((val) => Number.isInteger(val), "Le nombre doit être un entier");
export const positiveIntegerOrEmptySchema = z.union([
  positiveIntegerSchema,
  z.literal(""),
]);
