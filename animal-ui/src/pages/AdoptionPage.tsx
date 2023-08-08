import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import AdoptionForm from "../components/AdoptionForm";
import useUsers from "../hooks/useUsers";

const AdoptionPage = () => {
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
        <AdoptionForm />
      </GridItem>
    </Grid>
  );
};

export default AdoptionPage;
