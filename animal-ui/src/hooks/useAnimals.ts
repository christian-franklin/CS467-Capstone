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
  availability: string;
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
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    apiClient
      .get<FetchAnimalResponse>("/animals", { signal: controller.signal })
      .then((res) => {
        let filteredAnimals = res.data.results;

        if (
          filterOptions &&
          (filterOptions.animalType.length > 0 ||
            filterOptions.animalBehavior.length > 0)
        ) {
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
        setLoading(false);
        setAnimals(filteredAnimals);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [filterOptions]);

  return { animals, error, isLoading };
};

export default useAnimals;
