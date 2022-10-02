import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { logout } from '~/services/session.server';

export const action = async ({ request }: ActionArgs) => {
  console.log(Object.fromEntries(await request.formData()));
  return logout(request);
};

export const loader = async () => {
  return redirect('/');
};
