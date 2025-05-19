import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    await checkOrCreateMember(supabase);
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect('http://localhost:3000/');
}

async function checkOrCreateMember(supabase: SupabaseClient) {
  const { data: userData, error } = await supabase.auth.getUser()
  console.log('hello')
  if (error || !userData?.user){ console.log('User non récupéré.'); return;}

  const user = userData.user

  const { data: member, error: memberError } = await supabase
    .from('Members')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!member) {
    const { error: insertError } = await supabase
      .from('Members')
      .insert([
        {
          user_id: user.id,
          Email: user.email,
        }
      ])

    if (insertError) {
      console.error('Erreur lors de la création du membre:', insertError)
    }
  }
}