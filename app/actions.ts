"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signOutAction = async () => {
  const supabase = await createClient()
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

export const createTodo = async (
  title: string,
  description: string,
  startDate?: string,
  endDate?: string
): Promise<void> => {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    console.error('Erreur récupération utilisateur :', userError?.message);
    return;
  }

  const user = userData.user;

  const todo = {
    creator_id: user.id,
    Avatar: user.user_metadata?.avatar_url || null,
    title,
    description,
    ...(startDate && { Start: startDate }),
    ...(endDate && { End: endDate }),
  };

  const { data, error } = await supabase.from('Todos').insert([todo]);

  if (error) {
    console.error('Erreur d’insertion :', error);
  } else {
    console.log('Insertion réussie :', data);
  }
};

export const getAllTodos = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('Todos').select('*');
  

  if (error) {
    console.error("Erreur lors de la récupération des todos :", error);
    return [];
  }
  return data;
};

export const getAllTodoById = async() => {
  const supabase = await createClient();
  const { data:Authuser, error:errorClient } = await supabase.auth.getUser();
  if (errorClient || !Authuser?.user){
    console.error("Impossible d'acceder a auth.");
    return [];
  }
  const UserId = Authuser.user.id;
  const { data, error } = await supabase.from('Todos').select('*').contains("contributors", [UserId])

  if(error){
    console.error(error.message);
    return [];
  }
  return data;
}

export const getAllUsers = async () => {
  const supabase = await createClient();
  const { data:AuthUser, error:userError } = await supabase.auth.getUser();
  if(userError || !AuthUser?.user){
    console.error("Impossible d'accéder au User. 🙁");
    return [];
  }
  const Avatar = AuthUser.user.user_metadata.avatar_url;

  const { data, error } = await supabase.from('Members').select('*')
  if(error){
    console.error("Impossible d'accéder aux infos des users.");
    return [];
  }
  return {'Avatar': Avatar, "Users":data}
}


export const patchTodo = async (
  id: number,
  updates: {
    title?: string;
    description?: string;
    etiquettes?: string[];
    Start?: Date | string | null;
    End?: Date | string | null;
  }
) => {
  const supabase = await createClient();
  console.log(updates)
  const updateData: Record<string, any> = {};
  
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.etiquettes !== undefined) updateData.etiquettes = updates.etiquettes;
  
  if (updates.Start !== undefined) {
    updateData.Start = updates.Start
  }
  
  if (updates.End !== undefined) {
    updateData.End = updates.End
  }

  const { error } = await supabase
    .from("Todos")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Erreur lors de la mise à jour :", error);
    throw error;
  }
};

export const deleteTodo = async (id: number) => {
  const supabase = await createClient()
  await supabase.from('Todos').delete().eq('id', id);
}

export const createTeam = async (TeamName: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from('Teams').insert([{TeamName}]).select();

  if(error){
    console.error('Aucune équipe créée.', error.message, error.details);
    return;
  }
}

