import { toast } from 'react-toastify';

// Default toast configuration
const defaultOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Success toast
export const showSuccess = (message, options = {}) => {
  return toast.success(message, { ...defaultOptions, ...options });
};

// Error toast
export const showError = (message, options = {}) => {
  return toast.error(message, { ...defaultOptions, ...options });
};

// Info toast
export const showInfo = (message, options = {}) => {
  return toast.info(message, { ...defaultOptions, ...options });
};

// Warning toast
export const showWarning = (message, options = {}) => {
  return toast.warning(message, { ...defaultOptions, ...options });
};

// Default toast
export const showToast = (message, options = {}) => {
  return toast(message, { ...defaultOptions, ...options });
};

// Custom toast with dark theme
export const showDark = (message, options = {}) => {
  return toast.dark(message, { ...defaultOptions, ...options });
};

// Custom toast with icon
export const showCustom = (message, icon, options = {}) => {
  return toast(
    <div className="custom-toast">
      <span className="toast-icon">{icon}</span>
      <span className="toast-message">{message}</span>
    </div>,
    { ...defaultOptions, ...options }
  );
}; 