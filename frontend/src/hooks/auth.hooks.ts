import {
  changePassword,
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
  verifyOtp,
} from "@/services/auth.services";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyOtp,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};
