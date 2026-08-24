type NotificationVariant = "success" | "error";

interface NotificationProps {
  message: string;
  variant?: NotificationVariant;
  onClose?: () => void;
}

export default function Notification({
  message,
  variant = "success",
  onClose,
}: NotificationProps) {
  if (!message) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 w-full max-w-sm rounded-md border p-4 shadow-lg transition-all duration-300 ${
        variant === "success"
          ? "border-emerald-400 bg-emerald-600/95 text-white"
          : "border-red-500 bg-red-600/95 text-white"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm leading-5">{message}</p>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 px-2 py-1 text-xs font-bold text-white transition hover:bg-white/10"
            aria-label="Fechar notificação"
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
