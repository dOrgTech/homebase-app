import React, { FC, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useCreatorRouteValidation } from "../daocreator/utils";

export const ProtectedRoute: FC = ({ children }) => {
  const history = useHistory();
  const redirectUrl = useCreatorRouteValidation();
  useEffect(() => {
    if (redirectUrl) history.replace(redirectUrl);
  }, []);

  return <React.Fragment>{children}</React.Fragment>;
};
