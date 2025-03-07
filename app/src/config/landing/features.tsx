import {
  Activity,
  Bell,
  Cctv,
  Clock,
  FileWarning,
  Lock,
  Shield,
  Smartphone,
  Users,
} from "lucide-react";
import * as React from "react";

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
  comingSoon?: boolean;
};

export const features: Feature[] = [
  {
    icon: <Shield className="size-10 text-info" />,
    title: "Landing.features.feature.1.title",
    description: "Landing.features.feature.1.description",
  },
  {
    icon: <Smartphone className="size-10 text-info" />,
    title: "Landing.features.feature.2.title",
    description: "Landing.features.feature.2.description",
  },
  {
    icon: <Clock className="size-10 text-info" />,
    title: "Landing.features.feature.3.title",
    description: "Landing.features.feature.3.description",
    comingSoon: true,
  },
  {
    icon: <Users className="size-10 text-info" />,
    title: "Landing.features.feature.4.title",
    description: "Landing.features.feature.4.description",
  },
  {
    icon: <Activity className="size-10 text-info" />,
    title: "Landing.features.feature.5.title",
    description: "Landing.features.feature.5.description",
  },
  {
    icon: <Bell className="size-10 text-info" />,
    title: "Landing.features.feature.6.title",
    description: "Landing.features.feature.6.description",
    comingSoon: true,
  },
  {
    icon: <FileWarning className="size-10 text-info" />,
    title: "Landing.features.feature.7.title",
    description: "Landing.features.feature.7.description",
  },
  {
    icon: <Cctv className="size-10 text-info" />,
    title: "Landing.features.feature.8.title",
    description: "Landing.features.feature.8.description",
    comingSoon: true,
  },
  {
    icon: <Lock className="size-10 text-info" />,
    title: "Landing.features.feature.9.title",
    description: "Landing.features.feature.9.description",
  },
];
