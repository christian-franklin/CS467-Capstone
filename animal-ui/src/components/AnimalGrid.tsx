import { SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import useAnimals from "../hooks/useAnimals";
import AnimalCard from "./AnimalCard";
import { User } from "../hooks/useUsers";

interface Props {
  filterOptions?: {
    animalType: string[];
    animalBehavior: string[];
  };
  user: User | null;
}

const AnimalGrid = ({ filterOptions, user }: Props) => {
  const { animals, error, isLoading, deleteAnimal } = useAnimals(filterOptions);

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
          <AnimalCard
            key={animal.id}
            animal={animal}
            user={user}
            onDelete={deleteAnimal}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default AnimalGrid;
