"use client"

import { Button } from "@/components/ui/button"

export default function RewardsSection() {
  const claimRewards = () => {
    console.log("Claiming rewards")
    // Here you would integrate with your RLUSD settlement layer to claim rewards
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Your Position & Rewards</h2>
      <div className="space-y-2 mb-4">
        <p>Current Position: Long on Altman</p>
        <p>Potential Reward: 100 RLUSD</p>
      </div>
      <Button onClick={claimRewards} className="w-full">
        Claim Rewards
      </Button>
    </div>
  )
}

