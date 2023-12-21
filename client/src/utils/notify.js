import toast from "react-hot-toast";

export const notify = (message, { duration = 4000, type = "info" } = {}) => {
  const options = { duration };

  if (type === "info") {
    toast(message, {
      ...options,
    });
  } else if (type === "error") {
    toast.error(message, options);
  } else {
    toast.success(message, options);
  }
};
