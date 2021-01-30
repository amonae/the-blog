import React, { useState, useEffect, createContext } from "react";
import { gql, useQuery } from "@apollo/client";

export const UserContext = createContext({});

const GET_USER = gql`
  {
    currentUser {
      username
      email
      _id
    }
  }
`;

export function UserProvider(props) {
  // set user state to "null" as default, but Apollo also allows subscriptions. Ex. I'm creating a userLoggedIn subscription in the backend that returns a User type (BUT it's not required, so returning NULL is possible). If no user is logged in, the query will return NULL. Whenever user DOES log in, the subscription will have noticed, and will update the client automatically.

  //Or, instead of using subscriptions, just handle everything on the frontend. Create the login page. User submits their data, IF there are no errors and everything goes through, call the "refetch" function for the GET_USER query (which should now return actual user data instead of null).

  const [user, setUser] = useState(null);
  // const { loading, error, data } = useQuery(GET_USER);

  // useEffect(() => {
  //   async function getUser() {
  //     console.log("fetching!");
  //     let response = await fetch("http://localhost:5000/current", {
  //       credentials: "include",
  //     });
  //     let data = await response.json();
  //     console.log(data);
  //     await setUser(data);
  //   }
  //   getUser();
  // }, []);

  useEffect(() => {
    fetch("http://localhost:5000/current", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setUser(data));
  }, []);

  return (
    <UserContext.Provider
      value={{
        user: user,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}