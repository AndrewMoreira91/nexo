import {
  DialogTitle,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
} from "@mui/joy";
import { FC, useEffect, useState } from "react";
import { FaRegClock, FaRegUser } from "react-icons/fa";
import { LuTarget } from "react-icons/lu";
import Button from "../components/Button";
import ButtonPill from "../components/ButtonPill";
import Container from "../components/Container";
import { DurationControl } from "../components/DurationControl";
import Loader from "../components/Loader";
import ProfileAvatar from "../components/ProfileAvatar";
import { DURATION_STEP } from "../config/pomodoro-configs";
import { useAuth } from "../context/auth.context";
import { api } from "../libs/api";
import { UpdateUserProps } from "../types/requests";
import {
  clampFocusDuration,
  clampLongBreakDuration,
  clampShortBreakDuration,
} from "../utils/duration-utils";
import { WEEK_DAYS } from "./steps/StepThree";

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
  const { user, updateUser, isLoading: userLoading } = useAuth();

  if (!user) {
    return <Loader />;
  }

  const [modalOpen, setModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [focusDuration, setFocusDuration] = useState(
    user.focusSessionDuration || 25 * 60
  );
  const [shortBreakDuration, setShortBreakDuration] = useState(
    user.shortBreakSessionDuration || 5 * 60
  );
  const [longBreakDuration, setLongBreakDuration] = useState(
    user.longBreakSessionDuration || 15 * 60
  );

  const [formData, setFormData] = useState({
    name: user.name.trim(),
    email: user.email,
    password: "",
    confirmPassword: "",
    sessionPerDay: user.dailySessionTarget,
  });

  const [selectedDays, setSelectedDays] = useState(user.selectedDaysOfWeek);

  const allDaysSelected = selectedDays.length === TOTAL_DAYS;

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const isFormChanged =
    formData.name !== user.name.trim() ||
    formData.email !== user.email ||
    formData.sessionPerDay !== user.dailySessionTarget ||
    focusDuration !== (user.focusSessionDuration || 25 * 60) ||
    shortBreakDuration !== (user.shortBreakSessionDuration || 5 * 60) ||
    longBreakDuration !== (user.longBreakSessionDuration || 15 * 60) ||
    JSON.stringify(selectedDays) !== JSON.stringify(user.selectedDaysOfWeek);

  const isLessThanTwoDaysSelected = selectedDays.length < 2;

  useEffect(() => {
    if (isLessThanTwoDaysSelected || !isFormChanged) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [isFormChanged, selectedDays]);

  const handleSubmit = async () => {
    console.log("Submitting form with data:", formData);
    setIsLoading(true);
    if (!isFormChanged) {
      return;
    }

    const updatedData = {
      name: formData.name,
      email: formData.email,
      password: formData.password || undefined,
      dailySessionTarget: formData.sessionPerDay,
      focusSessionDuration: focusDuration,
      shortBreakSessionDuration: shortBreakDuration,
      longBreakSessionDuration: longBreakDuration,
      selectedDaysOfWeek: selectedDays,
    } as UpdateUserProps;

    try {
      await api.put("/user", updatedData);
      setIsLoading(false);
      updateUser();
    } catch (error) {
      console.error("Erro ao atualizar as configurações do usuário:", error);
      setIsLoading(false);
      return;
    }
  };

  const setData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  function handleDayClick(dayValue: number) {
    setSelectedDays(toggleDaySelection(selectedDays, dayValue));
  }

  function handleToggleAllDays() {
    setSelectedDays(allDaysSelected ? [] : selectAllDays());
  }

  const sessionPerDayValidation = (value: string) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || numericValue < 1) {
      setData({ sessionPerDay: 1 });
    } else if (numericValue > 20) {
      setData({ sessionPerDay: 20 });
    } else {
      setData({ sessionPerDay: numericValue });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "sessionPerDay") {
      sessionPerDayValidation(value);
      return;
    }

    setData({
      [name]: value,
    });
  };

  const handleFocusDurationChange = (value: number) => {
    setFocusDuration(clampFocusDuration(value));
  };

  const handleShortBreakDurationChange = (value: number) => {
    setShortBreakDuration(clampShortBreakDuration(value));
  };

  const handleLongBreakDurationChange = (value: number) => {
    setLongBreakDuration(clampLongBreakDuration(value));
  };

  return (
    <>
      <main className="w-ful max-w-7xl mx-auto px-6 md:px-12 lg-px-16 my-10 flex flex-col gap-8">
        <Container className="flex flex-row items-center gap-4">
          <ProfileAvatar color="primary" variant="solid" size="lg" />
          <div>
            <h4 className="font-semibold text-xl">{user.name}</h4>
            <span className="font-medium text-gray-600">{user.email}</span>
          </div>
        </Container>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Container className="flex flex-col gap-4">
            <div className="flex flex-row gap-2 items-center">
              <FaRegUser className="text-primary text-2xl" />
              <h5 className="font-semibold text-lg mt-2">Perfil</h5>
            </div>
            <form className="flex flex-col gap-6">
              <div>
                <label
                  htmlFor="name"
                  id="name"
                  className="font-medium text-gray-700"
                >
                  Nome
                </label>
                <Input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  id="name"
                  placeholder="Digite seu nome"
                  value={formData.name}
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
                align="vertical"
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
                align="vertical"
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
                align="vertical"
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
                  type="number"
                  id="sessionPerDay"
                  name="sessionPerDay"
                  placeholder="Digite a meta de sessões por dia"
                  autoComplete="off"
                  onChange={handleChange}
                  value={formData.sessionPerDay}
                  error={formData.sessionPerDay < 1}
                />
              </div>
            </form>

            <div className="w-full flex flex-wrap">
              {WEEK_DAYS.map(({ label, value }) => (
                <button
                  type="button"
                  onClick={() => handleDayClick(value)}
                  disabled={allDaysSelected && selectedDays.length === 1}
                  className={`${
                    isDaySelected(selectedDays, value)
                      ? "bg-primary"
                      : "bg-gray-300"
                  } rounded-2xl p-2 text-gray-50 cursor-pointer m-1 hover:bg-primary-hover transition`}
                  key={value}
                >
                  <span>{label.slice(0, 2)}</span>
                </button>
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
              <span className="text-red-500 text-sm">
                Por favor, selecione pelo menos dois dias da semana.
              </span>
            )}
          </Container>
          <Button
            type="button"
            onClick={handleSubmit}
            theme={`${isButtonDisabled ? "disabled" : "primary"}`}
            isLoading={isLoading || userLoading}
          >
            Salvar
          </Button>
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
                required
                type="password"
                placeholder="Confirme a nova senha"
                name="confirmPassword"
                id="confirmPassword"
                onChange={handleChange}
              />
              <Button type="submit">Confirmafr</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default SettingsPage;
