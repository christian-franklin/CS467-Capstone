import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAnimals from "../hooks/useAnimals";

interface Animal {
  id: number;
  name: string;
  animal: string;
  breed: string;
  age: number;
  description: string;
  image: string;
}

const AnimalProfile: React.FC = () => {
  const { animals, error } = useAnimals();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const foundAnimal = animals.find((animal) => animal.id === Number(id));
    console.log(foundAnimal);

    setAnimal(foundAnimal || null);
  }, [id, animals]);

  if (!animal) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{animal.name}</h1>
      <img src={animal.image} alt={animal.name} />
      <p>
        {animal.animal} - {animal.breed}
      </p>
      <p>Age: {animal.age}</p>
      <p>{animal.description}</p>
    </div>
  );
};

export default AnimalProfile;
