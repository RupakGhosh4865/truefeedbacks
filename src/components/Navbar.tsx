'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="p-4 md:p-6 bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 shadow-lg text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-3xl font-extrabold tracking-wide mb-4 md:mb-0 hover:scale-105 transition-transform duration-300">
          True Feedback
        </a>
        {session ? (
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold">
              Welcome, {user.username || user.email}
            </span>
            <Button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-400 text-white py-2 px-6 rounded-lg transition-colors duration-300 ease-in-out shadow-md transform hover:scale-105"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
           <Button
  className="bg-teal-600 hover:bg-teal-500 text-white py-2 px-6 rounded-lg transition-colors duration-300 ease-in-out shadow-md transform hover:scale-105"
>
  Login
</Button>

          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
