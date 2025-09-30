import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Sidebar from '../Sidebar/page';
import './globals.css';

export default function Home() {
return (
    <>
<div className="app-shell">
  <header className="app-header">
    <div className="brand">Wigoh</div>
    <div className="header-right">
      <nav className='thri'>
        <Link href="/sign-in">Sign in</Link>
        <Link href="/sign-up">Sign up</Link>
      </nav>
      <div className="auth-state">
        <SignedIn>
          <span className="signed">You are signed in.</span> <UserButton />
        </SignedIn>
        <SignedOut>
          <span className="signed-out">You are signed out.</span>
        </SignedOut>
      </div>
    </div>
  </header>

  <Sidebar/>
</div>
    </>
);
}