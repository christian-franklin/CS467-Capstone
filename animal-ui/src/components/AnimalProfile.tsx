import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAnimals from "../hooks/useAnimals";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Divider,
  Flex,
  HStack,
  Heading,
  Image,
  Link,
  List,
  ListItem,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";

interface Animal {
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

const AnimalProfile = () => {
  const { animals, error } = useAnimals();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const foundAnimal = animals.find(
      (animal) => Number(animal.id) === Number(id)
    );

    setAnimal(foundAnimal || null);
  }, [id, animals]);

  if (!animal) {
    return (
      <Flex justifyContent="center" alignItems="center" height="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <>
      {error && <Text>{error}</Text>}

      <Flex justifyContent="center" alignItems="center" height="60vh">
        <HStack spacing="36px">
          <Box boxSize="300px">
            <Image
              src={animal.image}
              alt={animal.name}
              width="100%"
              height="100%"
              objectFit="cover"
            />
          </Box>
          <Center height="350px">
            <Divider
              orientation="vertical"
              borderWidth="1px"
              borderColor="gray.500"
            />
          </Center>
          <VStack align="start" spacing="4">
            <Heading as="h2" size="xl">
              {animal.name}
            </Heading>
            <List spacing={2}>
              <ListItem>{animal.breed}</ListItem>
              <ListItem>Age: {animal.age}</ListItem>
              <ListItem>{animal.description}</ListItem>
            </List>
            <HStack spacing={4}>
              <ButtonGroup spacing="2">
                <Button variant="solid" colorScheme="blue">
                  Like
                </Button>
                <Button variant="ghost" colorScheme="pink">
                  <Link href={`/adopt-me/${animal.id}`}>Adopt Me!</Link>
                </Button>
              </ButtonGroup>
            </HStack>
          </VStack>
        </HStack>
      </Flex>
    </>
  );
};

export default AnimalProfile;
