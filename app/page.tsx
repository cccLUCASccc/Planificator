'use client';

import Todo from "@/components/Todo";
import { useEffect, useRef, useState } from "react";
import { getAllTodos, patchTodo } from "./actions";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [etiquettes, setEtiquettes] = useState<string>("");
  const [todosData, setTodosData] = useState<any[]>([]);
  const [Avatar, setAvatar] = useState<string>("");
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);


  useEffect(() => {
    const fetchTodos = async () => {
      const todos = await getAllTodos();
      setTodosData(todos);
    };
    fetchTodos();
  }, []);

  useEffect(() => {
    if (todosData.length > 0) {
      const todo = todosData[activeIndex];
      if (todo) {
        setTitle(todo.title);
        setText(todo.description);
        setEtiquettes(todo.etiquettes.join(", "));
        setAvatar(todo.Avatar?.replace(/(^"|"$)/g, ""));
        setStart(todo.Start)
        setEnd(todo.End)
      }
    }
  }, [activeIndex, todosData]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      const threshold = 50;

      if (distance > threshold) {
        setActiveIndex((prev) =>
          prev < todosData.length - 1 ? prev + 1 : 0
        );
      } else if (distance < -threshold) {
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : todosData.length - 1
        );
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const activeTodo = todosData[activeIndex];
  if (!activeTodo) return;

  const updatedFields = {
    title: title || undefined,
    description: text || undefined,
    etiquettes: etiquettes
      ? etiquettes
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e.length > 0)
      : undefined,
    Start: start?.toISOString(),
    End: end?.toISOString(),
};


  try {
    await patchTodo(activeTodo.id, updatedFields);
    const updatedTodos = await getAllTodos();
    setTodosData(updatedTodos);
  } catch (err) {
    console.error("Erreur lors de la mise à jour :", err);
  }
};


  return (
    <main className="container flex-1 flex flex-col px-4 text-white font-fascinate">
      <div className="h-[600px] w-full grid grid-cols-3 gap-8 sm:gap-4">
        <div className="hover:outline outline-2 outline-green-100 p-4 rounded-md bg-gray-900 max-h-[700px] lg:overflow-y-auto flex flex-row lg:flex-col gap-8 items-stretch justify-start col-start-1 col-end-4 lg:col-end-2">

          {/* Mobile view - swipe support */}
          <div
            className="flex lg:hidden w-full justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {todosData[activeIndex] && (
              <div className="flex flex-col items-center justify-center">
                <img src={Avatar} alt="avatar" className="relative z-50 top-[30px] right-[180px] w-10 h-10 rounded-full" />
                <Todo
                  key={activeIndex}
                  title={todosData[activeIndex].title}
                  description={todosData[activeIndex].description}
                  etiquettes={todosData[activeIndex].etiquettes}
                  actif={true}
                  start={todosData[activeIndex].Start}
                  end={todosData[activeIndex].End}
                  onClick={() => {}}
                />
              </div>
            )}
          </div>

          {/* Desktop view */}
          <div className="hidden lg:flex lg:flex-col gap-4 pb-16">
            {todosData.map((todo, index) => (
              <div key={index}>
                <img src={todo.Avatar?.replace(/(^"|"$)/g, "")} alt="avatar" className="relative top-[30px] z-50 rounded-full h-[80px] w-[80opx]"/>
                <Todo
                  title={todo.title}
                  description={todo.description}
                  etiquettes={todo.etiquettes}
                  actif={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                  start={todosData[activeIndex].Start}
                  end={todosData[activeIndex].End}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="hover:outline outline-2 outline-green-100 rounded-md bg-green-800 h-full flex flex-col items-center justify-around col-start-1 lg:col-start-2 col-end-4">
          <h2 className="text-[20px] lg:text-[50px]">Description de la tâche</h2>
          <form className="rounded-md bg-gray-900 top-[100px] h-full w-3/4 m-4 flex flex-col justify-around items-center gap-4 pb-8 pt-8">
            <input
              className="mt-2 p-6 w-4/5 h-[50px] rounded-md border-[2px] border-green-400 text-center"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="p-6 w-4/5 h-[200px] rounded-md border-[2px] border-green-400 text-start"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex gap-4">
              <input 
                type="date" 
                value={start ? start.toISOString().split("T")[0] : ""}
                onChange={(e) => setStart(new Date(e.target.value))}
                className="rounded-md border-[2px] border-green-400 p-2 bg-gray-800 text-white"
              />
              <input 
                type="date" 
                value={end ? end.toISOString().split("T")[0] : ""}
                onChange={(e) => setEnd(new Date(e.target.value))}
                className="rounded-md border-[2px] border-green-400 p-2 bg-gray-800 text-white"
              />
            </div>

            <input
              className="p-6 w-4/5 h-[50px] rounded-md border-[2px] border-green-400 text-center"
              type="text"
              value={etiquettes}
              onChange={(e) => setEtiquettes(e.target.value)}
            />
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleSubmit}
            >
              Mofify
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
