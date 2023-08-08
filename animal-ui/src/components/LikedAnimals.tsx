import useUsers from "../hooks/useUsers";
import useAnimals from "../hooks/useAnimals";
import { SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import AnimalCard from "./AnimalCard";

const LikedAnimals = () => {
  const { animals, error, isLoading, deleteAnimal } = useAnimals();
  const { user } = useUsers();

  const likedAnimals = animals.filter((animal) =>
    user?.animals.includes(animal.id.toString())
  );

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

  if (likedAnimals.length === 0) return <Text>No liked animals found.</Text>;

  return (
    <>
      {error && <Text>{error}</Text>}
      <SimpleGrid columns={{ sm: 1, md: 3, lg: 3 }} padding="10px" spacing={10}>
        {likedAnimals.map((animal) => (
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

export default LikedAnimals;
