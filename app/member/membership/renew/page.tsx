import { redirect } from "next/navigation"

export default function MemberRenewMembershipRedirectPage() {
  redirect("/membership?source=member-renewal")
}
