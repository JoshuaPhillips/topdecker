import { Link } from "@remix-run/react";
import { useCurrentUser } from "~/hooks/misc";

export default function Index() {
  const user = useCurrentUser();

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <nav>
        <ul>
          <li>
            <Link to="/account">Account</Link>
          </li>

          <li>
            <Link to="/users">Users</Link>
          </li>

          <li>
            <Link to="/new">New Deck</Link>
          </li>

          {user ? (
            <li>
              <Link to="me">My Page</Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login">Log In</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            </>
          )}

          <li>
            <Link to="/cards/random">Random Card</Link>
          </li>

          <li>
            <Link to="/cards/search">Search Cards</Link>
          </li>

          <button className="mt-2 rounded bg-blue-100 py-2 px-4">Logout</button>
        </ul>
      </nav>
    </main>
  );
}
