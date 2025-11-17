import { SessionType } from "../config/pomodoro-configs";

export function SessionHeader({
  mode,
  timeLeft,
}: {
  mode: SessionType;
  timeLeft: number;
}) {
  const modeTitles = {
    focus: "Sessão de Foco",
    shortBreak: "Pausa Curta",
    longBreak: "Pausa Longa",
  };

  const modeDescriptions = {
    focus: "Mantenha o foco, você está progredindo a cada minuto",
    shortBreak: "Aproveite para fazer um lanche ou tomar uma água",
    longBreak: "Aproveite para descansar e relaxar",
  };

  return (
    <>
      <h3 className="font-bold text-3xl">{modeTitles[mode]}</h3>
      <span className="font-medium text-xl text-gray-500 text-center">
        {modeDescriptions[mode]}
      </span>
      <span className="font-bold text-8xl text-primary">
        {`${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" : ""}${
          timeLeft % 60
        }`}
      </span>
    </>
  );
}
