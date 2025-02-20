"use client"

import { Line } from "react-chartjs-2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataset,
  ScriptableContext,
  TooltipItem,
} from "chart.js"
import annotationPlugin from 'chartjs-plugin-annotation'
import { PredictionMarketState, getChartDataForTimeRange } from "@/app/mocks/prediction-market-data"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
)

interface GrowthRateChartProps {
  marketState: PredictionMarketState
}

export default function GrowthRateChart({ marketState }: GrowthRateChartProps) {
  const chartData = getChartDataForTimeRange(marketState.currentTime, marketState.endTime)

  // Find the bet time index in the data
  const betTimeIndex = marketState.userBet
    ? chartData.findIndex(point => {
      const betHour = new Date(marketState.userBet!.timestamp).getHours()
      const [pointHour] = point.timestamp.split(":").map(Number)
      return betHour <= pointHour
    })
    : -1;

  const data = {
    labels: chartData.map(point => point.timestamp),
    datasets: [
      {
        label: "Musk",
        data: chartData.map(point => point.musk),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        pointRadius: (ctx: ScriptableContext<"line">) => {
          // Add a larger point at the bet position for Musk
          if (marketState.userBet?.choice === 'musk' && ctx.dataIndex === betTimeIndex) {
            return 8;
          }
          return 3;
        },
        pointBackgroundColor: (ctx: ScriptableContext<"line">) => {
          // Highlight the bet point for Musk
          if (marketState.userBet?.choice === 'musk' && ctx.dataIndex === betTimeIndex) {
            return 'rgba(255, 99, 132, 0.8)';
          }
          return "rgb(53, 162, 235)";
        },
        pointBorderColor: (ctx: ScriptableContext<"line">) => {
          // Add white border to bet point for Musk
          if (marketState.userBet?.choice === 'musk' && ctx.dataIndex === betTimeIndex) {
            return 'white';
          }
          return "rgb(53, 162, 235)";
        },
        pointBorderWidth: (ctx: ScriptableContext<"line">) => {
          // Add thicker border to bet point
          if (marketState.userBet?.choice === 'musk' && ctx.dataIndex === betTimeIndex) {
            return 2;
          }
          return 1;
        },
      } as ChartDataset<"line">,
      {
        label: "Zuck",
        data: chartData.map(point => point.zuck),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        pointRadius: (ctx: ScriptableContext<"line">) => {
          // Add a larger point at the bet position for Zuck
          if (marketState.userBet?.choice === 'zuck' && ctx.dataIndex === betTimeIndex) {
            return 8;
          }
          return 3;
        },
        pointBackgroundColor: (ctx: ScriptableContext<"line">) => {
          // Highlight the bet point for Zuck
          if (marketState.userBet?.choice === 'zuck' && ctx.dataIndex === betTimeIndex) {
            return 'rgba(255, 99, 132, 0.8)';
          }
          return "rgb(255, 99, 132)";
        },
        pointBorderColor: (ctx: ScriptableContext<"line">) => {
          // Add white border to bet point for Zuck
          if (marketState.userBet?.choice === 'zuck' && ctx.dataIndex === betTimeIndex) {
            return 'white';
          }
          return "rgb(255, 99, 132)";
        },
        pointBorderWidth: (ctx: ScriptableContext<"line">) => {
          // Add thicker border to bet point
          if (marketState.userBet?.choice === 'zuck' && ctx.dataIndex === betTimeIndex) {
            return 2;
          }
          return 1;
        },
      } as ChartDataset<"line">,
    ],
  }

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Growth Rate Comparison (%/hour)",
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (marketState.userBet && context.dataIndex === betTimeIndex && label.toLowerCase() === marketState.userBet.choice) {
              return `${label}: ${value}% (Bet: ${marketState.userBet.amount})`;
            }
            return `${label}: ${value}%`;
          }
        }
      }
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Growth Rate (%)",
        },
        min: 3.5,
        max: 7.5,
      },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Growth Rate Comparison</CardTitle>
        <div className="text-sm text-muted-foreground">
          {new Date(marketState.currentTime).toISOString().slice(11, 19)} - {new Date(marketState.endTime).toISOString().slice(11, 19)}
        </div>
      </CardHeader>
      <CardContent>
        <Line options={options} data={data} />
      </CardContent>
    </Card>
  )
}

