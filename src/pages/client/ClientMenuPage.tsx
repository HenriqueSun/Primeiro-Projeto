import { Clock, Flame, LayoutGrid, List, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label, Select } from "@/components/ui/form";
import { EmptyState } from "@/components/ui/skeleton";
import { useAppStore } from "@/store/appStore";
import type { Product, ProductCategory, ProductStatus } from "@/types";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatters";

const categories: Array<ProductCategory | "Todas"> = [
  "Todas",
  "Bolos",
  "Doces",
  "Sobremesas",
  "Salgados",
];

export function ClientMenuPage() {
  const products = useAppStore((state) => state.products);
  const searchHistory = useAppStore((state) => state.searchHistory);
  const addSearchTerm = useAppStore((state) => state.addSearchTerm);
  const clearSearchHistory = useAppStore((state) => state.clearSearchHistory);
  const trackProductView = useAppStore((state) => state.trackProductView);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory | "Todas">("Todas");
  const [status, setStatus] = useState<ProductStatus | "all">("all");
  const [price, setPrice] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesQuery = product.name
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesCategory = category === "Todas" || product.category === category;
        const matchesStatus = status === "all" || product.status === status;
        const matchesPrice =
          price === "all" ||
          (price === "low" && product.price <= 10) ||
          (price === "medium" && product.price > 10 && product.price <= 50) ||
          (price === "high" && product.price > 50);

        return matchesQuery && matchesCategory && matchesStatus && matchesPrice;
      }),
    [category, price, products, query, status],
  );
  const suggestions = useMemo(
    () =>
      products
        .filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 4),
    [products, query],
  );
  const popularProducts = [...products].sort((a, b) => b.views - a.views).slice(0, 4);

  const openDetails = (product: Product) => {
    trackProductView(product.id);
    addSearchTerm(product.name);
    setSelectedProduct(product);
  };

  return (
    <div>
      <PageHeader
        title="Cardápio Completo"
        description="Explore todos os produtos da doceria com busca, filtros e detalhes."
      />

      <Card className="mb-5">
        <CardContent className="grid gap-4 p-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <div className="space-y-2">
            <Label htmlFor="search">Busca</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                className="pl-9"
                placeholder="Buscar por nome"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  addSearchTerm(event.target.value);
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as ProductCategory | "Todas")
              }
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Preço</Label>
            <Select value={price} onChange={(event) => setPrice(event.target.value)}>
              <option value="all">Todos</option>
              <option value="low">Até R$ 10</option>
              <option value="medium">R$ 10 a R$ 50</option>
              <option value="high">Acima de R$ 50</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Disponibilidade</Label>
            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value as ProductStatus | "all")}
            >
              <option value="all">Todos</option>
              <option value="available">Disponível</option>
              <option value="sold_out">Esgotado</option>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button
              variant={view === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("grid")}
              aria-label="Visualizar em grid"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("list")}
              aria-label="Visualizar em lista"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center gap-2 font-semibold">
                <Clock className="h-4 w-4 text-primary" />
                Histórico de busca
              </p>
              {searchHistory.length ? (
                <Button variant="ghost" size="sm" onClick={clearSearchHistory}>
                  <X className="h-4 w-4" />
                  Limpar
                </Button>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.length ? (
                searchHistory.map((term) => (
                  <Button key={term} variant="secondary" size="sm" onClick={() => setQuery(term)}>
                    {term}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Suas buscas aparecem aqui.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="mb-3 flex items-center gap-2 font-semibold">
              <Flame className="h-4 w-4 text-primary" />
              Produtos populares
            </p>
            <div className="flex flex-wrap gap-2">
              {(query ? suggestions : popularProducts).map((product) => (
                <Button
                  key={product.id}
                  variant="outline"
                  size="sm"
                  onClick={() => openDetails(product)}
                >
                  {product.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {filteredProducts.length ? (
        <div
          className={cn(
            view === "grid"
              ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
              : "space-y-3",
          )}
        >
          {filteredProducts.map((product) =>
            view === "grid" ? (
              <div
                key={product.id}
              >
                <ProductCard product={product} onDetails={openDetails} />
              </div>
            ) : (
              <button
                key={product.id}
                type="button"
                className="w-full rounded-xl border bg-card p-4 text-left transition hover:bg-secondary/50"
                onClick={() => openDetails(product)}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.shortDescription}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{product.category}</Badge>
                    <strong className="text-primary">
                      {formatCurrency(product.price)}
                    </strong>
                  </div>
                </div>
              </button>
            ),
          )}
        </div>
      ) : (
        <EmptyState
          title="Nenhum produto encontrado"
          description="Ajuste os filtros ou tente buscar por outro nome."
        />
      )}

      <Dialog
        open={Boolean(selectedProduct)}
        title={selectedProduct?.name ?? ""}
        description={selectedProduct?.fullDescription}
        cancelLabel="Fechar"
        onClose={() => setSelectedProduct(null)}
      >
        {selectedProduct ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{selectedProduct.category}</Badge>
              <Badge>{selectedProduct.status === "available" ? "Disponível" : "Esgotado"}</Badge>
              {(selectedProduct.badges ?? []).map((badge) => (
                <Badge key={badge} variant="secondary">{badge}</Badge>
              ))}
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(selectedProduct.price)}
            </p>
            <div>
              <p className="font-semibold">Ingredientes</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedProduct.ingredients.join(", ")}
              </p>
            </div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
