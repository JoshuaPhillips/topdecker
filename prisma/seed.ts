import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const seed = async () => {
  const email = "rachel@remix.run";
  const password = "racheliscool";

  // cleanup the existing database, no worries if it doesn't exist yet
  await prisma.user.delete({ where: { email } }).catch(() => {});

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { email, password: { create: { hash: hashedPassword } } },
  });

  console.log(`Database has been seeded. 🌱`);
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
