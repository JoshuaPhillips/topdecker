import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import axios from "axios";

const prisma = new PrismaClient();

const seed = async () => {
  const username = "test-user";
  const password = "TestUser1234";
  const firstName = "Test";
  const lastName = "User";
  const hashedPassword = await bcrypt.hash(password, 10);

  const randomCardIds = (
    await Promise.all(
      Array.from({ length: 4 }, async (_v, index) => {
        const { data: page } = await axios.get<{ data: { id: string }[] }>(
          `https://api.scryfall.com/cards/search?q=f=modern&page=${index}`
        );

        return page.data;
      })
    )
  )
    .flat()
    .map((card) => card.id);

  // cleanup the existing database, deleting the users will
  // delete the decks and passwords as well
  await prisma.user.deleteMany({ where: {} });
  await prisma.deck.deleteMany({ where: {} });

  //  create a stable / consistent user for testing / development
  await prisma.user.create({
    data: {
      username,
      firstName,
      lastName,
      avatarUrl: faker.image.avatar(),

      password: { create: { hash: hashedPassword } },
      decks: {
        create: Array.from({ length: 5 }, () => ({
          name: faker.company.name(),
          cards: {
            create: Array.from(
              { length: faker.datatype.number({ min: 10, max: 40 }) },
              () => ({
                scryfallId: faker.helpers.arrayElement(randomCardIds),
              })
            ),
          },
        })),
      },
    },
  });

  const users = await Promise.all(
    Array.from({ length: 20 }, async () => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const username = faker.internet
        .userName(firstName, lastName)
        .toLowerCase();

      return prisma.user.create({
        data: {
          username,
          firstName,
          lastName,
          avatarUrl: faker.image.avatar(),
          password: {
            create: { hash: bcrypt.hashSync(username.toUpperCase(), 10) },
          },
        },
      });
    })
  );

  // pick 15 random users and create some decks for them
  const usersWithDecks = faker.helpers.arrayElements(users, 15);

  await Promise.all(
    usersWithDecks.map(async ({ id: ownerId }) => {
      const deckCount = faker.datatype.number({ min: 1, max: 5 });

      return Promise.all(
        Array.from({ length: deckCount }, async () => {
          return prisma.deck.create({
            data: {
              name: faker.company.name(),
              ownerId,
              cards: {
                create: Array.from(
                  { length: faker.datatype.number({ min: 10, max: 40 }) },
                  () => ({
                    scryfallId: faker.helpers.arrayElement(randomCardIds),
                  })
                ),
              },
            },
          });
        })
      );
    })
  );
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
