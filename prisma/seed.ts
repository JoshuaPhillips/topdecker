import type { User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import axios from 'axios';

const prisma = new PrismaClient();

const reset = async () => {
  await prisma.user.deleteMany({ where: {} });
};

const createTestUser = async (users: User[], randomCards: string[]) => {
  const username = 'test-user';
  const password = 'TestUser1234';
  const firstName = 'Test';
  const lastName = 'User';
  const hashedPassword = await bcrypt.hash(password, 10);

  const numberOfFollowers = faker.datatype.number({ min: 1, max: 3 });
  const followers = faker.helpers.arrayElements(
    users.filter(({ username }) => username !== 'test-user'),
    numberOfFollowers
  );

  const numberOfFollowing = faker.datatype.number({ min: 1, max: 2 });
  const following = faker.helpers.arrayElements(
    users.filter(({ username }) => username !== 'test-user'),
    numberOfFollowing
  );

  return prisma.user.create({
    data: {
      username,
      firstName,
      lastName,
      bio: faker.lorem.paragraph(),
      avatarUrl: faker.image.avatar(),
      password: { create: { hash: hashedPassword } },
      decks: {
        create: Array.from({ length: 5 }, () => ({
          name: faker.company.name(),
          description: faker.datatype.boolean() ? faker.lorem.paragraph() : undefined,
          cards: {
            create: Array.from({ length: faker.datatype.number({ min: 10, max: 40 }) }, () => ({
              scryfallId: faker.helpers.arrayElement(randomCards),
            })),
          },
        })),
      },
      followers: {
        connect: followers.map(({ username }) => ({ username })),
      },
      following: {
        connect: following.map(({ username }) => ({ username })),
      },
    },
  });
};

const createUsers = async () => {
  return Promise.all(
    Array.from({ length: 50 }, async () => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const username = faker.internet.userName(firstName, lastName).toLowerCase();

      return prisma.user.create({
        data: {
          username,
          firstName,
          lastName,
          bio: faker.datatype.boolean() ? faker.lorem.paragraph() : undefined,
          avatarUrl: faker.image.avatar(),
          password: {
            create: { hash: bcrypt.hashSync(username.toUpperCase(), 10) },
          },
        },
      });
    })
  );
};

const setupFollowerNetwork = async (users: User[]) => {
  await Promise.all(
    users.map(async (user) => {
      const numberOfFollowers = faker.datatype.number({ min: 0, max: 2 });
      const followers = faker.helpers.arrayElements(
        users.filter(({ username }) => username !== user.username),
        numberOfFollowers
      );

      if (followers.length === 0) return Promise.resolve(user);

      return prisma.user.update({
        where: { username: user.username },
        data: {
          followers: {
            connect: followers.map(({ username }) => ({ username })),
          },
        },
      });
    })
  );

  return Promise.all(
    users.map(async (user) => {
      const numberOfFollowing = faker.datatype.number({ min: 0, max: 3 });
      const following = faker.helpers.arrayElements(
        users.filter(({ username }) => username !== user.username),
        numberOfFollowing
      );

      if (following.length === 0) return Promise.resolve(user);

      return prisma.user.update({
        where: { username: user.username },
        data: {
          following: {
            connect: following.map(({ username }) => ({ username })),
          },
        },
      });
    })
  );
};

const addDecksToUsers = async (users: User[], cardIds: string[]) => {
  // pick 15 random users and create some decks for them
  const usersWithDecks = faker.helpers.arrayElements(users, 15);

  return Promise.all(
    usersWithDecks.map(async ({ id: ownerId }) => {
      const deckCount = faker.datatype.number({ min: 1, max: 5 });

      return Promise.all(
        Array.from({ length: deckCount }, async () => {
          return prisma.deck.create({
            data: {
              name: faker.company.name(),
              description: faker.datatype.boolean() ? faker.lorem.paragraph() : undefined,
              ownerId,
              cards: {
                create: Array.from({ length: faker.datatype.number({ min: 10, max: 40 }) }, () => ({
                  scryfallId: faker.helpers.arrayElement(cardIds),
                })),
              },
            },
          });
        })
      );
    })
  );
};

const getRandomCards = async () => {
  return (
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
};

const seed = async () => {
  try {
    await reset();

    const users = await createUsers();
    const randomCards = await getRandomCards();

    await setupFollowerNetwork(users);
    await addDecksToUsers(users, randomCards);
    await createTestUser(users, randomCards);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
