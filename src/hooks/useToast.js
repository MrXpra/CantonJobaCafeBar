import { toast } from 'react-hot-toast';

export function useToast() {
  const showSuccess = (message) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right'
    });
  };

  const showError = (message) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right'
    });
  };

  const showLoading = (message) => {
    return toast.loading(message, {
      position: 'top-right'
    });
  };

  return {
    showSuccess,
    showError,
    showLoading,
    dismiss: toast.dismiss
  };
}