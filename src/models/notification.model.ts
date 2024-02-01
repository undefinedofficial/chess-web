interface Notify {
  id: number;
  type?: "info" | "warn" | "error";
  icon?: string;
  title: string;
  description?: string;
  timeout?: number;
  closable?: boolean;
  feedback?: boolean;
  accept?: () => void;
  reject?: () => void;
}

export type { Notify };
