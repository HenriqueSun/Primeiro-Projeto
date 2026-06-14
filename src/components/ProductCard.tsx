import { Heart, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/store/appStore";
import type { Product } from "@/types";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatters";

const statusLabel = {
  available: "Disponível",
  sold_out: "Esgotado",
  inactive: "Inativo",
};

const badgeLabel = {
  promotion: "Promoção",
  best_seller: "Mais vendido",
  new: "Novo",
  weekly: "Produto da semana",
};

export function ProductCard({
  product,
  compact = false,
  onDetails,
}: {
  product: Product;
  compact?: boolean;
  onDetails?: (product: Product) => void;
}) {
  const settings = useAppStore((state) => state.settings);
  const favoriteProductIds = useAppStore((state) => state.favoriteProductIds);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const trackSocialClick = useAppStore((state) => state.trackSocialClick);
  const isFavorite = favoriteProductIds.includes(product.id);
  const badges = product.badges ?? [];

  const shareText = `Conheça ${product.name} na Doceria Dona Lu`;

  const shareProduct = async () => {
    trackSocialClick("share");

    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: shareText,
        url: window.location.href,
      });
      return;
    }

    await navigator.clipboard?.writeText(`${shareText} - ${window.location.href}`);
    toast.success("Link do produto copiado.");
  };

  return (
    <Card
      className="group overflow-hidden transition active:scale-[0.98] hover:-translate-y-1 hover:shadow-lg"
      role={onDetails ? "button" : undefined}
      tabIndex={onDetails ? 0 : undefined}
      onClick={() => onDetails?.(product)}
      onKeyDown={(event) => {
        if (onDetails && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onDetails(product);
        }
      }}
    >
      <div className="relative h-52 bg-gradient-to-br from-secondary via-white to-accent">
        {product.imageUrl ? (
          <img
            loading="lazy"
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : null}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge
            variant={product.status === "available" ? "success" : "warning"}
          >
            {statusLabel[product.status]}
          </Badge>
          {badges.slice(0, compact ? 1 : 2).map((badge) => (
            <Badge key={badge} variant={badge === "promotion" ? "danger" : "secondary"}>
              {badgeLabel[badge]}
            </Badge>
          ))}
        </div>
        <div className="absolute right-3 top-3 flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            className="min-h-11 min-w-11 rounded-full"
            onClick={(event) => {
              event.stopPropagation();
              toggleFavorite(product.id);
              toast.success(isFavorite ? "Removido dos favoritos." : "Salvo nos favoritos.");
            }}
          >
            <Heart className={cn("h-5 w-5", isFavorite && "fill-primary text-primary")} />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label="Compartilhar produto"
            className="min-h-11 min-w-11 rounded-full"
            onClick={(event) => {
              event.stopPropagation();
              void shareProduct().catch(() => undefined);
            }}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <CardContent className={cn("space-y-3 p-4", compact && "p-3")}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {product.category}
          </p>
          <h3 className="mt-1 font-semibold">{product.name}</h3>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.shortDescription}
        </p>
        <div className="flex items-center justify-between">
          <strong className="text-primary">{formatCurrency(product.price)}</strong>
          {product.productOfDay ? <Badge variant="secondary">Do dia</Badge> : null}
        </div>
        {product.promotionLabel ? (
          <p className="rounded-lg bg-secondary px-3 py-2 text-xs font-semibold text-primary">
            {product.promotionLabel}
          </p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          className="min-h-11 w-full"
          onClick={(event) => {
            event.stopPropagation();
            trackSocialClick("whatsapp");
            window.open(
              `${settings.whatsappUrl}&text=${encodeURIComponent(`Olá! Quero saber mais sobre ${product.name}.`)}`,
              "_blank",
              "noreferrer",
            );
          }}
        >
          <MessageCircle className="h-4 w-4" />
          Fazer encomenda
        </Button>
      </CardContent>
    </Card>
  );
}
