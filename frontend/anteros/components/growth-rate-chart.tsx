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
      text: "X Follower Growth Rate (%/hour)",
    },
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
    },
  },
}

const generateGrowthData = () => {
  const timeLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`)

  const muskData = timeLabels.map(() => (Math.random() * 2 + 4).toFixed(2))
  const altmanData = timeLabels.map(() => (Math.random() * 2 + 3).toFixed(2))
  const trumpData = timeLabels.map(() => (Math.random() * 2 + 2).toFixed(2))

  return {
    labels: timeLabels,
    datasets: [
      {
        label: "Musk",
        data: muskData,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Altman",
        data: altmanData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Trump",
        data: trumpData,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  }
}

export default function GrowthRateChart() {
  const data = generateGrowthData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Growth Rate Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <Line options={options} data={data} />
      </CardContent>
    </Card>
  )
}

