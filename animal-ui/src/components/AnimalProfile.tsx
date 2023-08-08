import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAnimals from "../hooks/useAnimals";
import {
  Badge,
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
import { BiLike } from "react-icons/bi";
import { useAuth0 } from "@auth0/auth0-react";
import useUsers from "../hooks/useUsers";
import { AiOutlineHeart } from "react-icons/ai";
import { FcLike } from "react-icons/fc";

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
  const { user } = useUsers();
  const { getIdTokenClaims } = useAuth0();
  const { animals, error } = useAnimals();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const { id: paramId } = useParams<{ id: string }>();
  const id = paramId || "";
  const [liked, setLiked] = useState(user?.animals.includes(id));

  const getBadgeColor = (availability: string) => {
    switch (availability) {
      case "Adopted":
        return "green";
      case "Pending":
        return "yellow";
      case "Not Available":
        return "red";
      case "Available":
        return "blue";
      default:
        return "gray";
    }
  };

  useEffect(() => {
    setLiked(user?.animals.includes(id));
  }, [user, id]);

  useEffect(() => {
    const foundAnimal = animals.find(
      (animal) => Number(animal.id) === Number(id)
    );

    setAnimal(foundAnimal || null);
  }, [id, animals]);

  const handleLike = async () => {
    try {
      const idTokenClaims = await getIdTokenClaims();
      const idToken = idTokenClaims?.__raw;

      const method = liked ? "DELETE" : "PATCH";
      if (animal) {
        const response = await fetch(
          `https://animal-api-dot-cs467-capstone-393117.ue.r.appspot.com/users/${user?.id}/animals/${animal.id}`,
          {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (response.ok) {
          console.log(response);
          setLiked(!liked); // Toggle the liked state
        } else {
          const data = await response.json();
          console.error("Error updating animal like status:", data);
        }
      } else {
        console.error("Animal is null or undefined");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
            <Badge colorScheme={getBadgeColor(animal.availability)}>
              {" "}
              {animal.availability}
            </Badge>
            <List spacing={2}>
              <ListItem>{animal.breed}</ListItem>
              <ListItem>Age: {animal.age}</ListItem>
              <ListItem>{animal.description}</ListItem>
            </List>
            <HStack spacing={4}>
              <ButtonGroup spacing="2">
                <Button
                  variant="solid"
                  colorScheme={liked ? "red" : "blue"}
                  justifyContent="center"
                  alignItems="center"
                  onClick={handleLike}
                >
                  {liked ? <Box as={FcLike} /> : <Box as={AiOutlineHeart} />}
                </Button>

                {(animal.availability === "Available" ||
                  animal.availability === "Pending") && (
                  <Button variant="ghost" colorScheme="pink">
                    <Link href={`/adopt-me/${animal.id}`}>Adopt Me!</Link>
                  </Button>
                )}
              </ButtonGroup>
            </HStack>
          </VStack>
        </HStack>
      </Flex>
    </>
  );
};

export default AnimalProfile;
