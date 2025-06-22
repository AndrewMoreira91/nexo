import { Step, StepIndicator, Stepper } from "@mui/joy";
import { useState } from "react";
import { BiCheck } from "react-icons/bi";
import { Navigate, useNavigate } from "react-router";
import { DEFAULT_DURATIONS } from "../../config/pomodoro-configs";
import { useAuth } from "../../context/auth.context";
import { api } from "../../libs/api";
import StepOne from "./StepOne";
import StepThree from "./StepThree";
import StepTwo from "./StepTwo";

const steps = ["Passo 1", "Passo 2", "Passo 3"];

const StepsPage = () => {
  const { isAuthenticated, updateUser } = useAuth();

  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const [activeStep, setActiveStep] = useState(0);

  const [sessionsPerDay, setSessionsPerDay] = useState(2);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [focusDuration, setFocusDuration] = useState<number>(
    DEFAULT_DURATIONS.default.focus
  );
  const [shortBreakDuration, setShortBreakDuration] = useState<number>(
    DEFAULT_DURATIONS.default.shortBreak
  );
  const [longBreakDuration, setLongBreakDuration] = useState<number>(
    DEFAULT_DURATIONS.default.longBreak
  );

  const handleSaveRegistration = async () => {
    try {
      const registrationData = {
        dailySessionTarget: sessionsPerDay,
        focusSessionDuration: focusDuration,
        shortBreakSessionDuration: shortBreakDuration,
        longBreakSessionDuration: longBreakDuration,
        selectedDaysOfWeek: selectedDays,
        completedOnboarding: true,
      };

      await api.put("/user", registrationData);

      await updateUser(registrationData);

      return navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Error saving registration:", error);
    }
  };

  return (
    <>
      <main className="bg-background flex flex-col gap-6 w-1/2 mx-auto my-10 text-center">
        <Stepper sx={{ width: "100%" }}>
          {steps.map((step, index) => (
            <Step
              key={step}
              indicator={
                <StepIndicator
                  variant={activeStep <= index ? "solid" : "solid"}
                  color={activeStep < index ? "neutral" : "primary"}
                  className="bg-primary"
                >
                  {activeStep <= index ? index + 1 : <BiCheck />}
                </StepIndicator>
              }
              sx={[
                activeStep > index &&
                  index !== 2 && { "&::after": { bgcolor: "primary.solidBg" } },
              ]}
            />
          ))}
        </Stepper>

        <span className="text-center font-medium text-gray-500">
          Passo {activeStep + 1} de {steps.length}
        </span>

        {activeStep === 0 && (
          <StepOne
            sessionsPerDay={sessionsPerDay}
            setSessionsPerDay={(value) => setSessionsPerDay(value)}
            setActiveStep={(value) => setActiveStep(value)}
          />
        )}
        {activeStep === 1 && (
          <StepTwo
            setActiveStep={(value) => setActiveStep(value)}
            sessionsPerDay={sessionsPerDay}
            focusDuration={focusDuration}
            setFocusDuration={(value) => setFocusDuration(value)}
            shortBreakDuration={shortBreakDuration}
            setShortBreakDuration={(value) => setShortBreakDuration(value)}
            longBreakDuration={longBreakDuration}
            setLongBreakDuration={(value) => setLongBreakDuration(value)}
          />
        )}
        {activeStep === 2 && (
          <StepThree
            handleNext={handleSaveRegistration}
            setActiveStep={(value) => setActiveStep(value)}
            setSelectedDays={(value) => setSelectedDays(value)}
            selectedDays={selectedDays}
          />
        )}
      </main>
    </>
  );
};

export default StepsPage;
