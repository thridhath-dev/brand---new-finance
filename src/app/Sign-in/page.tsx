import { SignIn } from "@clerk/nextjs";
import "./style.css"; 

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <SignIn
          routing="hash"
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-500 text-white",
              card: "shadow-lg",
            },
          }}
        />
      </div>
    </div>
  );
}
