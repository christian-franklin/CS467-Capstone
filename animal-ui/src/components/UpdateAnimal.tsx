import { ChangeEvent, useEffect, useState } from "react";
import useAnimals from "../hooks/useAnimals";
import { useParams } from "react-router-dom";
import {
  Text,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Spinner,
  Textarea,
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

const UpdateAnimal = () => {
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAnimal((prev) => ({ ...prev, [name]: value } as Animal));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // implement handle form submission logic here -> send to API
    console.log(animal);
  };

  return (
    <>
      {error && <Text>{error}</Text>}

      <Flex justifyContent="center" alignItems="center" minHeight="100vh">
        <VStack
          as="form"
          onSubmit={handleSubmit}
          spacing={4}
          width="1000px"
          p={4}
          boxShadow="md"
          borderRadius="md"
        >
          <FormControl id="image">
            <FormLabel>Image URL</FormLabel>
            <Input
              type="url"
              name="image"
              onChange={handleChange}
              value={animal.image}
            />
          </FormControl>

          <FormControl id="name">
            <FormLabel>Animal Name</FormLabel>
            <Input
              type="text"
              name="name"
              onChange={handleChange}
              value={animal.name}
            />
          </FormControl>

          <FormControl id="animal">
            <FormLabel>Animal Type</FormLabel>
            <Select name="animal" onChange={handleChange} value={animal.animal}>
              <option value="" disabled>
                Please select an option
              </option>
              <option value="cat">Cat</option>
              <option value="dog">Dog</option>
              <option value="other">Other</option>
            </Select>
          </FormControl>

          <FormControl id="breed">
            <FormLabel>Animal Breed</FormLabel>
            <Input
              type="text"
              name="breed"
              onChange={handleChange}
              value={animal.breed}
            />
          </FormControl>

          <FormControl id="age">
            <FormLabel>Age</FormLabel>
            <Input
              type="number"
              name="age"
              onChange={handleChange}
              value={animal.age.toString()}
            />
          </FormControl>

          <FormControl id="description">
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              onChange={handleChange}
              value={animal.description}
            />
          </FormControl>

          <FormControl id="disposition">
            <FormLabel>Disposition</FormLabel>
            <Select
              name="disposition"
              onChange={handleChange}
              value={animal.disposition.join(", ")}
            >
              <option value="" disabled>
                Please select an option
              </option>
              <option value="Good with children">Good with children</option>
              <option value="Good with other animals">
                Good with other animals
              </option>
              <option value="Animal must be leashed at all times">
                Animal must be leashed at all times
              </option>
            </Select>
          </FormControl>

          <FormControl id="availability">
            <FormLabel>Availability</FormLabel>
            <Select
              name="availability"
              onChange={handleChange}
              value={animal.availability}
            >
              <option value="" disabled>
                Please select an option
              </option>
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Not Available">Not available</option>
              <option value="Adopted">Adopted</option>
            </Select>
          </FormControl>

          <Button type="submit">Update Animal</Button>
        </VStack>
      </Flex>
    </>
  );
};

export default UpdateAnimal;
