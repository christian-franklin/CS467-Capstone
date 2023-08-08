import {
  Card,
  CardBody,
  Heading,
  Image,
  Stack,
  Text,
  Divider,
  CardFooter,
  ButtonGroup,
  Button,
  Center,
  useColorModeValue,
  Badge,
  Box,
} from "@chakra-ui/react";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { Animal } from "../hooks/useAnimals";
import { Link } from "react-router-dom";
import { useState } from "react";
import { User } from "../hooks/useUsers";
import apiClient from "~/services/api-client";

interface Props {
  animal: Animal;
  user: User | null;
}

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

const AnimalCard = ({ animal, user }: Props) => {
  const [liked, setLiked] = useState(false);
  const cardBackgroundColor = useColorModeValue("gray.100", "gray.700");
  const cardBorderColor = useColorModeValue("gray.350", "gray.900");

  const handleLike = async () => {
    try {
      const response = await fetch(
        `https://animal-api-dot-cs467-capstone-393117.ue.r.appspot.com/users/${user?.sub}/animals/${animal.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      if (response.ok) {
        setLiked(!liked);
      } else {
        const data = await response.json();
        console.error("Error liking animal:", data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Card
        maxW="sm"
        bg={cardBackgroundColor}
        borderWidth="1px"
        borderColor={cardBorderColor}
      >
        <CardBody>
          <Center>
            <Image
              src={animal.image}
              alt=""
              borderRadius={10}
              overflow="hidden"
              objectFit="cover"
              boxSize="250px"
            />
          </Center>
          <Stack mt="6" spacing="3">
            <Box display="flex" alignItems="center">
              <Heading size="md" mr={2}>
                {animal.name}
              </Heading>
              <Badge colorScheme={getBadgeColor(animal.availability)}>
                {" "}
                {animal.availability}
              </Badge>
            </Box>
            <Text>{animal.description}</Text>
            <Text fontWeight="bold">
              Breed:{" "}
              <Text as="span" fontWeight="normal">
                {animal.breed}
              </Text>{" "}
              | Age:{" "}
              <Text as="span" fontWeight="normal">
                {animal.age}
              </Text>
            </Text>
          </Stack>
        </CardBody>
        <Divider borderWidth="1px" borderColor="gray.500" />
        <CardFooter>
          <ButtonGroup spacing="2">
            <Button
              variant="solid"
              colorScheme={liked ? "red" : "blue"}
              leftIcon={liked ? <BiSolidLike /> : <BiLike />}
              onClick={handleLike}
            >
              Like
            </Button>
            <Button variant="ghost" colorScheme="blue">
              <Link to={`/animal-profile/${animal.id}`}>View Profile</Link>
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </>
  );
};

export default AnimalCard;
