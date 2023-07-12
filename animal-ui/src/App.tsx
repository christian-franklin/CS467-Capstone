import { Button, ButtonGroup, Grid, GridItem, Show } from "@chakra-ui/react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

function App() {

  const { error } = useAuth0();
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "aside main"`,
      }}
    >
      <GridItem area="nav" bg="coral">
        Nav
      </GridItem>
      <Show above="lg">
        <GridItem area="aside" bg="gold">
          Side bar
        </GridItem>
      </Show>
      <GridItem area="main" bg="dodgerblue">
        main
      </GridItem>
    </Grid>
  );
}

//export default App;
export default withAuthenticationRequired(App, {
  onRedirecting: () => <div>Redirecting you to the login page...</div>
})
