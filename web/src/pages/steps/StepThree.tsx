import { FC } from "react";
import Button from "../../components/Button";
import ButtonPill from "../../components/ButtonPill";
import Container from "../../components/Container";
import DaySelectorButton from "../../components/DaySelectorButton";
import { MINIMUM_SELECTED_SESSIONS } from "../../config/session-configs";

type StepThreeProps = {
  setActiveStep: (step: number) => void;
  setSelectedDays: (days: number[]) => void;
  selectedDays: number[];
  handleNext: () => void;
};

type DayOption = {
  label: string;
  value: number;
};

export const WEEK_DAYS: DayOption[] = [
  { label: "Dom", value: 0 },
  { label: "Seg", value: 1 },
  { label: "Ter", value: 2 },
  { label: "Qua", value: 3 },
  { label: "Qui", value: 4 },
  { label: "Sex", value: 5 },
  { label: "Sáb", value: 6 },
];

const TOTAL_DAYS = WEEK_DAYS.length;

const isDaySelected = (selectedDays: number[], dayValue: number) =>
  selectedDays.includes(dayValue);

const toggleDaySelection = (
  selectedDays: number[],
  dayValue: number
): number[] =>
  isDaySelected(selectedDays, dayValue)
    ? selectedDays.filter((value) => value !== dayValue)
    : [...selectedDays, dayValue];

const selectAllDays = (): number[] => WEEK_DAYS.map((day) => day.value);

const StepThree: FC<StepThreeProps> = ({
  setActiveStep,
  setSelectedDays,
  selectedDays,
  handleNext,
}) => {
  const allDaysSelected = selectedDays.length === TOTAL_DAYS;

  function handleDayClick(dayValue: number) {
    setSelectedDays(toggleDaySelection(selectedDays, dayValue));
  }

  function handleToggleAllDays() {
    setSelectedDays(allDaysSelected ? [] : selectAllDays());
  }

  const isLessThanTwoDaysSelected =
    selectedDays.length < MINIMUM_SELECTED_SESSIONS;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-3xl">
        Em quais dias você pretende cumprir sua meta?
      </h2>

      <span className="font-medium text-gray-500">
        A consistência é a chave. Escolha os dias em que você pretende cumprir
        suas metas.
      </span>

      <Container className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-1 justify-between">
          {WEEK_DAYS.map(({ label, value }) => (
            <DaySelectorButton
              key={value}
              label={label}
              isSelected={isDaySelected(selectedDays, value)}
              onClick={() => handleDayClick(value)}
            />
          ))}
        </div>

        <ButtonPill
          onClick={handleToggleAllDays}
          size="small"
          theme={allDaysSelected ? "danger" : "secondary"}
          className="self-start"
        >
          {allDaysSelected
            ? "Remover todos os dias"
            : "Selecionar todos os dias"}
        </ButtonPill>
        {isLessThanTwoDaysSelected && (
          <span className="text-red-500 text-sm text-start">
            Por favor, selecione pelo menos dois dias da semana.
          </span>
        )}
      </Container>

      <div className="flex justify-between mt-4">
        <Button onClick={() => setActiveStep(1)} theme="outline" size="large">
          Voltar
        </Button>
        <Button
          onClick={handleNext}
          theme={isLessThanTwoDaysSelected ? "disabled" : "primary"}
          size="large"
        >
          Começar a produzir!
        </Button>
      </div>
    </div>
  );
};

export default StepThree;
