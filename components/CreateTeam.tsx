'use client';

import { useState } from "react";
import { createTeam } from "@/app/actions";

export default function CreateTeam() {
  const [nbCaracteres, setNbCaracteres] = useState<number>(0);
  const [teamName, setTeamName] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTeamName(value);
    setNbCaracteres(value.length);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (nbCaracteres > 20) return;

    createTeam(teamName);
    console.log("Créer équipe :", teamName);
    setTeamName("");
    setNbCaracteres(0);
  };

  return (
    <div className="text-white font-fascinate container h-full flex flex-col justify-around">
      <form
        onSubmit={handleSubmit}
        className="rounded-md bg-gray-900 top-[100px] h-full w-3/4 m-4 flex flex-col justify-center self-center items-center gap-4 pb-8 pt-8"
      >
        <label htmlFor="Name" className="text-2xl">Team Name</label>

        <textarea
          className="p-6 w-4/5 h-[80px] text-4xl rounded-md border-[2px] border-green-400 text-start text-black"
          id="Name"
          value={teamName}
          onChange={handleChange}
          maxLength={50}
        />

        <p className={`text-sm ${nbCaracteres > 20 ? "text-red-400" : "text-green-400"}`}>
          {nbCaracteres} / 20 caractères max
        </p>

        <button
          type="submit"
          disabled={nbCaracteres > 20 || nbCaracteres === 0}
          className={`mt-4 px-4 py-2 rounded text-white transition-all 
            ${nbCaracteres > 20 || nbCaracteres === 0
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"}`}
        >
          Créer l'équipe
        </button>
      </form>
    </div>
  );
}
