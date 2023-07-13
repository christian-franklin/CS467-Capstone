import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";

interface Animal {
  id: number;
  name: string;
  animal: string;
  breed: string;
  age: number;
  description: string;
}

interface FetchAnimalResponse {
  results: Animal[];
}

const useAnimals = () => {
  const [animals, setAnimal] = useState<Animal[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    apiClient
      .get<FetchAnimalResponse>("/pets.json", { signal: controller.signal })
      .then((res) => setAnimal(res.data.results))
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });
    return () => controller.abort();
  }, []);

  return { animals, error };
};

export default useAnimals;
