import Swal from "sweetalert2";
import { toast, ToastOptions } from "react-toastify";

// Helper for consistent react-toastify options
const toastConfig: ToastOptions = {
  position: "bottom-right",
  autoClose: 3500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showSuccess = (message: string) => {
  toast.success(message, {
    ...toastConfig,
    toastId: `success-${message.replace(/\s+/g, "-")}`, // prevent duplicates
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    ...toastConfig,
    toastId: `error-${message.replace(/\s+/g, "-")}`,
  });
};

export const showWarning = (message: string) => {
  toast.warning(message, {
    ...toastConfig,
    toastId: `warning-${message.replace(/\s+/g, "-")}`,
  });
};

export const showInfo = (message: string) => {
  toast.info(message, {
    ...toastConfig,
    toastId: `info-${message.replace(/\s+/g, "-")}`,
  });
};

// Reusable SweetAlert confirm utility
export const confirmDelete = async (title: string, text: string) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    buttonsStyling: false,
    customClass: {
      popup: "!rounded-[24px] !border !border-slate-800 !shadow-2xl !font-sans !p-6 max-w-sm",
      title: "!text-white !font-extrabold !text-xl !pt-2 !block",
      htmlContainer: "!text-slate-300 !text-sm !pt-2 !leading-relaxed !block",
      actions: "flex justify-end gap-3 pt-4 w-full",
      confirmButton: "!bg-rose-600 hover:!bg-rose-700 !text-white !font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-destructive text-sm min-w-[100px]",
      cancelButton: "!bg-slate-700 hover:!bg-slate-600 !text-slate-100 !font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm min-w-[100px]",
    },
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    background: "#0f172a",
  });
  
  return result.isConfirmed;
};

// Reusable SweetAlert simple modal alert
export const showAlert = async (title: string, text: string, icon: "success" | "error" | "warning" | "info" = "info") => {
  await Swal.fire({
    title,
    text,
    icon,
    buttonsStyling: false,
    customClass: {
      popup: "!rounded-[24px] !border !border-slate-800 !shadow-2xl !font-sans !p-6 max-w-sm",
      title: "!text-white !font-extrabold !text-xl !pt-2 !block",
      htmlContainer: "!text-slate-300 !text-sm !pt-2 !leading-relaxed !block",
      actions: "flex justify-center pt-4 w-full",
      confirmButton: "!bg-indigo-600 hover:!bg-indigo-700 !text-white !font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-sm min-w-[120px]",
    },
    background: "#0f172a",
  });
};

// Reusable SweetAlert confirm edit utility
export const confirmEditPrompt = async (title: string, text: string) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    buttonsStyling: false,
    customClass: {
      popup: "!rounded-[24px] !border !border-slate-800 !shadow-2xl !font-sans !p-6 max-w-sm",
      title: "!text-white !font-extrabold !text-xl !pt-2 !block",
      htmlContainer: "!text-slate-300 !text-sm !pt-2 !leading-relaxed !block",
      actions: "flex justify-end gap-3 pt-4 w-full",
      confirmButton: "!bg-indigo-600 hover:!bg-indigo-700 !text-white !font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-sm min-w-[100px]",
      cancelButton: "!bg-slate-700 hover:!bg-slate-600 !text-slate-100 !font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm min-w-[100px]",
    },
    confirmButtonText: "Yes, Edit",
    cancelButtonText: "Cancel",
    background: "#0f172a",
  });
  
  return result.isConfirmed;
};
