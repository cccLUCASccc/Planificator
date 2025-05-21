'use client';

import Todo from "@/components/Todo";
import { useEffect, useMemo, useRef, useState } from "react";
import { getAllTodos, patchTodo, deleteTodo, getAllTodoById, getAllUsers } from "./actions";
import CreatePage from "@/components/CreateTasks";
import { Users } from "@/components/User";
import CreateTeam from "@/components/CreateTeam";
import { TypeTodo } from "./types";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [todosData, setTodosData] = useState<TypeTodo[]>([]);
  const [Avatar, setAvatar] = useState<string>("");
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [descriptionVisible, setDescriptionVisibility] = useState<boolean>(false);
  const [createVisible, setCreateVisibility] = useState<boolean>(false);
  const [createTeam, setCreateTeam] = useState<boolean>(false);


  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);


  useEffect(() => {
    const fetchTodos = async () => {
      const todos = await getAllTodoById();
      setTodosData(todos);
    };
    fetchTodos();
  }, []);

  const sortedTodos = useMemo(() => {
    return [...todosData].sort(
      (a: any, b: any) => new Date(a.End).getTime() - new Date(b.End).getTime()
    );
  }, [todosData]);

  useEffect(() => {
  const todo = sortedTodos[activeIndex];
  if (todo) {
    setTitle(todo.title);
    setText(todo.description);
    setAvatar(todo.Avatar?.replace(/(^"|"$)/g, ""));
    setStart(todo.Start ? new Date(todo.Start) : null);
    setEnd(todo.End ? new Date(todo.End) : null);
    console.log(todo.End);
  }
}, [activeIndex, sortedTodos]);


/////////////////////////////////////////////////////////////////////
  // Interaction de l'interface
