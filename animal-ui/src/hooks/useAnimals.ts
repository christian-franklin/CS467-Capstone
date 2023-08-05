import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { AxiosError } from "axios";

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
  const { getIdTokenClaims } = useAuth0(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idTokenClaims = await getIdTokenClaims();
        if (idTokenClaims) {
          const idToken = idTokenClaims.__raw;
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
        }

        const controller = new AbortController();
        setLoading(true);
        const response = await apiClient.get<FetchAnimalResponse>("/animals", {
          signal: controller.signal,
        });

        let filteredAnimals = response.data.results;

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
      } catch (error) {
        if ((error as AxiosError).isAxiosError) {
          setError((error as AxiosError).message);
        } else {
          // Handle non-Axios error case
          setError("An error occurred");
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [filterOptions, getIdTokenClaims]); // Include getIdTokenClaims here

  return { animals, error, isLoading };
};


export default useAnimals;
