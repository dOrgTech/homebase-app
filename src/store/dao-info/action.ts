import { createAction } from "@reduxjs/toolkit";
import { MigrationParams } from "../../contracts/store/dependency/types";

export const saveDaoInformation = createAction<MigrationParams>(
  "dao/saveInformation"
);
