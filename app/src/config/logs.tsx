import { type LogDisplayInfo } from "@/types";
import {
  CircleMinus,
  CirclePlus,
  ClockAlert,
  DiamondMinus,
  DiamondPlus,
  EthernetPort,
  IdCard,
  LaptopMinimalCheck,
  Lock,
  LockOpen,
  Microchip,
  OctagonMinus,
  RectangleEllipsis,
  ShieldCheck,
  ShieldX,
  Siren,
} from "lucide-react";

export const LogDisplayInfos: Record<string, LogDisplayInfo> = {
  // Reference: [serialId, name]
  "device.create": {
    title: "Log.logs.device.create.title",
    text: ({ t, log, actionActor }) =>
      t.rich("Log.logs.device.create.text", {
        actor: actionActor,
        serialId: (log.reference?.[0] as string) ?? "",
        deviceName: (log.reference?.[1] as string) ?? "",
      }),
    icon: DiamondPlus,
    color: "success",
  },

  // Reference: [serialId, name]
  "device.delete": {
    title: "Log.logs.device.delete.title",
    text: ({ t, log, actionActor }) =>
      t.rich("Log.logs.device.delete.text", {
        actor: actionActor,
        serialId: (log.reference?.[0] as string) ?? "",
        deviceName: (log.reference?.[1] as string) ?? "",
      }),
    icon: DiamondMinus,
    color: "destructive",
  },

  // Reference: [serialId, name]
  "device.rename": {
    title: "Log.logs.device.rename.title",
    text: ({ t, log, actionActor }) =>
      t.rich("Log.logs.device.rename.text", {
        actor: actionActor,
        serialId: (log.reference?.[0] as string) ?? "",
        deviceName: (log.reference?.[1] as string) ?? "",
      }),
    icon: Microchip,
    color: "info",
  },

  // Reference: [serialId, name, reLockDelay]
  "device.re_lock_delay": {
    title: "Log.logs.device.re_lock_delay.title",
    text: ({ t, log, actionActor }) =>
      t.rich("Log.logs.device.re_lock_delay.text", {
        actor: actionActor,
        serialId: (log.reference?.[0] as string) ?? "",
        deviceName: (log.reference?.[1] as string) ?? "",
        reLockDelay: (log.reference?.[2] as string) ?? "",
      }),
    icon: ClockAlert,
    color: "warning",
  },

  // Reference: [serialId, name, [...newCardIds], [...toDelete]]
  "device.access_update": {
    title: "Log.logs.device.access_update.title",
    text: ({ t, log, actionActor }) =>
      t.rich("Log.logs.device.access_update.text", {
        actor: actionActor,
        serialId: (log.reference?.[0] as string) ?? "",
        deviceName: (log.reference?.[1] as string) ?? "",
        newCount: ((log.reference?.[2] as string[]) ?? []).length ?? 0,
        deleteCount: ((log.reference?.[3] as string[]) ?? []).length ?? 0,
      }),
    icon: IdCard,
    color: "info",
  },

  // Reference: [cardId, cardFingerprint, cardHolder]
  "device.add_card": {
    title: "Log.logs.device.add_card.title",
    text: ({ t, log, actionActor }) =>
      t.rich("Log.logs.device.add_card.text", {
        actor: actionActor,
        fingerprint: (log.reference?.[1] as string) ?? "",
        holder: (log.reference?.[2] as string) ?? "",
      }),
    icon: IdCard,
    color: "success",
  },

  // Reference: [cardId, cardFingerprint, cardHolder]
  "device.remove_card": {
    title: "Log.logs.device.remove_card.title",
    text: ({ t, log, actionActor }) =>
      t.rich("Log.logs.device.remove_card.text", {
        actor: actionActor,
        fingerprint: (log.reference?.[1] as string) ?? "",
        holder: (log.reference?.[2] as string) ?? "",
      }),
    icon: IdCard,
    color: "destructive",
  },

  // Reference: [serialId, name, isCard, cardFingerprint?, cardHolder?]
  "device.lock": {
    title: "Log.logs.device.lock.title",
    text: ({ t, log, actionActor }) => {
      const isCard = log.reference?.[2] === "true";

      return t.rich("Log.logs.device.lock.text", {
        actor: isCard
          ? ((log.reference?.[4] ?? actionActor) as string)
          : actionActor,
        serialId: (log.reference?.[0] as string) ?? "",
        deviceName: (log.reference?.[1] as string) ?? "",
        isCard,
        fingerprint: (log.reference?.[3] as string) ?? "",
      });
    },
    actor: ({ t, log, actionActor }) => {
      const actor = log.reference?.[4] as string;

      // from dashboard
      if (log.reference?.[2] === "false") {
        return actionActor;
      }

      if (actor === "NULL") {
        return t("Log.activity_card.by.unknown");
      }

      return actor ?? t("Log.activity_card.by.unknown");
    },
    icon: Lock,
    color: "destructive",
  },

  // Reference: [serialId, name, isCard, cardFingerprint?, cardHolder?]
  "device.unlock": {
    title: "Log.logs.device.unlock.title",
    text: ({ t, log, actionActor }) => {
      const isCard = log.reference?.[2] === "true";

      return t.rich("Log.logs.device.unlock.text", {
        actor: isCard
          ? ((log.reference?.[4] ?? actionActor) as string)
          : actionActor,
        serialId: (log.reference?.[0] as string) ?? "",
        deviceName: (log.reference?.[1] as string) ?? "",
        isCard,
        fingerprint: (log.reference?.[3] as string) ?? "",
      });
    },
    actor: ({ t, log, actionActor }) => {
      console.log(log.action, log.reference?.toString());
      const actor = log.reference?.[4] as string;

      // from dashboard
      if (log.reference?.[2] === "false") {
        return actionActor;
      }

      if (actor === "NULL") {
        return t("Log.activity_card.by.unknown");
      }

      return actor ?? t("Log.activity_card.by.unknown");
    },
    icon: LockOpen,
    color: "success",
  },

  // Reference: [serialId, name, emergencyState]
  "device.emergency_state": {
    title: "Log.logs.device.emergency_state.title",
    text: ({ t, log, actionActor }) =>
      t.rich("Log.logs.device.emergency_state.text", {
        actor: actionActor,
        serialId: (log.reference?.[0] as string) ?? "",
        deviceName: (log.reference?.[1] as string) ?? "",
        emergencyState: (log.reference?.[2] as string) ?? "",
      }),
    icon: Siren,
    color: "destructive",
  },

  // Reference: [serialId, name, fingerprint]
  "device.access_denied": {
    title: "Log.logs.device.access_denied.title",
    text: ({ t, log, actionActor }) =>
      t.rich("Log.logs.device.access_denied.text", {
        actor: actionActor,
        serialId: (log.reference?.[0] as string) ?? "",
        deviceName: (log.reference?.[1] as string) ?? "",
        fingerprint: (log.reference?.[2] as string) ?? "",
      }),
    icon: ShieldX,
    color: "destructive",
  },

  // Reference: [serialId]
  "device_status.pending_adoption": {
    title: "Log.logs.device_status.pending_adoption.title",
    text: ({ t, actionActor }) =>
      t.rich("Log.logs.device_status.pending_adoption.text", {
        actor: actionActor,
      }),
    icon: RectangleEllipsis,
    color: "warning",
  },

  // Reference: [serialId]
  "device_status.adopting": {
    title: "Log.logs.device_status.adopting.title",
    text: ({ t, actionActor }) =>
      t.rich("Log.logs.device_status.adopting.text", {
        actor: actionActor,
      }),
    icon: EthernetPort,
    color: "info",
  },

  // Reference: [serialId]
  "device_status.adopted": {
    title: "Log.logs.device_status.adopted.title",
    text: ({ t, actionActor }) =>
      t.rich("Log.logs.device_status.adopted.text", {
        actor: actionActor,
      }),
    icon: LaptopMinimalCheck,
    color: "success",
  },

  // Reference: [fingerprint, holder, active]
  "card.create": {
    title: "Log.logs.card.create.title",
    text: ({ t, log, actionActor }) =>
      t.rich("Log.logs.card.create.text", {
        actor: actionActor,
        fingerprint: (log.reference?.[0] as string) ?? "",
        holder: (log.reference?.[1] as string) ?? "",
      }),
    icon: CirclePlus,
    color: "success",
  },

  // Reference: [fingerprint, holder, active]
  "card.delete": {
    title: "Log.logs.card.delete.title",
    text: ({ t, log, actionActor }) =>
      t.rich("Log.logs.card.delete.text", {
        actor: actionActor,
        fingerprint: (log.reference?.[0] as string) ?? "",
        holder: (log.reference?.[1] as string) ?? "",
      }),
    icon: CircleMinus,
    color: "destructive",
  },

  // Reference: [fingerprint, holder]
  "card.rename": {
    title: "Log.logs.card.rename.title",
    text: ({ t, log, actionActor }) =>
      t.rich("Log.logs.card.rename.text", {
        actor: actionActor,
        fingerprint: (log.reference?.[0] as string) ?? "",
        holder: (log.reference?.[1] as string) ?? "",
      }),
    icon: IdCard,
    color: "info",
  },

  // Reference: [fingerprint, holder]
  "card.activate": {
    title: "Log.logs.card.activate.title",
    text: ({ t, log, actionActor }) =>
      t.rich("Log.logs.card.activate.text", {
        actor: actionActor,
        fingerprint: (log.reference?.[0] as string) ?? "",
        holder: (log.reference?.[1] as string) ?? "",
      }),
    icon: ShieldCheck,
    color: "success",
  },

  // Reference: [fingerprint, holder]
  "card.deactivate": {
    title: "Log.logs.card.deactivate.title",
    text: ({ t, log, actionActor }) =>
      t.rich("Log.logs.card.deactivate.text", {
        actor: actionActor,
        fingerprint: (log.reference?.[0] as string) ?? "",
        holder: (log.reference?.[1] as string) ?? "",
      }),
    icon: OctagonMinus,
    color: "warning",
  },

  // Reference: [fingerprint, holder, [...newDeviceIds], [...toDelete]]
  "card.access_update": {
    title: "Log.logs.card.access_update.title",
    text: ({ t, log, actionActor }) =>
      t.rich("Log.logs.card.access_update.text", {
        actor: actionActor,
        fingerprint: (log.reference?.[0] as string) ?? "",
        holder: (log.reference?.[1] as string) ?? "",
        newCount: ((log.reference?.[2] as string[]) ?? []).length ?? 0,
        deleteCount: ((log.reference?.[3] as string[]) ?? []).length ?? 0,
      }),
    icon: IdCard,
    color: "info",
  },

  // Reference: [deviceId, deviceSerialId, deviceName]
  "card.add_device": {
    title: "Log.logs.card.add_device.title",
    text: ({ t, log, actionActor }) =>
      t.rich("Log.logs.card.add_device.text", {
        actor: actionActor,
        serialId: (log.reference?.[1] as string) ?? "",
        deviceName: (log.reference?.[2] as string) ?? "",
      }),
    icon: Microchip,
    color: "success",
  },

  // Reference: [deviceId, deviceSerialId, deviceName]
  "card.remove_device": {
    title: "Log.logs.card.remove_device.title",
    text: ({ t, log, actionActor }) =>
      t.rich("Log.logs.card.remove_device.text", {
        actor: actionActor,
        serialId: (log.reference?.[1] as string) ?? "",
        deviceName: (log.reference?.[2] as string) ?? "",
      }),
    icon: Microchip,
    color: "destructive",
  },

  // Reference: [fingerprint, holder, deviceSerialId, deviceName]
  "card.lock": {
    title: "Log.logs.card.lock.title",
    text: ({ t, log }) =>
      t.rich("Log.logs.card.lock.text", {
        actor: (log.reference?.[1] as string) ?? "",
        fingerprint: (log.reference?.[0] as string) ?? "",
        serialId: (log.reference?.[2] as string) ?? "",
        deviceName: (log.reference?.[3] as string) ?? "",
      }),
    actor: ({ t, log }) => {
      const actor = log.reference?.[1] as string;

      if (actor === "NULL") {
        return t("Log.activity_card.by.unknown");
      }

      return actor ?? t("Log.activity_card.by.unknown");
    },
    icon: Lock,
    color: "destructive",
  },

  // Reference: [fingerprint, holder, deviceSerialId, deviceName]
  "card.unlock": {
    title: "Log.logs.card.unlock.title",
    text: ({ t, log }) =>
      t.rich("Log.logs.card.unlock.text", {
        actor: (log.reference?.[1] as string) ?? "",
        fingerprint: (log.reference?.[0] as string) ?? "",
        serialId: (log.reference?.[2] as string) ?? "",
        deviceName: (log.reference?.[3] as string) ?? "",
      }),
    actor: ({ t, log }) => {
      const actor = log.reference?.[1] as string;

      if (actor === "NULL") {
        return t("Log.activity_card.by.unknown");
      }

      return actor ?? t("Log.activity_card.by.unknown");
    },
    icon: LockOpen,
    color: "success",
  },
};
