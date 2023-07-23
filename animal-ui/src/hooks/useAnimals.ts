import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";

export interface Animal {
  id: number;
  name: string;
  animal: string;
  breed: string;
  age: number;
  description: string;
  image: string;
  disposition: string[];
  date_created: string;
}

interface FetchAnimalResponse {
  results: Animal[];
}

interface FilterOptions {
  animalType: string[];
  animalBehavior: string[];
}

const useAnimals = (filterOptions?: FilterOptions) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    apiClient
      .get<FetchAnimalResponse>("/pets.json", { signal: controller.signal })
      .then((res) => {
        let filteredAnimals = res.data.results;

        if (filterOptions) {
          const { animalType, animalBehavior } = filterOptions;
          filteredAnimals = filteredAnimals.filter(
            (animal) =>
              (animalType.length === 0 || animalType.includes(animal.animal)) &&
              (animalBehavior.length === 0 ||
                animalBehavior.every((behavior) =>
                  animal.disposition.includes(behavior)
                ))
          );
        }

        setAnimals(filteredAnimals);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });

    return () => controller.abort();
  }, [filterOptions]);

  return { animals, error };
};

export default useAnimals;
