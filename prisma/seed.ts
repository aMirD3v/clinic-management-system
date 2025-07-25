import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { username: "reception1" },
    update: {},
    create: {
      username: "reception1",
      password,
      name: "Reception Staff",
      role: "RECEPTION",
    },
  });

  await prisma.user.upsert({
    where: { username: "stockmanager1" },
    update: {},
    create: {
      username: "stockmanager1",
      password,
      name: "Stock Manager",
      role: "STOCK_MANAGER",
    },
  });

  console.log("✅ Seeded reception1 / admin123");
  console.log("✅ Seeded stockmanager1 / admin123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
