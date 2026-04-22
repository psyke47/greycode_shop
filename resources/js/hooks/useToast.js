import toast from 'react-hot-toast';

export const useToast = () => {
    const success = (message) => toast.success(message);
    const error = (message) => toast.error(message);
    const loading = (message) => toast.loading(message);
    const dismiss = (toastId) => toast.dismiss(toastId);
    
    return { success, error, loading, dismiss };
};