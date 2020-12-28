import { DaoInformation } from "./types";

export const SAVE_DAO_INFORMATION_ACTION = "saveDaoInformation";

interface SaveDaoInformation {
  type: typeof SAVE_DAO_INFORMATION_ACTION;
  payload: {
    userDetails: DaoInformation;
  };
}

export type Action = SaveDaoInformation;
