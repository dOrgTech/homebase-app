import { Validator } from "jsonschema";

const v = new Validator();

export const fromRegistryListFile = async (
  file: File
): Promise<{ key: string; value: string }[]> => {
  const fileReader = new FileReader();
  fileReader.readAsText(file);

  await new Promise<void>(
    (resolve) => (fileReader.onloadend = () => resolve())
  );

  if (fileReader.result === null) {
    throw Error("Unable to read file.");
  }

  const json = fileReader.result as string | ArrayBuffer;
  let parsedJson: Record<string, string>;

  if (typeof json === "string") {
    parsedJson = JSON.parse(json as string);
  } else {
    const decoder = new TextDecoder();
    parsedJson = JSON.parse(decoder.decode(json as ArrayBuffer));
  }

  return Object.keys(parsedJson).map((key) => ({
    key,
    value: parsedJson[key],
  }));
};

const RegistryListSchema = {
  id: "/RegistryList",
  type: "array",
  items: {
    additionalProperties: false,
    properties: {
      key: { type: "string" },
      value: { type: "string" },
    },
  },
  additionalProperties: false,
};

v.addSchema(RegistryListSchema);
export const validateRegistryListJSON = (importedJSON: any) => {
  const validation = v.validate(importedJSON, RegistryListSchema);
  if (validation.errors.length) {
    return validation.errors;
  }

  return [];
};
