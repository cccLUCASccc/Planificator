'use client';

import { useState } from "react";
import { createTodo } from "@/app/actions";

export default function CreatePage() {
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [etiquettes, setEtiquettes] = useState<string>("");
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createTodo(
        title,
        text,
        start?.toISOString(),
        end?.toISOString()
      );

      setTitle("");
      setText("");
      setEtiquettes("");
      setStart(null);
      setEnd(null);
    } catch (err) {
      console.error("Erreur lors de la création :", err);
    }
  };

  return (
    <div className="text-white font-fascinate container h-full flex flex-col justify-around">
      <h1 className="text-center text-[20px] lg:text-[50px] text-white">Create Task</h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-md bg-gray-900 top-[100px] h-full w-3/4 m-4 flex flex-col justify-center self-center items-center gap-4 pb-8 pt-8"
      >
        <label htmlFor="title">Title</label>
        <input
          className="mt-2 p-6 w-4/5 h-[50px] rounded-md border-[2px] border-green-400 text-center"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          id="title"
        />

        <label htmlFor="description">Description</label>
        <textarea
          className="p-6 w-4/5 h-[200px] rounded-md border-[2px] border-green-400 text-start"
          value={text}
          onChange={(e) => setText(e.target.value)}
          id="description"
        />

        <div className="flex gap-4 items-center flex-col lg:flex-row">
          <label htmlFor="start">Start date</label>
          <input
            type="date"
            value={start ? start.toISOString().split('T')[0] : ""}
            onChange={(e) => setStart(new Date(e.target.value))}
            className="rounded-md border-[2px] border-green-400 p-2 bg-gray-800 text-white"
            id="start"
          />

          <label htmlFor="end">End date</label>
          <input
            type="date"
            value={end ? end.toISOString().split('T')[0] : ""}
            onChange={(e) => setEnd(new Date(e.target.value))}
            className="rounded-md border-[2px] border-green-400 p-2 bg-gray-800 text-white"
            id="end"
          />
        </div>
        
        <div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}