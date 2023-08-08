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
  CheckboxGroup,
  Checkbox,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

interface AnimalFormState {
  image: string;
  name: string;
  animal: string;
  breed: string;
  age: number;
  description: string;
  disposition: string[];
  date_created: string;
  availability: string;
  shelter_name: string;
  shelter_email: string;
}

const getCurrentDate = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

const CreateAnimal = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formState, setFormState] = useState<AnimalFormState>({
    image: "",
    name: "",
    animal: "",
    breed: "",
    age: 0,
    description: "",
    disposition: [],
    date_created: getCurrentDate(),
    availability: "",
    shelter_name: "",
    shelter_email: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, values: any[]) => {
    setFormState((prev) => ({ ...prev, [name]: values }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formState.disposition.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one disposition.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(
        "https://animal-api-dot-cs467-capstone-393117.ue.r.appspot.com/animals/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Animal created successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
          onCloseComplete: () => {
            navigate("/");
          },
        });
      } else {
        const data = await response.json();
        console.error("Error creating animal:", data.message);
        toast({
          title: "Error",
          description: data.message || "Error creating animal",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("There was an error:", error);
      toast({
        title: "Error",
        description: "There was an unexpected error.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
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

        <FormControl id="animal" isRequired>
          <FormLabel>Animal Type</FormLabel>
          <Select
            name="animal"
            onChange={handleChange}
            value={formState.animal}
          >
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

        <FormControl id="disposition">
          <FormLabel>Disposition</FormLabel>
          <CheckboxGroup
            defaultValue={formState.disposition}
            onChange={(values) => handleCheckboxChange("disposition", values)}
          >
            <Checkbox value="Good with children">Good with children</Checkbox>
            <Checkbox value="Good with other animals">
              Good with other animals
            </Checkbox>
            <Checkbox value="Animal must be leashed at all times">
              Animal must be leashed at all times
            </Checkbox>
          </CheckboxGroup>
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

        <FormControl id="shelter_name" isRequired>
          <FormLabel>Shelter Name</FormLabel>
          <Input
            type="text"
            name="shelter_name"
            onChange={handleChange}
            value={formState.shelter_name}
          />
        </FormControl>

        <FormControl id="shelter_email" isRequired>
          <FormLabel>Shelter Email</FormLabel>
          <Input
            type="email"
            name="shelter_email"
            onChange={handleChange}
            value={formState.shelter_email}
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
