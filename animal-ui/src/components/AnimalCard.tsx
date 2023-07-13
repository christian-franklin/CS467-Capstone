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
} from "@chakra-ui/react";
import { Animal } from "../hooks/useAnimals";
import { Link } from "react-router-dom";

interface Props {
  animal: Animal;
}

const AnimalCard = ({ animal }: Props) => {
  return (
    <>
      <Card maxW="sm">
        <CardBody>
          <Image
            src={animal.image}
            alt=""
            borderRadius={10}
            overflow="hidden"
          />
          <Stack mt="6" spacing="3">
            <Heading size="md">{animal.name}</Heading>
            <Text>{animal.description}</Text>
            <Text color="white" fontSize="1xl">
              Breed: {animal.breed} | Age: {animal.age}
            </Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing="2">
            <Button variant="solid" colorScheme="blue">
              Like
            </Button>
            <Button variant="ghost" colorScheme="blue">
              <Link to={`/animal/${animal.id}`}>View Profile</Link>
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </>
  );
};

export default AnimalCard;
