import React from "react";
import { AlertCircle, Box, Cloud, Cpu, HardDrive } from "lucide-react";
import { GaugeChart } from "./GaugeChart";
import { mockData } from "../../lib/mockData";

export function SystemMetrics() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold dark:text-white">System Metrics</h2>
      <GaugeChart value={mockData.cpu} label="CPU Usage" icon={Cpu} />
      <GaugeChart
        value={mockData.memory}
        label="Memory Usage"
        icon={HardDrive}
      />
      <GaugeChart
        value={mockData.processes}
        label="Active Processes"
        icon={Box}
      />
      <GaugeChart value={mockData.webhooks} label="Webhooks" icon={Cloud} />
      <GaugeChart value={mockData.errors} label="Errors" icon={AlertCircle} />
    </div>
  );
}
