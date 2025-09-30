import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <SignUp 
          routing="hash"  // Add this prop
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-500 text-white',
              card: 'shadow-lg',
            }
          }}
        />
      </div>
    </div>
  )
}