/////////////////////////////////////////////////////////////////////
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

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = new Date(e.target.value);

    if (start && newEnd < start) {
      alert("La date de fin ne peut pas être antérieure à la date de début");
      setEnd(null);
      return;
    }

    setEnd(newEnd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const activeTodo = todosData[activeIndex];
    if (!activeTodo) return;

    const updatedFields = {
      title: title || undefined,
      description: text || undefined,
      Start: start?.toISOString().split('T')[0] || null,
      End: end?.toISOString().split('T')[0] || null,
  };

    try {
      await patchTodo(activeTodo.id, updatedFields);
      const updatedTodos = await getAllTodos();
      setTodosData(updatedTodos);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
};

  const handleDelete = async (e:React.FormEvent) => {
    e.preventDefault();
    await deleteTodo(todosData[activeIndex].id);

    const updatedTodos = await getAllTodos();
    setTodosData(updatedTodos);
    setActiveIndex(0); 
  };
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

  return (
    <main className="container flex-1 flex flex-col px-4 text-white font-fascinate">
      {(createVisible || descriptionVisible || createTeam) &&
      <div className="h-full w-full z-40 bg-gray-200">

      </div>}
      <aside>
        <div className="flex">
          <button 
          className = "font-fascinate text-white bg-green-700 hover:outline outline-4 hover:bg-green-900 pl-6 pr-6 pt-2 pb-2 rounded-md m-4 outline-green-100"
          onClick={() => setCreateVisibility(true)}
          >
            Create task
          </button>
          <button 
          className = "font-fascinate text-white bg-green-700 hover:outline outline-4 hover:bg-green-900 pl-6 pr-6 pt-2 pb-2 rounded-md m-4 outline-green-100"
          onClick={() => setCreateTeam(true)}
          >
            Create team
          </button>
        </div>
      </aside>
      <div className="h-[600px] w-full grid grid-cols-3 gap-8 sm:gap-4">
        <div className="hover:outline outline-2 outline-green-100 p-4 rounded-md bg-gray-900 max-h-[700px] lg:overflow-y-auto flex flex-row lg:flex-col gap-8 items-stretch justify-start col-start-1 col-end-4 lg:col-end-2">


          {/* Vue des tâches à réaliser */}
          {/* Mobile view - swipe support */}
          <div
            className="flex lg:hidden w-full justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {sortedTodos[activeIndex] && (
              <div className="flex flex-col items-center justify-center">
                <img src={Avatar} alt="avatar" className="relative z-50 top-[30px] right-[180px] w-10 h-10 rounded-full" />
                <Todo
                  key={activeIndex}
                  title={sortedTodos[activeIndex].title}
                  description={sortedTodos[activeIndex].description}
                  etiquettes={sortedTodos[activeIndex].etiquettes}
                  actif={true}
                  start={sortedTodos[activeIndex].Start}
                  end={sortedTodos[activeIndex].End}
                  onClick={() => { } } id={""}                />
              </div>
            )}
          </div>

          {/* Desktop view */}
          <div className="hidden lg:flex lg:flex-col gap-4 pb-16">
            {sortedTodos.map((todo, index) => (
              <div key={index}>
                {Avatar ?
                  (<img src={todo.Avatar?.replace(/(^"|"$)/g, "")} alt="avatar" className="relative top-[30px] z-30 rounded-full h-[80px] w-[80opx]"/>)
                : null
                }
                <Todo
                  title={todo.title}
                  description={todo.description}
                  etiquettes={todo.etiquettes}
                  actif={index === activeIndex}
                  onClick={() => {
                    setActiveIndex(index);
                    setDescriptionVisibility(true);
                  }}
                  start={sortedTodos[activeIndex].Start}
                  end={todo.End} id={""}                />
              </div>
            ))}
          </div>
        </div>

        {/* Menu des utilisateurs et des groupes */}
        <div className="hover:outline outline-2 outline-green-100 p-4 rounded-md bg-gray-900 max-h-[700px] lg:overflow-y-auto flex flex-row lg:flex-col gap-8 items-stretch justify-start col-start-2 col-end-3 lg:col-end-2">
            <Users username="" email="" telephone="" Avatar=""/>
        </div>

        {/* Menu de modification de la tâche. */}
        {descriptionVisible && 
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 w-2/3 z-50 hover:outline outline-2 outline-green-100 rounded-md bg-green-800 h-[700px] flex flex-col items-center justify-around">
            <button
              className="self-end"
              onClick={() => {setDescriptionVisibility(!descriptionVisible);}}
            >
              <img className="h-[50px] w-[50px]" src="/images/croce.png" alt="croce" />
            </button>
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
                value={start ? start.toISOString().split('T')[0] : ""}
                onChange={(e) => setStart(new Date(e.target.value))}
                className="rounded-md border-[2px] border-green-400 p-2 bg-gray-800 text-white"
              />
              <input 
                type="date" 
                value={end ? end.toISOString().split('T')[0] : ""}
                onChange={handleDate}
                className="rounded-md border-[2px] border-green-400 p-2 bg-gray-800 text-white"
              />
            </div>
            <div>
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleSubmit}
              >
                Mofify
              </button>
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </form>
        </div>}

        {createVisible && 
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 w-2/3 z-50 bg-green-800 h-[700px] flex flex-col items-center justify-around">
            <button
                className="self-end"
                onClick={() => {setCreateVisibility(!createVisible);}}
              >
              <img className="h-[50px] w-[50px]" src="/images/croce.png" alt="croce" />
            </button>
          <CreatePage/>
          </div>}

          {createTeam && 
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 w-2/3 z-50 bg-green-800 h-[700px] flex flex-col items-center justify-around">
            <button
                className="self-end"
                onClick={() => {setCreateTeam(!createTeam);}}
              >
              <img className="h-[50px] w-[50px]" src="/images/croce.png" alt="croce" />
            </button>
            <CreateTeam/>
          </div>}

        {/* Calendrier des tâches personnelles. A voir si on garde ou pas. */}
        <div className= "hover:outline outline-2 outline-green-100 p-4 rounded-md bg-gray-900 max-h-[700px] lg:overflow-y-auto flex flex-row lg:flex-col gap-8 items-stretch justify-start col-start-1 col-end-4 lg:col-start-3 lg:col-end-4">
          <p className="h-full ">Ceci est la place du calendrier</p>
        </div>
      </div>
    </main>
  );
}
