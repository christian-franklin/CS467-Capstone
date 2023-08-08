import { Grid, GridItem, Show } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import UpdateAnimal from "../components/UpdateAnimal";
import useUsers from "../hooks/useUsers";

const CreateAnimalPage = () => {
  const { user } = useUsers();

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "main main"`,
      }}
    >
      <GridItem area="nav">
        <NavBar user={user} />
      </GridItem>
      <GridItem area="main">
        <UpdateAnimal />
      </GridItem>
    </Grid>
  );
};
export default CreateAnimalPage;
