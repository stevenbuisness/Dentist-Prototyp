// Refined use-toast to avoid native browser alerts!

export function useToast() {
  const toast = ({ title, description, variant }: { title: string; description?: string; variant?: string }) => {
    // Basic DOM-based headless toast to avoid ugly window.alert
    const toastEl = document.createElement("div");
    
    // Style it nicely
    toastEl.className = `fixed bottom-4 right-4 z-50 flex flex-col gap-1 px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom border ${
      variant === "destructive" 
        ? "bg-red-50 text-red-900 border-red-200" 
        : "bg-stone-900 text-white border-stone-800"
    }`;
    
    toastEl.innerHTML = `
      <div class="font-bold flex items-center gap-2 text-sm">
        ${variant === "destructive" ? "🚨 " : "✅ "} ${title}
      </div>
      ${description ? `<div class="text-xs opacity-90">${description}</div>` : ""}
    `;
    
    document.body.appendChild(toastEl);
    
    setTimeout(() => {
      toastEl.classList.add("fade-out", "slide-out-to-bottom-full");
      toastEl.style.opacity = "0";
      setTimeout(() => toastEl.remove(), 300);
    }, 3500);
    
    if (variant === "destructive") {
        console.error(`${title}: ${description}`);
    } else {
        console.log(`${title}: ${description}`);
    }
  };

  return { toast };
}
