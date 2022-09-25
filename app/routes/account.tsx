import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const meta: MetaFunction = () => ({ title: "Account Route" });

export const loader = ({ request }: LoaderArgs) => {
  return json({});
};

export default function AccountRoute() {
  return <h1>Account Route</h1>;
}
