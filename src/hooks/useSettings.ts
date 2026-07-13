import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSettings } from "@/repositories/settings.repository";
import type { Settings } from "@/types";

export const emptySettings: Settings = {
  bakeryName: "",
  logoUrl: "",
  phone: "",
  whatsappUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  tiktokUrl: "",
  customLinks: [],
  address: "",
  openingHours: "",
  institutionalText: "",
  heroBanner: {
    id: "main",
    title: "",
    subtitle: "",
    ctaLabel: "",
    ctaHref: "/",
  },
};

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
}

export function useSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] }),
  });
}
