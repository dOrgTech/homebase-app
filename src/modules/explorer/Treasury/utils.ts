import { Validator } from "jsonschema";
import { FormTransferParams } from "../Treasury/components/NewTreasuryProposalDialog";

const v = new Validator();

export const fromMigrationParamsFile = async (
  file: File
): Promise<FormTransferParams[]> => {
  const fileReader = new FileReader();
  fileReader.readAsText(file);

  await new Promise<void>(
    (resolve) => (fileReader.onloadend = () => resolve())
  );

  if (fileReader.result === null) {
    throw Error("Unable to read file.");
  }

  const json = fileReader.result as string | ArrayBuffer;
  if (typeof json === "string") {
    return JSON.parse(json as string);
  } else {
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(json as ArrayBuffer));
  }
};

const TransactionsSchema = {
  id: "/Transaction",
  type: "array",
  items: {
    additionalProperties: false,
    properties: {
      amount: { type: "number" },
      recipient: { type: "string" },
    },
  },
};

v.addSchema(TransactionsSchema);
export const validateTransactionsJSON = (importedJSON: any) => {
  const validation = v.validate(importedJSON, TransactionsSchema);
  if (validation.errors.length) {
    return validation.errors;
  }

  return [];
};
