import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";

const useUsers = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);

  console.log(user);
};

export default useUsers;
