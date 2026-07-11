"use client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signOut } from "@/app/actions/auth"
import CornerCutButton from "@/app/components/neonblade-ui/corner-cut-button"
export default function SignOutButton() {
  const router = useRouter()
  const handleSignOut = async () => {
    await signOut()
    toast.success("Signed out successfully")
    router.push("/")
  }

  return (
    <CornerCutButton
      type="submit"
      cornerSize={0}
      size="sm"
      color="cyan"
      variant="outline"
      hoverEffect="default"
      onClick={handleSignOut}
    >
      Logout
      {/* <FcGoogle /> */}
    </CornerCutButton>
  )
}
