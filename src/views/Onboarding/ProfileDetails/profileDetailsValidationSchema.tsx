import * as yup from "yup";

import { API_BASE_URL } from "../../../constants";

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

export const profileDetailsSchema = yup
  .object({
    firstName: yup.string().trim().required().max(50),
    lastName: yup.string().trim().required().max(50),
    phone: yup
      .string()
      .trim()
      .required()
      .length(10, "Phone number must have 10 digits")
      .matches(/^[2-9]\d{9}$/, "Invalid Canadian phone number"),
    corporationNumber: yup
      .string()
      .trim()
      .required()
      .max(9)
      .test(
        "corporationNumberValidityCheck",
        "Invalid corporation number",
        async (value, ctx) => {
          if (!value) {
            return true;
          }

          console.log("VAL: ", value);
          try {
            const validationResponse = await validateCorporationNumber(value);

            return validationResponse.valid;
          } catch (error) {
            console.error(error);
            return ctx.createError({
              message: "Cannot verify corporation number at this time",
            });
          }
        },
      ),
  })
  .required();
