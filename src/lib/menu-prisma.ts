import { PrismaClient } from "../../generated/menu-client";

declare global {
  // eslint-disable-next-line no-var
  var menuPrisma: PrismaClient | undefined;
}

export const menuPrisma = global.menuPrisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.menuPrisma = menuPrisma;
}
