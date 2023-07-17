import { SimpleGrid, Text } from "@chakra-ui/react";
import AnimalCardContainer from "./AnimalCardContainer";
import useAnimals from "../hooks/useAnimals";
import AnimalCard from "./AnimalCard";

const AnimalProfileGrid = () => {
  const { animals, error } = useAnimals();
  return (
    <>
      {error && <Text>{error}</Text>}
      <SimpleGrid columns={{ sm: 1, md: 3, lg: 3 }} padding="10px" spacing={10}>
        {animals.map((animal) => (
          <AnimalCard key={animal.id} animal={animal} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default AnimalProfileGrid;
