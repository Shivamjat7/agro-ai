import { db } from "../config/database";
import { farms } from "../models/Farm.model";
import { and, eq, isNull } from "drizzle-orm";

export const createFarm = async (
  userId: string,
  payload: any
) => {
  const existingFarm = await db.query.farms.findFirst({
    where: and(
      eq(farms.userId, userId),
      eq(farms.farmName, payload.farmName),
      isNull(farms.deletedAt)
    ),
  });

  if (existingFarm) {
    throw new Error(
      "Farm with this name already exists"
    );
  }

  const [farm] = await db
    .insert(farms)
    .values({
      ...payload,
      userId,
    })
    .returning();

  return farm;
};

export const getAllFarms = async (
  userId: string
) => {
  return db.query.farms.findMany({
    where: and(
      eq(farms.userId, userId),
      isNull(farms.deletedAt)
    ),
  });
};

export const getFarmById = async (
  userId: string,
  farmId: string
) => {
  const farm = await db.query.farms.findFirst({
    where: and(
      eq(farms.id, farmId),
      eq(farms.userId, userId),
      isNull(farms.deletedAt)
    ),
  });

  if (!farm) {
    throw new Error("Farm not found");
  }

  return farm;
};
export const updateFarm = async (
  userId: string,
  farmId: string,
  payload: any
) => {
  const farm = await getFarmById(
    userId,
    farmId
  );

  const [updatedFarm] = await db
    .update(farms)
    .set({
      ...payload,
      updatedAt: new Date(),
    })
    .where(eq(farms.id, farm.id))
    .returning();

  return updatedFarm;
};
export const deleteFarm = async (
  userId: string,
  farmId: string
) => {
  const farm = await getFarmById(
    userId,
    farmId
  );

  await db
    .update(farms)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(farms.id, farm.id));

  return true;
};
