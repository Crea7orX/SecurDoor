import { create } from "zustand";
import { persist } from "zustand/middleware";

type View = "grid" | "list";

interface DataTableViewStore {
  view: View;
  setView: (view: View) => void;
}

const useDataTableViewStore = create<DataTableViewStore>()(
  persist(
    (set) => ({
      view: "grid",
      setView: (view) => set({ view }),
    }),
    { name: "data-table-view" },
  ),
);

export { useDataTableViewStore };
