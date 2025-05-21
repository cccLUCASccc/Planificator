import { UUID } from "crypto";

export type TodoProps = {
    id: string,
    title: string,
    description: string,
    etiquettes: string[],
    actif: boolean,
    onClick: () => void,
    start: Date,
    end: Date;
}

export default function Todo({title, description, etiquettes, actif, onClick, start, end}: TodoProps) {
  return (
    <div onClick={onClick} className="font-fascinate hover:bg-gray-600 hover:outline outline-4 outline-green-200 border-[5px] border-green-400 rounded-xl relative bg-gray-800 w-[400px] h-[150px] mt-2">
      <div className="rounded-sm absolute -top-4 left-1/2 text-gray-900 -translate-x-1/2 w-2/3 bg-green-400 text-center">
        {title}
      </div>
        <p className="overflow-y-auto h-2/3 m-6 text-gray-200 rounded-sm break-words whitespace-normal">
          {description}
        </p>
      <div className="rounded-sm absolute bottom-2 text-gray-900 translate-y-[20px] left-1/2 -translate-x-1/2 w-4/5 bg-green-400 text-center">
        {"A faire pour le "}
        <strong className="text-red-600">{end.toString()}</strong>
      </div>
    </div>
  );
}
