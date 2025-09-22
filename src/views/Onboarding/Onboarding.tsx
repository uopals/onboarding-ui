import { useState } from "react";
import { Box, Text } from "@chakra-ui/react";

import ProfileDetailsForm from "./ProfileDetails/ProfileDetailsForm";
import { ONBOARDING_STEPS } from "../../constants";

const orderedSteps = [ONBOARDING_STEPS.PROFILE_DETAILS];
const totalSteps = orderedSteps.length;

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const advanceToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div>
      <Box marginBottom="24">
        <Text>
          Step {currentStep + 1} of {totalSteps}
        </Text>
      </Box>
      {orderedSteps[currentStep] === ONBOARDING_STEPS.PROFILE_DETAILS && (
        <ProfileDetailsForm onContinue={advanceToNextStep} />
      )}
    </div>
  );
};

export default Onboarding;
