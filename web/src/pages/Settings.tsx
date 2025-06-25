import {
  DialogTitle,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
} from "@mui/joy";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaChevronDown,
  FaChevronUp,
  FaRegClock,
  FaRegUser,
} from "react-icons/fa";
import { LuTarget } from "react-icons/lu";
import Button from "../components/Button";
import ButtonPill from "../components/ButtonPill";
import Container from "../components/Container";
import DaySelectorButton from "../components/DaySelectorButton";
import Loader from "../components/Loader";
import ProfileAvatar from "../components/ProfileAvatar";
import { DURATION_LIMITS, DURATION_STEP } from "../config/pomodoro-configs";
import { useAuth } from "../context/auth.context";
import { formattedTime } from "../utils/formatted-time";
import { WEEK_DAYS } from "./steps/StepThree";

type Inputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  sessionPerDay: number;
};

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

const SettingsPage: FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Loader />;
  }

  const [selectedDays, setSelectedDays] = useState(user.selectedDaysOfWeek);

  const allDaysSelected = selectedDays.length === TOTAL_DAYS;

  function handleDayClick(dayValue: number) {
    setSelectedDays(toggleDaySelection(selectedDays, dayValue));
  }

  function handleToggleAllDays() {
    setSelectedDays(allDaysSelected ? [] : selectAllDays());
  }

  const [modalOpen, setModalOpen] = useState(false);

  const [focusDuration, setFocusDuration] = useState(
    user.focusSessionDuration || 25 * 60
  );
  const [shortBreakDuration, setShortBreakDuration] = useState(
    user.shortBreakSessionDuration || 5 * 60
  );
  const [longBreakDuration, setLongBreakDuration] = useState(
    user.longBreakSessionDuration || 15 * 60
  );

  const { register: formUpdate } = useForm<Inputs>();

  const [formData, setFormData] = useState({
    username: user.name,
    email: user.email,
    password: "",
    confirmPassword: "",
    sessionPerDay: user.dailySessionTarget,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  return (
    <>
      <main className="w-2/3 mx-auto mt-10 h-dvh flex flex-col gap-8">
        <Container className="flex flex-row items-center gap-4">
          <ProfileAvatar color="primary" variant="solid" size="lg" />
          <div>
            <h4 className="font-semibold text-xl">{user.name}</h4>
            <span className="font-medium text-gray-600">{user.email}</span>
          </div>
        </Container>

        <div className="grid grid-cols-3 gap-4">
          <Container className="flex flex-col gap-4">
            <div className="flex flex-row gap-2 items-center">
              <FaRegUser className="text-primary text-2xl" />
              <h5 className="font-semibold text-lg mt-2">Perfil</h5>
            </div>
            <form className="flex flex-col gap-6">
              <div>
                <label
                  htmlFor="username"
                  id="username"
                  className="font-medium text-gray-700"
                >
                  Nome
                </label>
                <Input
                  {...formUpdate("username", {
                    required: "Campo obrigatório",
                    minLength: {
                      value: 3,
                      message: "O nome deve ter pelo menos 3 caracteres",
                    },
                    maxLength: {
                      value: 20,
                      message: "O nome deve ter no máximo 20 caracteres",
                    },
                  })}
                  type="text"
                  name="username"
                  onChange={handleChange}
                  id="username"
                  placeholder="Digite seu nome"
                  value={formData.username}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  {...formUpdate("email", {
                    required: "Campo obrigatório",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email inválido",
                    },
                  })}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Digite seu email"
                  autoComplete="email"
                />
              </div>

              <div>
                <button type="button" onClick={() => setModalOpen(true)}>
                  <span className="text-primary font-bold hover:text-primary-hover cursor-pointer">
                    Alterar a senha
                  </span>
                </button>
              </div>
            </form>
          </Container>

          <Container className="flex flex-col gap-4">
            <div className="flex flex-row gap-2 items-center">
              <FaRegClock className="text-primary text-2xl" />
              <h5 className="font-semibold text-lg mt-2">
                Configurações de Sessão
              </h5>
            </div>

            <div className="flex flex-col items-start w-full mt-4 gap-4">
              <DurationControl
                label="Sessão focus"
                duration={focusDuration}
                onDecrease={() =>
                  handleFocusDurationChange(focusDuration - DURATION_STEP)
                }
                onIncrease={() =>
                  handleFocusDurationChange(focusDuration + DURATION_STEP)
                }
              />
              <div className="h-0.5 w-full bg-gray-300" />
              <DurationControl
                label="Sessão descanso curto"
                duration={shortBreakDuration}
                onDecrease={() =>
                  handleShortBreakDurationChange(
                    shortBreakDuration - DURATION_STEP
                  )
                }
                onIncrease={() =>
                  handleShortBreakDurationChange(
                    shortBreakDuration + DURATION_STEP
                  )
                }
              />
              <div className="h-0.5 w-full bg-gray-300" />
              <DurationControl
                label="Sessão descanso longo"
                duration={longBreakDuration}
                onDecrease={() =>
                  handleLongBreakDurationChange(
                    longBreakDuration - DURATION_STEP
                  )
                }
                onIncrease={() =>
                  handleLongBreakDurationChange(
                    longBreakDuration + DURATION_STEP
                  )
                }
              />
            </div>
          </Container>

          <Container className="flex flex-col gap-4">
            <div className="flex flex-row gap-2 items-center">
              <LuTarget className="text-primary text-2xl" />
              <h5 className="font-semibold text-lg mt-2">Metas Diárias</h5>
            </div>
            <form>
              <div>
                <label
                  id="sessionPerDay"
                  htmlFor="sessionPerDay"
                  className="font-medium text-gray-700"
                >
                  Sessão por dia
                </label>
                <Input
                  {...formUpdate("sessionPerDay", {
                    required: "Campo obrigatório",
                    min: {
                      value: 1,
                      message: "Deve ser pelo menos 1 sessão",
                    },
                    max: {
                      value: 20,
                      message: "Não pode ser mais que 20 sessões",
                    },
                  })}
                  type="number"
                  id="sessionPerDay"
                  name="sessionPerDay"
                  placeholder="Digite a meta de sessões por dia"
                  autoComplete="off"
                  onChange={handleChange}
                  value={formData.sessionPerDay}
                />
              </div>
            </form>

            <div className="flex flex-wrap justify-between gap-4">
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
          </Container>
        </div>
      </main>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalDialog>
          <ModalClose />
          <DialogTitle>Crie uma nova senha</DialogTitle>
          <form>
            <Stack spacing={2}>
              <Input
                autoComplete="new-password"
                autoFocus
                required
                type="password"
                placeholder="Digite a nova senha"
                name="password"
                id="password"
                onChange={handleChange}
              />
              <Input
                autoComplete="new-password"
                autoFocus
                required
                type="password"
                placeholder="Confirme a nova senha"
                name="password"
                id="password"
                onChange={handleChange}
              />
              <Button type="submit">Confirmar</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default SettingsPage;

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
  <div className="flex flex-col justify-between gap-4 w-full">
    <span className="font-semibold text-gray-800 text-2xl">{label}</span>
    <div className="flex flex-row gap-4 justify-between">
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
