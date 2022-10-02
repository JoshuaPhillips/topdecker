import { useState } from 'react';
import { json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { requireUserId } from '~/services/session.server';
import { getUserById } from '~/services/user.server';
import type { LoaderArgs, MetaFunction, ActionArgs } from '@remix-run/node';

type SettingsPage = 'personal-info' | 'preferences' | 'followers' | 'security';

export const meta: MetaFunction = () => ({ title: 'Account Route' });

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (!user) throw new Error(`Cannot find user with ID ${userId}`);

  return json({ user });
};

export const action = async ({ request }: ActionArgs) => {
  const test = await request.formData();
  console.log(Object.fromEntries(test));

  return null;
};

export default function AccountRoute() {
  const { user } = useLoaderData<typeof loader>();
  const [settingsPage, setSettingsPage] = useState<SettingsPage>('personal-info');

  return (
    <>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <hr />

      <main>
        <section>
          <h1 id='account-settings-navigation'>Account Settings</h1>

          <nav aria-describedby='account-settings-navigation'>
            <menu>
              <li>
                <button onClick={() => setSettingsPage('personal-info')}>Personal Info</button>
              </li>

              <li>
                <button onClick={() => setSettingsPage('preferences')}>Preferences</button>
              </li>

              <li>
                <button onClick={() => setSettingsPage('followers')}>Followers / Following</button>
              </li>

              <li>
                <button onClick={() => setSettingsPage('security')}>Security</button>
              </li>
            </menu>
          </nav>

          <Form method='post' action='/logout'>
            <button type='submit'>Log Out</button>
          </Form>
        </section>

        <hr />

        <section>
          {settingsPage === 'personal-info' && (
            <>
              <h2>Personal Info</h2>
              <input type='hidden' name='__form' value='personal-info' />

              <Form method='post'>
                <label>
                  First Name
                  <input name='first-name' defaultValue={user.firstName || ''} />
                </label>

                <label>
                  Last Name
                  <input name='last-name' defaultValue={user.lastName || ''} />
                </label>

                <label>
                  Username
                  <input name='username' defaultValue={user.username} required />
                </label>

                <label>
                  Bio
                  <input type='textarea' name='biography' defaultValue={user.bio || ''} />
                </label>

                <button type='submit'>Update</button>
              </Form>
            </>
          )}

          {settingsPage === 'followers' && <h2>Followers / Following</h2>}
          {settingsPage === 'preferences' && <h2>Preferences</h2>}

          {settingsPage === 'security' && (
            <>
              <h2>Security</h2>

              <h3>Change Password</h3>

              <Form method='post'>
                <input type='hidden' name='__form' value='change-password' />

                <label>
                  Current Password
                  <input type='password' name='current-password' required />
                </label>

                <label>
                  New Password
                  <input type='password' name='new-password' required />
                </label>

                <label>
                  Confirm Password
                  <input type='password' name='confirm-password' required />
                </label>

                <button type='submit'>Change</button>
              </Form>

              <h3>Delete Account</h3>
            </>
          )}
        </section>
      </main>
    </>
  );
}
