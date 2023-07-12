import React, { useState, useEffect } from "react";
import axios from "axios";

const AnimalProfile = ({ match }) => {
  const [animal, setAnimal] = useState({});

  useEffect(() => {
    const fetchAnimal = async () => {
      const res = await axios.get(`/api/animals/${match.params.id}`);
      setAnimal(res.data);
    };

    fetchAnimal();
  }, [match.params.id]);

  return (
    <div>
      <h1>{animal.type} Profile</h1>
      <img src={animal.pic} alt={animal.type} />
      <h2>Breed: {animal.breed}</h2>
      <h2>Disposition: {animal.disposition.join(", ")}</h2>
      <h2>Availability: {animal.availability}</h2>
      <p>{animal.description}</p>
    </div>
  );
};

export default AnimalProfile;
