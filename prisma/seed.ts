import type { User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import axios from 'axios';

const prisma = new PrismaClient();
const deckFormats = ['standard', 'commander', 'modern'];

const numberOfUsers = 50;
const numberOfUsersWithDecks = 40;

const minFollowersPerUser = 0;
const maxFollowersPerUser = 10;

const minFollowingPerUser = 0;
const maxFollowingPerUser = 10;

const minDecksPerUser = 0;
const maxDecksPerUser = 5;

const numberOfCardsPages = 4;

const minCardsPerDeck = 0;
const maxCardsPerDeck = 40;

const minRatingsPerDeck = 0;
const maxRatingsPerDeck = 10;

const reset = async () => prisma.user.deleteMany({ where: {} });

const createUsers = async () => {
  return Promise.all(
    Array.from({ length: numberOfUsers }, async () => {
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

const getRandomCards = async () => {
  return (
    await Promise.all(
      Array.from({ length: numberOfCardsPages }, async (_v, index) => {
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

const addFollowerNetworkToUsers = async (users: User[]) => {
  return Promise.all(
    users.map(async (user) => {
      const otherUsers = users.filter(({ username }) => username !== user.username);

      const followers = faker.helpers.arrayElements(
        otherUsers,
        faker.datatype.number({ min: minFollowersPerUser, max: maxFollowersPerUser })
      );

      const following = faker.helpers.arrayElements(
        users.filter(({ username }) => username !== user.username),
        faker.datatype.number({ min: minFollowingPerUser, max: maxFollowingPerUser })
      );

      if (followers.length === 0 && following.length === 0) return Promise.resolve(user);

      return prisma.user.update({
        where: { username: user.username },
        data: {
          following: {
            connect: following.map(({ username }) => ({ username })),
          },
          followers: {
            connect: followers.map(({ username }) => ({ username })),
          },
        },
      });
    })
  );
};

const addDecksToUsers = async (users: User[], cardIds: string[]) => {
  const usersWithDecks = faker.helpers.arrayElements(users, numberOfUsersWithDecks);

  return Promise.all(
    usersWithDecks.map(async (user) => {
      const deckCount = faker.datatype.number({ min: minDecksPerUser, max: maxDecksPerUser });
      const deckFormat = faker.helpers.arrayElement(deckFormats);

      await Promise.all(
        Array.from({ length: deckCount }, async () => {
          return prisma.deck.create({
            data: {
              name: faker.company.name(),
              description: faker.datatype.boolean() ? faker.lorem.paragraph() : undefined,
              ownerId: user.id,
              format: deckFormat,
              cards: {
                create: Array.from(
                  { length: faker.datatype.number({ min: minCardsPerDeck, max: maxCardsPerDeck }) },
                  () => {
                    const randomCardId = faker.helpers.arrayElement(cardIds);

                    return {
                      count: faker.datatype.number({
                        min: 1,
                        max: deckFormat === 'commander' ? 1 : 4,
                      }),
                      card: {
                        connectOrCreate: {
                          where: {
                            scryfallId: randomCardId,
                          },
                          create: {
                            scryfallId: randomCardId,
                          },
                        },
                      },
                    };
                  }
                ),
              },
              ratings: {
                create: Array.from(
                  {
                    length: faker.datatype.number({
                      min: minRatingsPerDeck,
                      max: maxRatingsPerDeck,
                    }),
                  },
                  () => ({
                    rating: faker.datatype.number({ min: 1, max: 5 }),
                    raterId: faker.helpers.arrayElement(users.filter(({ id }) => id !== user.id))
                      .id,
                  })
                ),
              },
            },
          });
        })
      );

      return user;
    })
  );
};

const createTestUser = async (users: User[], cardIds: string[]) => {
  const username = 'test-user';
  const password = 'TestUser1234';
  const firstName = 'Test';
  const lastName = 'User';
  const hashedPassword = await bcrypt.hash(password, 10);

  const decks = await prisma.deck.findMany({ where: {}, take: 10 });

  const followers = faker.helpers.arrayElements(users, faker.datatype.number({ min: 1, max: 3 }));
  const following = faker.helpers.arrayElements(users, faker.datatype.number({ min: 1, max: 2 }));

  return prisma.user.create({
    data: {
      username,
      firstName,
      lastName,
      bio: faker.lorem.paragraph(),
      avatarUrl: faker.image.avatar(),
      password: { create: { hash: hashedPassword } },
      ratings: {
        create: Array.from({ length: 10 }, (_, index) => ({
          deckId: decks[index].id,
          rating: faker.datatype.number({ min: 1, max: 5 }),
        })),
      },
      decks: {
        create: Array.from({ length: 5 }, () => {
          const deckFormat = faker.helpers.arrayElement(deckFormats);

          return {
            name: faker.company.name(),
            description: faker.datatype.boolean() ? faker.lorem.paragraph() : undefined,
            format: deckFormat,
            cards: {
              create: Array.from(
                { length: faker.datatype.number({ min: minCardsPerDeck, max: maxCardsPerDeck }) },
                () => {
                  const randomCardId = faker.helpers.arrayElement(cardIds);

                  return {
                    count: faker.datatype.number({
                      min: 1,
                      max: deckFormat === 'commander' ? 1 : 4,
                    }),
                    card: {
                      connectOrCreate: {
                        where: { scryfallId: randomCardId },
                        create: { scryfallId: randomCardId },
                      },
                    },
                  };
                }
              ),
            },
            ratings: {
              create: Array.from(
                {
                  length: faker.datatype.number({ min: minRatingsPerDeck, max: maxRatingsPerDeck }),
                },
                () => ({
                  rating: faker.datatype.number({ min: 1, max: 5 }),
                  raterId: faker.helpers.arrayElement(users).id,
                })
              ),
            },
          };
        }),
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

const seed = async () => {
  try {
    await reset();

    const users = await createUsers();
    const randomCards = await getRandomCards();

    await addDecksToUsers(users, randomCards);
    await addFollowerNetworkToUsers(users);
    await createTestUser(users, randomCards);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
