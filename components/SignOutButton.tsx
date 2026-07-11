import { signOut } from "@/app/actions/auth"
import CornerCutButton from "@/app/components/neonblade-ui/corner-cut-button"
export default function SignOutButton() {
  return (
    <form action={signOut}>
      <CornerCutButton
        type="submit"
        cornerSize={0}
        size="sm"
        color="cyan"
        variant="outline"
        hoverEffect="default"
      >
        Logout
        {/* <FcGoogle /> */}
      </CornerCutButton>
    </form>
  )
}
