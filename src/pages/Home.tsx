import { Button } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { Navbar } from "../components/common/toolbar";

export const Home: React.FC = () => {
  const history = useHistory();

  return (
    <>
      <Navbar />
      <div>
        Homescreen
        <Button onClick={() => history.push("/create/dao")}>Launch App</Button>
      </div>
    </>
  );
};
