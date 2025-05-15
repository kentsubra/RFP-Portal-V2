import { toast as sonnerToast } from 'sonner';
import React from 'react';

// This is a simplified mock of the toast component API for testing
export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export const useToast = () => {
  return {
    toast: (props: ToastProps) => {
      sonnerToast(
        React.createElement(
          'span',
          null,
          props.title ? React.createElement('strong', null, props.title) : null,
          props.description ? ' ' + props.description : null
        )
      );
    },
    toasts: [],
    success: (message: string) => sonnerToast.success(message),
    error: (message: string) => sonnerToast.error(message),
    info: (message: string) => sonnerToast(message),
  };
}; 