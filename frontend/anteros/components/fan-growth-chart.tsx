"use client"

import { useState } from "react"
import { Line } from "react-chartjs-2"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Fan Growth Over Time",
    },
  },
}

const generateDummyData = (name: string) => {
  const labels = ["January", "February", "March", "April", "May", "June", "July"]
  return {
    labels,
    datasets: [
      {
        label: name,
        data: labels.map(() => Math.floor(Math.random() * 1000000)),
        borderColor: name === "Altman" ? "rgb(255, 99, 132)" : "rgb(53, 162, 235)",
        backgroundColor: name === "Altman" ? "rgba(255, 99, 132, 0.5)" : "rgba(53, 162, 235, 0.5)",
      },
    ],
  }
}

export default function FanGrowthChart() {
  const [selectedPerson, setSelectedPerson] = useState("Altman")
  const data = generateDummyData(selectedPerson)

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Select onValueChange={setSelectedPerson} defaultValue={selectedPerson}>
        <SelectTrigger className="w-[180px] mb-4">
          <SelectValue placeholder="Select person" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Altman">Altman</SelectItem>
          <SelectItem value="Musk">Musk</SelectItem>
        </SelectContent>
      </Select>
      <Line options={options} data={data} />
    </div>
  )
}

