import React from "react";
import {BarChart,Bar,XAxis,YAxis,Tooltip,CartesianGrid,ResponsiveContainer,} from "recharts";
import { DataPoint } from "@/lib/hooks/useDashboardData";

export default function Chart({ data }: Readonly<{ data: DataPoint[]; }>) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Estadísticas</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} style={{ backgroundColor: "var(--bg-carousel)" }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--heading-color)", fontSize: 12 }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "var(--heading-color)", fontSize: 12 }}
          />
          <Tooltip
            wrapperStyle={{
              backgroundColor: "var(--background)",
              borderRadius: "5px",
              border: "1px solid var(--accent)",
              color: "var(--foreground)",
              padding: "0.5rem",
            }}
            formatter={(_, __, { payload }) => {
              if (!payload) return null;
              return [
                <>
                  <div>Turnos: {payload.count}</div>
                  <div>Ingresos: ${payload.revenue.toLocaleString("es-AR")}</div>
                </>,
              ];
            }}
            labelFormatter={(label: string) => label}
          />
          <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
