import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

export default function ClerkAuth() {

  const { user } = useUser();
  // console.log(user)

  const userData = {
    clerk_user_id: user?.id,
    email: user?.primaryEmailAddress?.emailAddress,
    first_name: user?.firstName,
    last_name: user?.lastName,
    image_url: user?.imageUrl
  }
  // console.log("from clerk data =",userData)

  return (
    <div className="flex items-center gap-4">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
