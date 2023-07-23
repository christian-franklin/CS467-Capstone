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
} from "@chakra-ui/react";
import { Animal } from "../hooks/useAnimals";
import { Link } from "react-router-dom";

interface Props {
  animal: Animal;
}

const AnimalCard = ({ animal }: Props) => {
  const cardBackgroundColor = useColorModeValue("gray.100", "gray.1000");
  const cardBorderColor = useColorModeValue("gray.350", "gray.900");

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
            <Heading size="md">{animal.name}</Heading>
            <Text>{animal.description}</Text>
            <Text>
              Breed: {animal.breed} | Age: {animal.age}
            </Text>
          </Stack>
        </CardBody>
        <Divider borderWidth="1px" borderColor="gray.500" />
        <CardFooter>
          <ButtonGroup spacing="2">
            <Button variant="solid" colorScheme="blue">
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
