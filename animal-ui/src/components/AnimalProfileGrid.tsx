import { SimpleGrid, Text } from "@chakra-ui/react";
import AnimalProfileCardContainer from "./AnimalProfileCardContainer";
import useAnimals from "../hooks/useAnimals";

const AnimalProfileGrid = () => {
  const { animals, error } = useAnimals();
  return (
    <>
      {error && <Text>{error}</Text>}
      <ul>
        {animals.map((animal) => (
          <li key={animal.id}>{animal.name}</li>
        ))}
      </ul>
    </>
  );
};

export default AnimalProfileGrid;
