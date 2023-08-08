import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { useAuth0 } from "@auth0/auth0-react";

export interface User {
  id: number;
  name: string;
  sub: string;
  admin: string | null;
  email: string;
  animals: string[];
}

interface UserResponse {
  results: User[];
}

const useUsers = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { getIdTokenClaims } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idTokenClaims = await getIdTokenClaims();
        if (idTokenClaims) {
          const idToken = idTokenClaims.__raw;
          apiClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${idToken}`;
        }

        setLoading(true);
        const response = await apiClient.get<UserResponse>(
          `/users/${idTokenClaims?.id}`
        );
        setLoading(false);
        setUser(response.data.results[0]);
      } catch (err) {
        setLoading(false);
        setError("An error occurred while fetching user data.");
      }
    };

    fetchData();
  }, [getIdTokenClaims]);
  console.log(user);

  return { user, error, isLoading };
};

export default useUsers;
