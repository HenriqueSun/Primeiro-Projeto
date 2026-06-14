import { Facebook, Instagram, MessageCircle, Music2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/appStore";
import type { SocialPlatform } from "@/types";

const socialItems: Array<{
  platform: SocialPlatform;
  label: string;
  icon: ReactNode;
  keyName: "instagramUrl" | "whatsappUrl" | "facebookUrl" | "tiktokUrl";
}> = [
  { platform: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4" />, keyName: "instagramUrl" },
  { platform: "whatsapp", label: "WhatsApp", icon: <MessageCircle className="h-4 w-4" />, keyName: "whatsappUrl" },
  { platform: "facebook", label: "Facebook", icon: <Facebook className="h-4 w-4" />, keyName: "facebookUrl" },
  { platform: "tiktok", label: "TikTok", icon: <Music2 className="h-4 w-4" />, keyName: "tiktokUrl" },
];

export function SocialLinks({ compact = false }: { compact?: boolean }) {
  const settings = useAppStore((state) => state.settings);
  const trackSocialClick = useAppStore((state) => state.trackSocialClick);

  return (
    <div className="flex flex-wrap gap-2">
      {socialItems.map((item) => (
        <Button key={item.platform} variant="outline" size={compact ? "icon" : "sm"} asChild>
          <a
            href={settings[item.keyName] || "#"}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
            onClick={() => trackSocialClick(item.platform)}
          >
            {item.icon}
            {!compact ? item.label : null}
          </a>
        </Button>
      ))}
    </div>
  );
}
