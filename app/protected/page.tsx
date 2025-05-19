import MemberForm from "@/components/MemberForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: memberData, error: memberError } = await supabase
    .from("Members")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (memberError || !memberData) {
    console.error("Erreur de récupération des données membre", memberError);
    return <div>Une erreur est survenue lors du chargement de vos données.</div>;
  }

  return <MemberForm userData={memberData} />;
}
