"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface IInterpretation {
  $id: string;
  term: string;
  interpretation: string;
}

export default function Home() {
  const [interpretations, setInterpretations] = useState<IInterpretation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Fixed type definition here

  useEffect(() => {
    const fetchInterpretations = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching interpretations..."); 
        const response = await fetch("/api/interpretations");
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error("Failed to fetch interpretations");
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setInterpretations(data);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load interpretations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterpretations();
  }, []);

  const handleDelete = async (id:string) => {
    try {
      await fetch (`/api/interpretations/${id}`,{method: "DELETE"});
      setInterpretations((prevInterpretations) => prevInterpretations?.filter((i) => i.$id !==id)
    );
    } catch (error) {
      setError("Faild to Delete interpretatios  try again ")
    }
  };

  return (
    <div>
      {error && <p className="py-4 text-red-500">{error}</p>}
      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          <p>Loading...</p>
        </div>
      ) : interpretations?.length > 0 ? (
        <div>
          {interpretations?.map((interpretation) => (
            <div
              key={interpretation.$id}
              className="p-4 my-2 rounded-md border-b leading-8"
            >
              <div className="font-bold ">{interpretation.term}</div>
              <div className="">{interpretation.interpretation}</div>
              <div className="flex gap-4 mt-4 justify-end">
                <Link
                  className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                  href={`/edit/${interpretation.$id}`}
                >
                  Edit
                </Link>
                <button onClick={() => handleDelete(interpretation.$id)} className="bg-red-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ): (
        <p>No interpretation Found</p>
      )}
    </div>
  );
}