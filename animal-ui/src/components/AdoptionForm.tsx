import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  Spinner,
  Button,
  VStack,
  Box,
  Popover,
  PopoverTrigger,
  PopoverCloseButton,
  PopoverContent,
  PopoverBody,
  useDisclosure,
  PopoverHeader,
  PopoverArrow,
  PopoverFooter,
  ButtonGroup,
  Grid,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import useAnimals from "../hooks/useAnimals";

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

interface FormState {
  email: string;
  fullName: string;
  reasoning: string;
}

const AdoptionForm = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const navigate = useNavigate();
  const initialFormState: FormState = {
    email: "",
    fullName: "",
    reasoning: "",
  };

  const [formInput, setFormInput] = useState(initialFormState);
  const { animals, error } = useAnimals();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

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

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormInput({ ...formInput, [e.target.name]: e.target.value });

  const isError = Object.values(formInput).some((input) => input === "");

  const handleSubmit = () => {
    if (isError) {
    } else {
      toast({
        title: "Adoption request submitted.",
        description: "Thank you for your interest. We'll get back to you soon.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  return (
    <Grid placeItems="center" height="100vh">
      <Box width={{ base: "90%", md: "50%" }}>
        <VStack spacing={5}>
          <FormControl isDisabled mb={4}>
            <FormLabel>Animal Name</FormLabel>
            <Input type="text" value={animal.name} />
          </FormControl>

          <FormControl isInvalid={isError} isRequired mb={4}>
            <FormLabel>Full Name</FormLabel>
            <Input
              type="text"
              name="fullName"
              value={formInput.fullName}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl isInvalid={isError} isRequired mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formInput.email}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl isInvalid={isError} isRequired mb={4}>
            <FormLabel>Reasoning for Adoption</FormLabel>
            <Textarea
              name="reasoning"
              value={formInput.reasoning}
              onChange={handleInputChange}
            />
          </FormControl>

          {isError && (
            <FormErrorMessage>All fields are required.</FormErrorMessage>
          )}

          <VStack spacing={4} mt={6}>
            <ButtonGroup>
              <Button colorScheme="blue" onClick={handleSubmit}>
                Submit
              </Button>
              <Button colorScheme="red" onClick={onToggle}>
                Cancel
              </Button>
            </ButtonGroup>
            <Popover
              returnFocusOnClose={false}
              isOpen={isOpen}
              onClose={onClose}
              placement="end-start"
              closeOnBlur={false}
            >
              <PopoverTrigger>
                <a></a>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader fontWeight="semibold">
                  Confirmation
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>Are you sure you want to cancel?</PopoverBody>
                <PopoverFooter display="flex" justifyContent="flex-end">
                  <ButtonGroup size="sm">
                    <Button variant="outline" onClick={onClose}>
                      No
                    </Button>
                    <Button colorScheme="red" onClick={() => navigate("/")}>
                      Yes
                    </Button>
                  </ButtonGroup>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          </VStack>
        </VStack>
      </Box>
    </Grid>
  );
};

export default AdoptionForm;
