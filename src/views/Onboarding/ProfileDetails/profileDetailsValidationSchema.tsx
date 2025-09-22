import * as yup from "yup";
import { debounce } from "lodash";

import { API_BASE_URL, canadianAreaCodes } from "../../../constants";

interface CorporationValidationResponse {
  valid: boolean;
  messsage?: string;
  corportationNumner?: string;
}

const validateCorporationNumber = async (
  corporationNumber: string,
): Promise<CorporationValidationResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/corporation-number/${corporationNumber}`,
  );
  const validationResponse =
    (await response.json()) as CorporationValidationResponse;

  return validationResponse;
};

const corporationNumberValidationTest = async (value: string, ctx: yup.TestContext<yup.AnyObject>) => {
  if (!value) {
    return true;
  }

  try {
    const validationResponse = await validateCorporationNumber(value);

    return validationResponse.valid;
  } catch (error) {
    console.error(error);
    return ctx.createError({
      message: "Unable to verify corporation number.",
    });
  }
};

const debouncedCorporationNumberValidationTest = debounce(corporationNumberValidationTest, 500);

export const profileDetailsSchema = yup
  .object({
    firstName: yup.string().trim().required().max(50),
    lastName: yup.string().trim().required().max(50),
    phone: yup
      .string()
      .trim()
      .required()
      .length(10, "Phone number must have 10 digits")
      .matches(/^[2-9]\d{9}$/, "Invalid Canadian phone number")
      .test({
        name: "Phone area code",
        message: "Invalid Canadian phone number",
        test: (value: string) => {
          const areaCode = value.substring(0, 3);

          return canadianAreaCodes.includes(areaCode);
        },
      }),
    corporationNumber: yup
      .string()
      .trim()
      .required()
      .max(9)
      .test({
        name: "corporationNumberValidityCheck",
        message: "Invalid corporation number",
        exclusive: true,
        test: debouncedCorporationNumberValidationTest
      }),
  })
  .required();
