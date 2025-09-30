'use client';


import React, { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css"


interface Props {
children: ReactNode;
}


export default function RootLayout({ children }: Props) {
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string;


return (
<html lang="en">
<head />
<body>

<ClerkProvider publishableKey={publishableKey}>
{children}
</ClerkProvider>
</body>
</html>
);
}