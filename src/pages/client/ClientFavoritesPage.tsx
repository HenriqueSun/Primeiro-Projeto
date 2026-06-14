import { Heart } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/ui/skeleton";
import { useAppStore } from "@/store/appStore";

export function ClientFavoritesPage() {
  const products = useAppStore((state) => state.products);
  const favoriteProductIds = useAppStore((state) => state.favoriteProductIds);
  const favorites = products.filter((product) => favoriteProductIds.includes(product.id));

  return (
    <div>
      <PageHeader
        title="Favoritos"
        description="Produtos salvos para encomendar depois ou acompanhar novidades."
      />

      {favorites.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum favorito ainda"
          description="Toque no coração dos produtos para criar sua lista de desejos."
          action={<Heart className="mx-auto h-8 w-8 text-primary" />}
        />
      )}
    </div>
  );
}
