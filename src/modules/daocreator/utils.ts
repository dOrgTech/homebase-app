import { ErrorValues, Settings } from "../../contracts/store/dependency/types";

// @TODO: Make it more generic to handle different cases
export const handleErrorMessages = (
  settings: Settings,
  customValidator?: (field: keyof Settings) => boolean
): ErrorValues<Settings> => {
  const errors: ErrorValues<Settings> = {};
  Object.keys(settings).map((field) => {
    const passedCustomValidation =
      customValidator?.(field as keyof Settings) || true;
    if (!settings[field as keyof Settings] && passedCustomValidation) {
      // eslint-disable-next-line
      //@ts-ignore - MUST REMOVE THIS
      errors[field as keyof Settings] = "Required";
    }
  });
  return errors;
};
