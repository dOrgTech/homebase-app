import { Button } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { Navbar } from "../components/common/toolbar";

export const Home: React.FC = () => {
  const history = useHistory();

  return (
    <>
      <div>
        Homescreen
        <Button onClick={() => history.push("/creator")}>Creator</Button>
        <Button onClick={() => history.push("/explorer")}>Explorer</Button>
      </div>
    </>
  );
};
