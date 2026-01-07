import { Skeleton } from "@mui/joy";
import type React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Container from "./Container";

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
];

interface ChartWrapperProps {
  title: string;
  isLoading: boolean;
  children: React.ReactNode;
  isEmpty?: boolean;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  isLoading,
  children,
  isEmpty = false,
}) => {
  return (
    <Container className="flex flex-col gap-4">
      <h2 className="font-bold text-2xl">{title}</h2>
      <Skeleton loading={isLoading} variant="rectangular">
        {isEmpty ? (
          <div className="h-80 flex items-center justify-center text-gray-500">
            Nenhum dado disponível
          </div>
        ) : (
          children
        )}
      </Skeleton>
    </Container>
  );
};

interface LineChartProps {
  data: any[];
  dataKey: string;
  name: string;
  isLoading: boolean;
  isEmpty?: boolean;
}

export const SimpleLineChart: React.FC<LineChartProps> = ({
  data,
  dataKey,
  name,
  isLoading,
  isEmpty = false,
}) => {
  return (
    <ChartWrapper title={name} isLoading={isLoading} isEmpty={isEmpty}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
            formatter={(value) => {
              if (typeof value === "number") return `${value} min`;
              return value;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#3b82f6"
            name={name}
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

interface BarChartProps {
  data: any[];
  dataKey: string;
  name: string;
  isLoading: boolean;
  isEmpty?: boolean;
  color?: string;
}

export const SimpleBarChart: React.FC<BarChartProps> = ({
  data,
  dataKey,
  name,
  isLoading,
  isEmpty = false,
  color = "#10b981",
}) => {
  return (
    <ChartWrapper title={name} isLoading={isLoading} isEmpty={isEmpty}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Bar dataKey={dataKey} fill={color} name={name} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

interface SimplePieChartProps {
  data: any[];
  isLoading: boolean;
  isEmpty?: boolean;
  title: string;
  valueFormatter?: (value?: number) => string;
}

export const SimplePieChart: React.FC<SimplePieChartProps> = ({
  data,
  isLoading,
  isEmpty = false,
  title,
  valueFormatter = (value) => `${value}`,
}) => {
  return (
    <ChartWrapper title={title} isLoading={isLoading} isEmpty={isEmpty}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name: labelName, value, percent }) =>
              `${labelName}: ${value} (${((percent ?? 0) * 100).toFixed(0)}%)`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => valueFormatter(value as number)} />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

interface SimpleAreaChartProps {
  data: any[];
  dataKey: string;
  name: string;
  isLoading: boolean;
  isEmpty?: boolean;
  color?: string;
}

export const SimpleAreaChart: React.FC<SimpleAreaChartProps> = ({
  data,
  dataKey,
  name,
  isLoading,
  isEmpty = false,
  color = "#3b82f6",
}) => {
  return (
    <ChartWrapper title={name} isLoading={isLoading} isEmpty={isEmpty}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
            formatter={(value) => {
              if (typeof value === "number") return `${value} min`;
              return value;
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fillOpacity={1}
            fill="url(#colorArea)"
            name={name}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};
