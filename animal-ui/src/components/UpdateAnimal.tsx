import { ChangeEvent, useEffect, useState } from "react";
import useAnimals from "../hooks/useAnimals";
import { useNavigate, useParams } from "react-router-dom";
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
  CheckboxGroup,
  Checkbox,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import useUsers from "../hooks/useUsers";

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
  shelter_name: string;
  shelter_email: string;
}

const UpdateAnimal = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { animals, error } = useAnimals();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const { id } = useParams<{ id: string }>();
  const { user } = useUsers();

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

  const handleCheckboxChange = (values: any[]) => {
    setAnimal((prev) => ({ ...prev, disposition: values } as Animal));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!animal) return;

    try {
      const response = await fetch(
        `https://animal-api-dot-cs467-capstone-393117.ue.r.appspot.com/animals/${animal.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(animal),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Animal updated successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
          onCloseComplete: () => {
            navigate("/");
          },
        });
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.message || "Error updating animal",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an unexpected error.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  if (user?.Admin !== "Y") {
    return <Text>User Not Authorized</Text>;
  }
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
            <CheckboxGroup
              defaultValue={animal.disposition}
              onChange={handleCheckboxChange}
            >
              <Checkbox
                value="Good with children"
                isChecked={animal.disposition.includes("Good with children")}
              >
                Good with children
              </Checkbox>
              <Checkbox
                value="Good with other animals"
                isChecked={animal.disposition.includes(
                  "Good with other animals"
                )}
              >
                Good with other animals
              </Checkbox>
              <Checkbox
                value="Animal must be leashed at all times"
                isChecked={animal.disposition.includes(
                  "Animal must be leashed at all times"
                )}
              >
                Animal must be leashed at all times
              </Checkbox>
            </CheckboxGroup>
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

          <FormControl id="shelter_name">
            <FormLabel>Shelter Name</FormLabel>
            <Input
              type="text"
              name="shelter_name"
              onChange={handleChange}
              value={animal.shelter_name}
            />
          </FormControl>

          <FormControl id="shelter_email">
            <FormLabel>Shelter Email</FormLabel>
            <Input
              type="email"
              name="shelter_email"
              onChange={handleChange}
              value={animal.shelter_email}
            />
          </FormControl>

          <Button type="submit">Update Animal</Button>
        </VStack>
      </Flex>
    </>
  );
};

export default UpdateAnimal;
