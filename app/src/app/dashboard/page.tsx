import { ChartAccessForWeek } from "@/components/dashboard/charts/access/chart-access-for-week";
import { ChartDashboardAccessForWeek } from "@/components/dashboard/charts/access/chart-dashboard-access-for-week";
import { ChartActiveUsersForWeek } from "@/components/dashboard/charts/active-users/chart-active-users-for-week";
import { ChartDashboardActiveUsersForWeek } from "@/components/dashboard/charts/active-users/chart-dashboard-active-users-for-week";
import { ChartEmergencyForWeek } from "@/components/dashboard/charts/emergency/chart-emergency-for-week";
import { DashboardRecentAccessCard } from "@/components/dashboard/dashboard-recent-access-card";
import { DemoAlert } from "@/components/demo/demo-alert";
import { DeviceEmergencyCountAlert } from "@/components/devices/device-emergency-count-alert";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <DemoAlert />
      <DeviceEmergencyCountAlert href="/dashboard/devices?emergencyState=lockdown,evacuation" />

      <div className="flex h-full flex-1 gap-6">
        <DashboardRecentAccessCard className="w-full max-w-96 max-lg:hidden" />

        <div className="flex flex-1 flex-col gap-4">
          <Card className="h-full w-full bg-border px-2 py-4">
            <div className="sticky top-0 flex flex-wrap justify-center gap-4">
              <ChartDashboardAccessForWeek className="2xl:w-[49%]" />
              <ChartAccessForWeek className="2xl:w-[49%]" />
              <ChartDashboardActiveUsersForWeek className="2xl:w-[49%]" />
              <ChartActiveUsersForWeek className="2xl:w-[49%]" />
              <ChartEmergencyForWeek />
            <div className="sticky top-0 grid justify-center gap-4 2xl:grid-cols-2">
              <ChartDashboardAccessForWeek />
              <ChartAccessForWeek />
              <ChartDashboardActiveUsersForWeek />
              <ChartActiveUsersForWeek />
              <ChartEmergencyForWeek className="2xl:col-span-2" />
            </div>
          </Card>

          <DashboardRecentAccessCard className="lg:hidden" />
        </div>
      </div>
    </div>
  );
}
