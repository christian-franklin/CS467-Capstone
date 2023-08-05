import React, { ChangeEvent, useState } from "react";
import {
  Input,
  FormControl,
  FormLabel,
  Select,
  Button,
  Textarea,
  VStack,
  Flex,
} from "@chakra-ui/react";

interface AnimalFormState {
  image: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  description: string;
  disposition: string;
  date_created: Date;
  availability: string;
  shelterName: string;
  shelterEmail: string;
}

const CreateAnimal = () => {
  const [formState, setFormState] = useState<AnimalFormState>({
    image: "",
    name: "",
    type: "",
    breed: "",
    age: 0,
    description: "",
    disposition: "",
    date_created: new Date(),
    availability: "",
    shelterName: "",
    shelterEmail: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // implement handle form submission logic -> send to API
    console.log(formState);
  };

  return (
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
        <FormControl id="image" isRequired>
          <FormLabel>Image URL</FormLabel>
          <Input
            type="url"
            name="image"
            onChange={handleChange}
            value={formState.image}
          />
        </FormControl>

        <FormControl id="name" isRequired>
          <FormLabel>Animal Name</FormLabel>
          <Input
            type="text"
            name="name"
            onChange={handleChange}
            value={formState.name}
          />
        </FormControl>

        <FormControl id="type" isRequired>
          <FormLabel>Animal Type</FormLabel>
          <Select name="type" onChange={handleChange} value={formState.type}>
            <option value="" disabled>
              Please select an option
            </option>
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
            <option value="other">Other</option>
          </Select>
        </FormControl>

        <FormControl id="breed" isRequired>
          <FormLabel>Animal Breed</FormLabel>
          <Input
            type="text"
            name="breed"
            onChange={handleChange}
            value={formState.breed}
          />
        </FormControl>

        <FormControl id="age" isRequired>
          <FormLabel>Age</FormLabel>
          <Input
            type="number"
            name="age"
            onChange={handleChange}
            value={formState.age}
          />
        </FormControl>

        <FormControl id="description" isRequired>
          <FormLabel>Animal Description</FormLabel>
          <Textarea
            name="description"
            onChange={handleChange}
            value={formState.description}
          />
        </FormControl>

        <FormControl id="disposition" isRequired>
          <FormLabel>Disposition</FormLabel>
          <Select
            name="disposition"
            onChange={handleChange}
            value={formState.disposition}
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

        <FormControl id="availability" isRequired>
          <FormLabel>Availability</FormLabel>
          <Select
            name="availability"
            onChange={handleChange}
            value={formState.availability}
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

        <FormControl id="shelterName" isRequired>
          <FormLabel>Shelter Name</FormLabel>
          <Input
            type="text"
            name="shelterName"
            onChange={handleChange}
            value={formState.shelterName}
          />
        </FormControl>

        <FormControl id="shelterEmail" isRequired>
          <FormLabel>Shelter Email</FormLabel>
          <Input
            type="email"
            name="shelterEmail"
            onChange={handleChange}
            value={formState.shelterEmail}
          />
        </FormControl>

        <Button type="submit" colorScheme="blue">
          Create Animal
        </Button>
      </VStack>
    </Flex>
  );
};

export default CreateAnimal;
