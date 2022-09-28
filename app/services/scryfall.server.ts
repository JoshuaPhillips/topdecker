import axios from "axios";
export type { User } from "@prisma/client";

const instance = axios.create({
  baseURL: "https://api.scryfall.com",
});

export const search = async () => {};
export const getCardById = async () => {};
export const getCardByName = async () => {};

export const getRandomCard = async () => {
  return instance.get(`/cards/random`).then(({ data }) => data);
};
