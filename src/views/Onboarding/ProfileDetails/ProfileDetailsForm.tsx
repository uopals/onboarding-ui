import { useForm, type SubmitHandler } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
  Input,
  InputGroup,
  Stack,
  Text,
  InputLeftAddon,
  Alert,
  AlertIcon,
  AlertDescription,
  Spinner,
  InputRightElement,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";

import { profileDetailsSchema } from "./profileDetailsValidationSchema";
import { API_BASE_URL } from "../../../constants";
import { useState } from "react";

interface CustomerProfile {
  firstName: string;
  lastName: string;
  phone: string;
  corporationNumber: string;
}

const ProfileDetailsForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, validatingFields },
  } = useForm<CustomerProfile>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      corporationNumber: "",
    },
    resolver: yupResolver(profileDetailsSchema),
    mode: "onBlur",
  });
  console.log("Validating fields: ", validatingFields);
  const onSubmit: SubmitHandler<CustomerProfile> = async (data) => {
    console.log(data);
    setIsSubmitting(true);
    setSubmissionError("");

    await fetch(`${API_BASE_URL}/profile-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, phone: `+1${data.phone}` }),
    })
      .then(async (res) => {
        if (res.status === 400) {
          const { message } = await res.json();
          setSubmissionError(message);
        }
      })
      .catch((errorResponse) => {
        console.log({ errorResponse });
        if (errorResponse.status === 400) {
          setSubmissionError(errorResponse.body.message);
        }
      });
    setIsSubmitting(false);
  };

  return (
    <Box
      padding="6"
      background="white"
      borderWidth="1px"
      borderRadius="md"
      borderColor="gray.200"
    >
      {submissionError && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertDescription>{submissionError}</AlertDescription>
        </Alert>
      )}
      <Text textStyle="2xl">Onboarding Form</Text>
      <form name="profileDetails" onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="4">
          <HStack gap="10">
            <FormControl isInvalid={!!errors.firstName}>
              <FormLabel>First Name</FormLabel>
              <Input {...register("firstName")} borderColor="gray.200" />
              <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.lastName}>
              <FormLabel>Last Name</FormLabel>
              <Input {...register("lastName")} borderColor="gray.200" />
              <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
            </FormControl>
          </HStack>

          <FormControl isInvalid={!!errors.phone}>
            <FormLabel>Phone Number</FormLabel>
            <InputGroup>
              <InputLeftAddon>+1</InputLeftAddon>
              <Input {...register("phone")} placeholder="406-451-5119" />
            </InputGroup>
            <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.corporationNumber}>
            <FormLabel>Corporation Number</FormLabel>
            <InputGroup>
              <Input
                {...register("corporationNumber")}
                borderColor="gray.200"
              />
              {validatingFields.corporationNumber && (
                <InputRightElement>
                  <Spinner color="gray.500" />
                </InputRightElement>
              )}
            </InputGroup>
            <FormErrorMessage>
              {errors.corporationNumber?.message}
            </FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            color="white"
            backgroundColor="gray.900"
            disabled={!isValid}
            isLoading={isSubmitting}
          >
            Submit<span>&#8594;</span>
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ProfileDetailsForm;
