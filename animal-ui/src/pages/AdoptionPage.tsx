import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import AdoptionForm from "../components/AdoptionForm";

const AdoptionPage = () => {
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
        <AdoptionForm />
      </GridItem>
    </Grid>
  );
};

export default AdoptionPage;
