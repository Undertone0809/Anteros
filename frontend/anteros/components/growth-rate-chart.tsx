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
} from "chart.js"
import { PredictionMarketState, getChartDataForTimeRange } from "@/app/mocks/prediction-market-data"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

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
    annotation: {
      annotations: {
        betPoint: {
          type: 'point',
          xValue: 0,
          yValue: 0,
          backgroundColor: 'rgba(255, 99, 132, 0.25)',
          borderColor: 'rgba(255, 99, 132, 0.25)',
          borderWidth: 1,
          radius: 10,
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

interface GrowthRateChartProps {
  marketState: PredictionMarketState
}

export default function GrowthRateChart({ marketState }: GrowthRateChartProps) {
  const chartData = getChartDataForTimeRange(marketState.currentTime, marketState.endTime)

  // Find the data point closest to bet time
  let betAnnotation = undefined
  if (marketState.userBet) {
    const betTime = new Date(marketState.userBet.timestamp)
    const betHour = betTime.getHours()
    const betIndex = Math.floor(betHour / 2)
    const betPoint = chartData[betIndex]

    if (betPoint) {
      betAnnotation = {
        type: 'point' as const,
        xValue: betPoint.timestamp,
        yValue: betPoint[marketState.userBet.choice],
        backgroundColor: 'rgba(255, 255, 0, 0.5)',
        borderColor: 'rgba(255, 255, 0, 1)',
        borderWidth: 2,
        radius: 8,
        label: {
          content: `Bet: ${marketState.userBet.amount}`,
          enabled: true,
          position: 'top'
        }
      }
    }
  }

  const data = {
    labels: chartData.map(point => point.timestamp),
    datasets: [
      {
        label: "Musk",
        data: chartData.map(point => point.musk),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Zuck",
        data: chartData.map(point => point.zuck),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  }

  const chartOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      annotation: {
        annotations: betAnnotation ? { betPoint: betAnnotation } : {}
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Growth Rate Comparison</CardTitle>
        <div className="text-sm text-muted-foreground">
          {new Date(marketState.currentTime).toLocaleTimeString()} - {new Date(marketState.endTime).toLocaleTimeString()}
        </div>
      </CardHeader>
      <CardContent>
        <Line options={chartOptions} data={data} />
      </CardContent>
    </Card>
  )
}

