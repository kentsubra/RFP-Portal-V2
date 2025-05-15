// Minimal implementation of toast for testing
type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export const useToast = () => {
  const toast = (props: ToastProps) => {
    console.log(`Toast: ${props.title} - ${props.description}`);
  };

  return { toast };
}; 