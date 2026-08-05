import { changeAvatar } from "@/services/auth.services";
import { useMutation } from "@tanstack/react-query";

export const useChangeAvatar = () => {
  return useMutation({
    mutationFn: changeAvatar,
  });
};
