import { Grid, GridItem, Show } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import AnimalGrid from "../components/AnimalGrid";
import FilterList from "../components/FilterList";
import { useState } from "react";
import useUsers from "../hooks/useUsers";

const Animals = () => {
  const [animalType, setAnimalType] = useState<string[]>([]);
  const [animalBehavior, setAnimalBehavior] = useState<string[]>([]);
  const { user } = useUsers();

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "aside main"`,
      }}
    >
      <GridItem area="nav">
        <NavBar user={user} />
      </GridItem>
      <Show above="lg">
        <GridItem area="aside" padding="10px">
          <FilterList
            animalType={animalType}
            setAnimalType={setAnimalType}
            animalBehavior={animalBehavior}
            setAnimalBehavior={setAnimalBehavior}
          />
        </GridItem>
      </Show>
      <GridItem area="main">
        <AnimalGrid
          filterOptions={{ animalType, animalBehavior }}
          user={user}
        />
      </GridItem>
    </Grid>
  );
};

export default Animals;
