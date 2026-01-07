import { useEffect } from "react";
import {
  FaBullseye,
  FaCalendarCheck,
  FaChartLine,
  FaCheck,
  FaClock,
  FaFire,
  FaTrophy,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import {
  SimpleAreaChart,
  SimpleBarChart,
  SimpleLineChart,
  SimplePieChart,
} from "../components/ChartComponents";
import CompletedTasksList from "../components/CompletedTasksList";
import Container from "../components/Container";
import Loader from "../components/Loader";
import MenuData from "../components/MenuData";
import { useAuth } from "../context/auth.context";
import { useChartData, useStatisticsData } from "../hooks/statistics-hooks";
import { formattedTime } from "../utils/formatted-time";
import { getDayOfWeek } from "../utils/getDayOfWeek";

const StatisticsPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const {
    dataProgress,
    dataStatistics,
    isLoading: isLoadingData,
  } = useStatisticsData({ daysPrevious: 30 });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const chartData = useChartData(dataProgress);

  // Dados para gráfico de metas completadas
  const goalData = [
    {
      name: "Metas Completadas",
      value: (dataProgress || []).filter((d) => d.isGoalComplete).length,
    },
    {
      name: "Metas Não Completadas",
      value: (dataProgress || []).filter((d) => !d.isGoalComplete).length,
    },
  ];

  // Dados para gráfico de distribuição de tipos de sessão
  const sessionTypeData = [
    {
      name: "Sessões Foco",
      value: dataStatistics?.sessionsFocusCompleted || 0,
    },
    {
      name: "Pausas Curtas",
      value: Math.round((dataStatistics?.sessionsFocusCompleted || 0) * 0.8),
    },
    {
      name: "Pausas Longas",
      value: Math.round((dataStatistics?.sessionsFocusCompleted || 0) * 0.3),
    },
  ];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <main className="px-6 sm:px-16 my-12">
          <div className="mb-12">
            <h1 className="font-bold text-3xl sm:text-4xl mb-2">
              Estatísticas
            </h1>
            <span className="font-medium text-base sm:text-lg text-gray-500">
              Acompanhe seu progresso e desempenho
            </span>
          </div>

          {/* Cards de resumo */}
          <div className="flex flex-col gap-8">
            {/* Cards principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MenuData
                title="Séries (Streak)"
                textMain={`${dataStatistics?.streak ?? 0}`}
                description="Dias consecutivos"
                isLoading={isLoadingData}
              >
                <FaFire className="text-primary text-4xl" />
              </MenuData>

              <MenuData
                title="Melhor série"
                textMain={`${dataStatistics?.longestStreak ?? 0}`}
                description="Dias de melhor desempenho"
                isLoading={isLoadingData}
              >
                <FaTrophy className="text-primary text-4xl" />
              </MenuData>

              <MenuData
                title="Sessões de Foco"
                textMain={`${dataStatistics?.sessionsFocusCompleted ?? 0}`}
                description="Sessões completadas"
                isLoading={isLoadingData}
              >
                <FaClock className="text-primary text-4xl" />
              </MenuData>

              <MenuData
                title="Tempo Total"
                textMain={formattedTime(
                  dataStatistics?.totalSessionFocusDuration ?? 0
                )}
                description="Total de foco"
                isLoading={isLoadingData}
              >
                <FaChartLine className="text-primary text-4xl" />
              </MenuData>

              <MenuData
                title="Tarefas Concluídas"
                textMain={`${dataStatistics?.numTasksCompleted ?? 0}`}
                description="Total de tasks"
                isLoading={isLoadingData}
              >
                <FaCheck className="text-primary text-4xl" />
              </MenuData>

              <MenuData
                title="Média Diária"
                textMain={formattedTime(
                  dataStatistics?.dailyMediaDuration ?? 0
                )}
                description="Média de tempo/dia"
                isLoading={isLoadingData}
              >
                <FaBullseye className="text-primary text-4xl" />
              </MenuData>
            </div>

            {/* Melhor e Pior Dia */}
            {dataStatistics?.bestDay && dataStatistics?.worstDay && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Container className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <FaTrophy className="text-yellow-400 text-2xl" />
                    <h3 className="font-bold text-xl">Melhor Dia</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">
                      {getDayOfWeek(dataStatistics.bestDay.date)}
                    </p>
                    <p className="font-bold text-3xl text-primary">
                      {formattedTime(dataStatistics.bestDay.timeCompleted)}
                    </p>
                    <div className="flex items-center gap-2">
                      {dataStatistics.bestDay.isTargetCompleted && (
                        <span className="flex items-center gap-1 text-green-500 font-semibold">
                          <FaCheck className="text-lg" /> Meta completada
                        </span>
                      )}
                    </div>
                  </div>
                </Container>

                <Container className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <FaCalendarCheck className="text-red-400 text-2xl" />
                    <h3 className="font-bold text-xl">Pior Dia</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">
                      {getDayOfWeek(dataStatistics.worstDay.date)}
                    </p>
                    <p className="font-bold text-3xl text-primary">
                      {formattedTime(dataStatistics.worstDay.timeCompleted)}
                    </p>
                    <div className="flex items-center gap-2">
                      {!dataStatistics.worstDay.isTargetCompleted && (
                        <span className="flex items-center gap-1 text-red-500 font-semibold">
                          <FaCheck className="text-lg" /> Meta não completada
                        </span>
                      )}
                    </div>
                  </div>
                </Container>
              </div>
            )}

            {/* Tarefas Completadas */}
            <CompletedTasksList
              tasks={dataStatistics?.tasksCompleted}
              isLoading={isLoadingData}
            />

            {/* Gráficos */}
            <div className="flex flex-col gap-8">
              {/* Gráfico de Linha - Tempo ao longo do tempo */}
              <SimpleLineChart
                data={chartData}
                dataKey="time"
                name="Progresso Diário"
                isLoading={isLoadingData}
                isEmpty={chartData.length === 0}
              />

              {/* Gráfico de Barras - Sessões por dia */}
              <SimpleBarChart
                data={chartData}
                dataKey="sessions"
                name="Sessões Completadas"
                isLoading={isLoadingData}
                isEmpty={chartData.length === 0}
                color="#10b981"
              />

              {/* Gráfico de Pizza - Metas completadas */}
              <SimplePieChart
                data={goalData}
                isLoading={isLoadingData}
                isEmpty={goalData[0].value === 0 && goalData[1].value === 0}
                title="Taxa de Conclusão de Metas"
                valueFormatter={(value) => `${value} dias`}
              />

              {/* Gráfico de Área - Acúmulo de tempo */}
              <SimpleAreaChart
                data={chartData}
                dataKey="time"
                name="Acúmulo de Tempo de Foco"
                isLoading={isLoadingData}
                isEmpty={chartData.length === 0}
              />

              {/* Gráfico de Pizza - Tipos de Sessão */}
              <SimplePieChart
                data={sessionTypeData}
                isLoading={isLoadingData}
                isEmpty={sessionTypeData.every((d) => d.value === 0)}
                title="Distribuição de Sessões"
                valueFormatter={(value) => `${value} sessões`}
              />
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default StatisticsPage;
