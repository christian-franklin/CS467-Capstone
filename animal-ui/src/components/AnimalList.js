import React from 'react';
import { Link } from 'react-router-dom';

const AnimalList = ({ animals }) => (
  <div>
    {animals.map(animal => (
      <div key={animal.id}>
        <h2>{animal.type}: {animal.breed}</h2>
        <Link to={`/animals/${animal.id}`}>View Profile</Link>
      </div>
    ))}
  </div>
);

export default AnimalList;
