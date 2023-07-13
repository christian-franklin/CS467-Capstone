import { SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import AnimalProfileCardContainer from "./AnimalProfileCardContainer";

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

const AnimalProfileGrid = () => {
  const [animal, setAnimal] = useState<Animal[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get<FetchAnimalResponse>("/pets.json")
      .then((res) => setAnimal(res.data.results))
      .catch((err) => setError(err.message));
  }, []);

  return (
    /*
    <SimpleGrid
      columns={{ sm: 1, md: 1, lg: 1 }}
      padding="10px"
      spacing={3}
    >
        
    </SimpleGrid>
    */
    <>
      {error && <Text>{error}</Text>}
      <ul>
        {animal.map((animal) => (
          <li key={animal.id}>{animal.name}</li>
        ))}
      </ul>
    </>
  );
};

export default AnimalProfileGrid;
