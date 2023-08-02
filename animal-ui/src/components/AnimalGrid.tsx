import { SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import useAnimals from "../hooks/useAnimals";
import AnimalCard from "./AnimalCard";

interface Props {
  filterOptions?: {
    animalType: string[];
    animalBehavior: string[];
  };
}

const AnimalGrid = ({ filterOptions }: Props) => {
  const { animals, error, isLoading } = useAnimals(filterOptions);

  if (isLoading)
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    );
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

export default AnimalGrid;
