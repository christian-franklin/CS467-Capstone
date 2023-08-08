import { useAuth0 } from "@auth0/auth0-react";
import useUsers from "../hooks/useUsers";
import LikedAnimals from "./LikedAnimals";

interface User {
  picture: string;
  name: string;
  email: string;
}

const UserProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0<User>();
  useUsers();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return isAuthenticated && user ? <LikedAnimals /> : null;
};

export default UserProfile;
