import { createAction } from "@reduxjs/toolkit";
import { MigrationParams } from "../../services/contracts/baseDAO/types";

export const saveDaoInformation = createAction<MigrationParams>(
  "dao/saveInformation"
);
