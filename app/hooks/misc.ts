import type { User } from "@prisma/client";
import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

const isUser = (user: any): user is User => {
  return user && typeof user === "object" && typeof user.username === "string";
};

/**
 * This base hook is used in other hooks to quickly search for specific data across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
const useMatchesData = (id: string): Record<string, unknown> | undefined => {
  const matchingRoutes = useMatches();

  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );

  return route?.data;
};

export const useCurrentUser = (): User | undefined => {
  const data = useMatchesData("root");

  if (!data || !isUser(data.user)) {
    return undefined;
  }

  return data.user;
};
