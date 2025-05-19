"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const pachProfile = async (userId : string, UserName: string, FirstName: string, LastName: string, Phone: string, Address: string, BirthDate: Date) => {
  const supabase = await createClient();
  let user = await supabase.from('Members').select('*').eq('user_id', userId).single();

  console.log(user)

  await supabase.from('Members').update({'UserName': UserName, 'FirstName': FirstName, 'LastName': LastName, 'PhoneNumber': Phone, 'Address': Address, 'BirthDate': BirthDate}).eq('user_id', userId)
  user = await supabase.from('Members').select('*').eq('user_id', userId).single();

  console.log(user)
}

export const getAllTodos = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('Todos').select('*');
  

  if (error) {
    console.error("Erreur lors de la récupération des todos :", error);
    return [];
  }
  console.log(data)
  return data;
};

export const patchTodo = async (
  id: number,
  updates: {
    title?: string;
    description?: string;
    etiquettes?: string[];
    start?: Date;
    end?: Date;
  }
) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("Todos")
    .update({
      title: updates.title,
      description: updates.description,
      etiquettes: updates.etiquettes,
      Start: updates.start,
      End: updates.end,
    })
    .eq("id", id);

  if (error) {
    console.error("Erreur lors de la mise à jour :", error);
    throw error;
  }
};

