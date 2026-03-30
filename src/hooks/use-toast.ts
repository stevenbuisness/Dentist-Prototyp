// Simplified use-toast for early phase

export function useToast() {
  const toast = ({ title, description, variant }: { title: string; description?: string; variant?: string }) => {
    // Basic browser alert for now, or we can build a proper UI component
    const message = `${title}: ${description || ""}`;
    if (variant === "destructive") {
        console.error(message);
        alert("🚨 " + message);
    } else {
        console.log(message);
        alert("✅ " + message);
    }
  };

  return { toast };
}
