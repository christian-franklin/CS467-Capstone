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
import { AiOutlineHeart, AiFillDelete } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { Animal } from "../hooks/useAnimals";
import { Link } from "react-router-dom";
import { useState } from "react";
import { User } from "../hooks/useUsers";
import apiClient from "../services/api-client";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {
  animal: Animal;
  user: User | null;
  onDelete: (animalId: number) => Promise<void>;
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

const AnimalCard = ({ animal, user, onDelete }: Props) => {
  const [liked, setLiked] = useState(
    user &&
      Array.isArray(user.animals) &&
      user.animals.includes(animal.id.toString())
  );

  const cardBackgroundColor = useColorModeValue("gray.100", "gray.700");
  const cardBorderColor = useColorModeValue("gray.350", "gray.900");
  const { getIdTokenClaims } = useAuth0();

  const handleLike = async () => {
    try {
      const idTokenClaims = await getIdTokenClaims();
      const idToken = idTokenClaims?.__raw;

      const method = liked ? "DELETE" : "PATCH";

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
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this animal?"
    );
    if (!confirmation) {
      return;
    }
    onDelete(animal.id);
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
              justifyContent="center"
              alignItems="center"
              onClick={handleLike}
            >
              {liked ? <Box as={FcLike} /> : <Box as={AiOutlineHeart} />}
            </Button>

            <Button variant="ghost" colorScheme="blue">
              <Link to={`/animal-profile/${animal.id}`}>View Profile</Link>
            </Button>

            {user?.Admin === "Y" && (
              <Button variant="ghost" colorScheme="teal">
                <Link to={`/update-animal/${animal.id}`}>Update</Link>
              </Button>
            )}

            {user?.Admin === "Y" && (
              <Button variant="ghost" colorScheme="red" onClick={handleDelete}>
                <Box as={AiFillDelete} />
              </Button>
            )}
          </ButtonGroup>
        </CardFooter>
      </Card>
    </>
  );
};

export default AnimalCard;
