import { Slider } from "@mui/joy";
import { FC } from "react";
import Button from "../../components/Button";
import Container from "../../components/Container";

type StepOneProps = {
  setActiveStep: (step: number) => void;
  sessionsPerDay: number;
  setSessionsPerDay: (sessions: number) => void;
};

const getSessionLabel = (sessions: number): string =>
  sessions === 1 ? "Sessão" : "Sessões";

const StepOne: FC<StepOneProps> = ({
  sessionsPerDay,
  setActiveStep,
  setSessionsPerDay,
}) => (
  <div className="flex flex-col gap-4">
    <h2 className="font-bold text-3xl">
      Qual é a sua meta de sessões de produtividade por dia?
    </h2>

    <span className="font-medium text-gray-500">
      Defina quantas sessões você deseja ter diariamente
    </span>

    <Container className="flex flex-col justify-center gap-4 px-8">
      <div className="flex flex-row items-center justify-center gap-4">
        <span className="font-bold text-8xl text-primary">
          {sessionsPerDay}
        </span>
        <span className="font-semibold text-2xl">
          {getSessionLabel(sessionsPerDay)}
        </span>
      </div>
      <div>
        <Slider
          marks
          variant="solid"
          color="primary"
          defaultValue={sessionsPerDay}
          min={2}
          max={10}
          step={1}
          valueLabelDisplay="auto"
          onChange={(_, value) => setSessionsPerDay(value as number)}
        />
        <div className="flex flex-row justify-between">
          <span className="text-gray-500 font-medium">2 sessões</span>
          <span className="text-gray-500 font-medium">10 sessões</span>
        </div>
      </div>
    </Container>

    <div className="flex justify-end mt-4">
      <Button onClick={() => setActiveStep(1)} theme="primary" size="large">
        Avançar
      </Button>
    </div>
  </div>
);

export default StepOne;
