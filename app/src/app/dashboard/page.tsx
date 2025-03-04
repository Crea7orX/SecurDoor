import { ChartAccessForWeek } from "@/components/dashboard/charts/access/chart-access-for-week";
import { ChartDashboardAccessForWeek } from "@/components/dashboard/charts/access/chart-dashboard-access-for-week";
import { DashboardRecentAccessCard } from "@/components/dashboard/dashboard-recent-access-card";
import { DeviceEmergencyCountAlert } from "@/components/devices/device-emergency-count-alert";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <DeviceEmergencyCountAlert href="/dashboard/devices?emergencyState=lockdown,evacuation" />
      <div className="flex h-full flex-1 gap-6">
        <DashboardRecentAccessCard className="w-full max-w-96 max-lg:hidden" />

        <div className="flex flex-1 flex-col gap-4">
          <Card className="h-full w-full bg-border px-2 py-4">
            <div className="sticky top-0 flex flex-wrap justify-center gap-4">
              <ChartDashboardAccessForWeek className="2xl:w-[49%]" />
              <ChartAccessForWeek className="2xl:w-[49%]" />
            </div>
          </Card>

          <DashboardRecentAccessCard className="lg:hidden" />
        </div>
      </div>
    </div>
  );
}
