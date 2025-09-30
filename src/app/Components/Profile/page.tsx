// app/profile/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getOrCreateUserFromClerk } from '../../lib/clerksync';

export default async function ProfilePage() {
  const user = await getOrCreateUserFromClerk();

  if (!user) {
    // not authenticated — redirect to sign in
    redirect('/sign-in');
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Profile</h1>
      <p><strong>DB id:</strong> {user?.id}</p>
      <p><strong>Clerk id:</strong> {user?.clerkId}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Name:</strong> {user?.firstName ?? ''} {user?.lastName ?? ''}</p>
      <p><Link href="/">Back to home</Link></p>
    </main>
  );
}
