import { useForm, type SubmitHandler } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
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

interface Props {
  onContinue?: () => void;
}

const ProfileDetailsForm: React.FC<Props> = ({ onContinue }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
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
  const onSubmit: SubmitHandler<CustomerProfile> = async (data) => {
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
        if (errorResponse.status === 400) {
          setSubmissionError(errorResponse.body.message);
        }
      });
    setIsSubmitting(false);
    reset();

    if (onContinue) {
      onContinue();
    }
  };

  return (
    <Box
      padding="6"
      background="white"
      borderWidth="1px"
      borderRadius="lg"
      borderColor="gray.200"
    >
      {submissionError && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertDescription>{submissionError}</AlertDescription>
        </Alert>
      )}
      <Text fontSize="2xl" paddingBottom="4">
        Onboarding Form
      </Text>
      <form name="profileDetails" onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <HStack spacing="10">
            <FormControl isInvalid={!!errors.firstName}>
              <FormLabel fontSize="sm">First Name</FormLabel>
              <Input {...register("firstName")} borderColor="gray.200" />
              <Box height="12px" color="red.500" fontSize="xs" textAlign="left">
                {errors.firstName?.message}
              </Box>
            </FormControl>

            <FormControl isInvalid={!!errors.lastName}>
              <FormLabel fontSize="sm">Last Name</FormLabel>
              <Input {...register("lastName")} borderColor="gray.200" />
              <Box height="15px" color="red.500" fontSize="xs" textAlign="left">
                {errors.lastName?.message}
              </Box>
            </FormControl>
          </HStack>

          <FormControl isInvalid={!!errors.phone}>
            <FormLabel fontSize="sm">Phone Number</FormLabel>
            <InputGroup>
              <InputLeftAddon>+1</InputLeftAddon>
              <Input {...register("phone")} placeholder="406-451-5119" />
            </InputGroup>
            <Box height="15px" color="red.500" fontSize="xs" textAlign="left">
              {errors.phone?.message}
            </Box>
          </FormControl>

          <FormControl isInvalid={!!errors.corporationNumber}>
            <FormLabel fontSize="sm">Corporation Number</FormLabel>
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
            <Box height="15px" color="red.500" fontSize="xs" textAlign="left">
              {errors.corporationNumber?.message}
            </Box>
          </FormControl>

          <Button
            type="submit"
            color="white"
            backgroundColor="gray.900"
            disabled={!isValid}
            isLoading={isSubmitting}
          >
            Submit <span>&#8594;</span>
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ProfileDetailsForm;
