import { Tooltip } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { FaCheck, FaClock, FaFireAlt, FaPlay, FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Container from "../components/Container";
import Loader from "../components/Loader";
import MenuData from "../components/MenuData";
import Progressbar from "../components/Progressbar";
import TaskContainer from "../components/TaskContainer";
import { useAuth } from "../context/auth.context";
import { getDataProgress, getDataStatistics } from "../services/data-service";
import { calculateProgress } from "../utils/calculate-progress";
import { formattedTime } from "../utils/formatted-time";
import { getDayOfWeek } from "../utils/getDayOfWeek";

const DashboardPage = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  const { data: dataProgress } = useQuery({
    queryKey: ["dataProgress"],
    queryFn: () => getDataProgress({ daysPrevious: 0 }),
    refetchOnWindowFocus: false,
  });

  const { data: dataStatistics } = useQuery({
    queryKey: ["dataStatistics"],
    queryFn: () => getDataStatistics({ daysPrevious: 7 }),
    refetchOnWindowFocus: false,
  });

  const navigate = useNavigate();

  const timeTotalTarget =
    (user?.dailySessionTarget ?? 0) * (user?.focusSessionDuration ?? 0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      {isLoading && user === null ? (
        <Loader />
      ) : (
        <main className="px-6 sm:px-16 my-12">
          <div>
            <h3 className="font-bold text-2xl sm:text-3xl">
              Bem Vindo {user?.name.split(" ").slice(0, 2).join(" ")}!
            </h3>
            <span className="font-medium text-base sm:text-xl text-gray-500">
              Vamos começar mais um dia produtivo?
            </span>
          </div>

          <div className="flex flex-col gap-8 my-12">
            <Container className="flex flex-col sm:flex-row gap-5 justify-between">
              <div className="flex flex-col gap-4 w-full sm:w-1/2 ">
                <div className="flex gap-4">
                  <span className="font-semibold text-xl">Meta diária</span>
                  <span className="font-medium text-xl text-primary">
                    <Tooltip title="Tempo decorrido">
                      <span>
                        {formattedTime(
                          dataProgress?.[0].totalSessionFocusDuration ?? 0
                        )}{" "}
                      </span>
                    </Tooltip>
                    /
                    <Tooltip title="Tempo de sua meta">
                      <span>{formattedTime(timeTotalTarget)}</span>
                    </Tooltip>
                  </span>
                </div>
                <Progressbar
                  percentage={calculateProgress(
                    dataProgress?.[0].totalSessionFocusDuration ?? 0,
                    timeTotalTarget
                  )}
                />

                <span className="font-medium text-gray-500">
                  Falta pouco para completar sua meta, não desista!
                </span>
                <Button size="large" onClick={() => navigate("/pomodoro")}>
                  <FaPlay className="text-white" />
                  <span className="font-semibold text-base">
                    Começar Concentração
                  </span>
                </Button>
              </div>

              <div className="flex self-start gap-6">
                <div className=" bg-primary-bg px-3.5 py-5.5 rounded-full">
                  <FaFireAlt className="text-primary text-4xl" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-xl">
                    Dias consecutivos
                  </span>
                  <span className="font-bold text-4xl text-primary">
                    {(dataStatistics?.streak ?? 0) <= 1
                      ? `${dataStatistics?.streak ?? 0} dia`
                      : `${dataStatistics?.streak} dias`}
                  </span>
                </div>
              </div>
            </Container>

            <Container className="flex flex-col gap-4 relative">
              <TaskContainer withCheckbox={false} />
            </Container>

            <Container className="flex-col md:flex-row justify-between gap-8">
              <MenuData
                title="Tempo total"
                textMain={`${formattedTime(
                  dataStatistics?.totalSessionFocusDuration ?? 0
                )}`}
                description="Está semana"
              >
                <FaClock className="text-primary text-4xl" />
              </MenuData>
              <MenuData
                title="Tarefas concluídas"
                textMain={`${dataStatistics?.numTasksCompleted ?? 0}`}
                description="Está semana"
              >
                <FaCheck className="text-primary text-4xl" />
              </MenuData>
              <MenuData
                title="Melhor dia"
                textMain={getDayOfWeek(dataStatistics?.bestDay.date ?? 0)}
                description={formattedTime(
                  dataStatistics?.bestDay.timeCompleted ?? 0
                )}
              >
                <FaTrophy className="text-primary text-4xl" />
              </MenuData>
            </Container>
          </div>
        </main>
      )}
    </>
  );
};

export default DashboardPage;
