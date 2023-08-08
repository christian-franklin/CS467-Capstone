import { Button, Box, Center } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const ViewFavorites = () => {
  return (
    <Box p={4}>
      <Center>
        <Button variant="ghost" colorScheme="teal">
          <Link to={`/user-favorites`}>View Favorites</Link>
        </Button>
      </Center>
    </Box>
  );
};

export default ViewFavorites;
