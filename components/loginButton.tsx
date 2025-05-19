'use client';

import { createClient } from "@/utils/supabase/client";


export async function signInWithGoogle() {
    const supabase = await createClient();
    console.log("connexion google");
    try {
        const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `http://localhost:3000/auth/callback`,
        },
        });
        if (error) console.error(error.message);
    } catch (error: any) {
        console.log(error.message);
    }
}

export default function LoginButton() {
    return (
        <div className="font-fascinate contaire h-full flex flex-col justify-around">
            <h1 className="text-center text-[20px] lg:text-[50px] text-white">Connect to get accès</h1>
            <button
                className="flex justify-center gap-6 items-center text-center text-white bg-red-600 rounded-xl hover:border-2 pl-6 pr-6 pt-2 pb-2 mt-6 hover:bg-red-700"
                onClick={() => signInWithGoogle()}
                >
                    <img className="h-[50px] w-[50px]" src="https://images.icon-icons.com/2429/PNG/512/google_logo_icon_147282.png" alt="Google" />
                Connect with Google
            </button>
        </div>
    );
}
