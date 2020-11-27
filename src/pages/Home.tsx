import { Button } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";

export const Home: React.FC = () => {
  const history = useHistory();

  return (
    <div>
      Homescreen
      <Button onClick={() => history.push("/create/dao")}>Launch App</Button>
    </div>
  );
};
