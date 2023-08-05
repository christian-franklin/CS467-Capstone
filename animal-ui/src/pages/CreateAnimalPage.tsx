import { Grid, GridItem, Show } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import CreateAnimal from "../components/CreateAnimal";

const CreateAnimalPage = () => {
  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "main main"`,
      }}
    >
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <GridItem area="main">
        <CreateAnimal />
      </GridItem>
    </Grid>
  );
};
export default CreateAnimalPage;
