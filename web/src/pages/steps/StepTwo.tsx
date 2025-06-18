import { FC, useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Button from "../../components/Button";
import ButtonPill from "../../components/ButtonPill";
import Container from "../../components/Container";
import {
  DEFAULT_DURATIONS,
  DURATION_LIMITS,
  DURATION_STEP,
  FOCUS_OPTIONS,
  type FocusOption,
} from "../../config/pomodoro-configs";
import { formattedTime } from "../../utils/formatted-time";

type StepTwoProps = {
  setActiveStep: (step: number) => void;
  sessionsPerDay: number;
  focusDuration: number;
  setFocusDuration: (duration: number) => void;
  shortBreakDuration: number;
  setShortBreakDuration: (duration: number) => void;
  longBreakDuration: number;
  setLongBreakDuration: (duration: number) => void;
};

const StepTwo: FC<StepTwoProps> = ({
  setActiveStep,
  sessionsPerDay,
  longBreakDuration,
  focusDuration,
  setLongBreakDuration,
  setFocusDuration,
  setShortBreakDuration,
  shortBreakDuration,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>("default");
  const [timeTotalProductivity, setTimeTotalProductivity] = useState(
    sessionsPerDay * focusDuration
  );

  const roundToStep = (value: number) =>
    Math.round(value / DURATION_STEP) * DURATION_STEP;

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  const handleFocusDurationChange = (value: number) => {
    setFocusDuration(
      clamp(
        roundToStep(value),
        DURATION_LIMITS.focus.min,
        DURATION_LIMITS.focus.max
      )
    );
  };

  const handleShortBreakDurationChange = (value: number) => {
    setShortBreakDuration(
      clamp(
        roundToStep(value),
        DURATION_LIMITS.shortBreak.min,
        DURATION_LIMITS.shortBreak.max
      )
    );
  };

  const handleLongBreakDurationChange = (value: number) => {
    setLongBreakDuration(
      clamp(
        roundToStep(value),
        DURATION_LIMITS.longBreak.min,
        DURATION_LIMITS.longBreak.max
      )
    );
  };

  const handleOptionChange = (optionId: string) => {
    setSelectedOptionId(optionId);
    if (optionId === "default" || optionId === "long") {
      setFocusDuration(DEFAULT_DURATIONS[optionId as "default" | "long"].focus);
      setShortBreakDuration(
        DEFAULT_DURATIONS[optionId as "default" | "long"].shortBreak
      );
      setLongBreakDuration(
        DEFAULT_DURATIONS[optionId as "default" | "long"].longBreak
      );
    }
  };

  useEffect(() => {
    const totalProductivity = sessionsPerDay * focusDuration;
    setTimeTotalProductivity(totalProductivity);

    if (totalProductivity >= 86400) {
      setTimeTotalProductivity(86400);
      setFocusDuration(86400 / sessionsPerDay);
    }
  }, [sessionsPerDay, focusDuration]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-3xl">Personalize suas sessões</h2>
      <span className="font-medium text-gray-500">
        Escolha o formato que melhor se adapta ao seu estilo
      </span>

      <Container className="flex flex-col">
        <span className="font-medium text-gray-500">
          Tempo total de produtividade diário
        </span>
        <span className="font-bold text-4xl text-primary">
          {formattedTime(timeTotalProductivity)}
        </span>
      </Container>

      <div className="space-y-4">
        {FOCUS_OPTIONS.map((option) => (
          <FocusOptionCard
            key={option.id}
            option={option}
            isSelected={selectedOptionId === option.id}
            onSelect={handleOptionChange}
            focusDuration={focusDuration}
            onFocusDurationChange={handleFocusDurationChange}
            shortBreakDuration={shortBreakDuration}
            onShortBreakDurationChange={handleShortBreakDurationChange}
            longBreakDuration={longBreakDuration}
            onLongBreakDurationChange={handleLongBreakDurationChange}
          />
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <Button onClick={() => setActiveStep(0)} theme="outline" size="large">
          Voltar
        </Button>
        <Button onClick={() => setActiveStep(2)} theme="primary" size="large">
          Avançar
        </Button>
      </div>
    </div>
  );
};

type FocusOptionCardProps = {
  option: FocusOption;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
  focusDuration: number;
  onFocusDurationChange: (value: number) => void;
  shortBreakDuration: number;
  onShortBreakDurationChange: (value: number) => void;
  longBreakDuration: number;
  onLongBreakDurationChange: (value: number) => void;
};

const FocusOptionCard: FC<FocusOptionCardProps> = ({
  option,
  isSelected,
  onSelect,
  focusDuration,
  onFocusDurationChange,
  shortBreakDuration,
  onShortBreakDurationChange,
  longBreakDuration,
  onLongBreakDurationChange,
}) => {
  const isPersonalized = option.id === "personalized";

  return (
    <label
      htmlFor={option.id}
      className={`flex flex-col items-center p-4 border rounded-xl cursor-pointer transition-all shadow ${
        isSelected
          ? "border-blue-600 bg-blue-50 ring-2 ring-blue-300"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <div className="flex flex-row justify-between w-full px-4 items-center">
        <div className="flex flex-col items-start">
          <h3 className="font-bold text-xl text-gray-800">{option.title}</h3>
          <p className="font-medium text-gray-600">{option.description}</p>
          <span className="text-xs font-semibold inline-block py-1 px-2.5 rounded-full mt-2 bg-primary-bg text-primary">
            {option.tag}
          </span>
        </div>
        <div className={isPersonalized ? "block" : "hidden"}>
          {isSelected ? (
            <FaChevronUp className="text-gray-400" />
          ) : (
            <FaChevronDown className="text-gray-400" />
          )}
        </div>
        <input
          type="radio"
          id={option.id}
          name="session_format"
          value={option.id}
          checked={isSelected}
          onChange={() => onSelect(option.id)}
          className={`form-radio h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 ${
            isPersonalized ? "hidden" : "block"
          }`}
        />
      </div>
      {isPersonalized && isSelected && (
        <div className="flex flex-col items-start w-full mt-4 gap-4">
          <DurationControl
            label="Sessão focus"
            duration={focusDuration}
            onDecrease={() =>
              onFocusDurationChange(focusDuration - DURATION_STEP)
            }
            onIncrease={() =>
              onFocusDurationChange(focusDuration + DURATION_STEP)
            }
          />
          <div className="h-0.5 w-full bg-gray-300" />
          <DurationControl
            label="Sessão descanso curto"
            duration={shortBreakDuration}
            onDecrease={() =>
              onShortBreakDurationChange(shortBreakDuration - DURATION_STEP)
            }
            onIncrease={() =>
              onShortBreakDurationChange(shortBreakDuration + DURATION_STEP)
            }
          />
          <div className="h-0.5 w-full bg-gray-300" />
          <DurationControl
            label="Sessão descanso longo"
            duration={longBreakDuration}
            onDecrease={() =>
              onLongBreakDurationChange(longBreakDuration - DURATION_STEP)
            }
            onIncrease={() =>
              onLongBreakDurationChange(longBreakDuration + DURATION_STEP)
            }
          />
        </div>
      )}
    </label>
  );
};

type DurationControlProps = {
  label: string;
  duration: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

const DurationControl: FC<DurationControlProps> = ({
  label,
  duration,
  onDecrease,
  onIncrease,
}) => (
  <div className="flex flex-row justify-between items-center w-full">
    <span className="font-semibold text-gray-800 text-2xl">{label}</span>
    <div className="flex flex-row gap-4">
      <ButtonPill onClick={onDecrease}>
        <FaChevronDown />
      </ButtonPill>
      <span className="bg-gray-100 p-2 rounded-2xl text-primary font-bold text-2xl">
        {formattedTime(duration)}
      </span>
      <ButtonPill onClick={onIncrease}>
        <FaChevronUp />
      </ButtonPill>
    </div>
  </div>
);

export default StepTwo;
