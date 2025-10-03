import { SignIn } from "@clerk/nextjs";
import "./style.css"; 

export default function SignInPage() {
  return (
    <div >
      <div >
        <div className="thri">
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
    </div>
  );
}
