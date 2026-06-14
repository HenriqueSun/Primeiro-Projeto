import { useQuery } from "@tanstack/react-query";
import { BellRing, CalendarDays, Flame, Gift, Instagram, Star, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { PageHeader } from "@/components/PageHeader";
import { SocialLinks } from "@/components/SocialLinks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getBanners } from "@/services/mockApi";
import { useAppStore } from "@/store/appStore";

export function ClientDashboard() {
  const products = useAppStore((state) => state.products);
  const notifications = useAppStore((state) => state.notifications);
  const coupons = useAppStore((state) => state.coupons);
  const loyalty = useAppStore((state) => state.loyaltyAccount);
  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  const featured = products.filter((product) => product.featuredWeek);
  const productOfDay = products.filter((product) => product.productOfDay);
  const [activeBanner, setActiveBanner] = useState(0);
  const currentBanner = banners?.[activeBanner] ?? banners?.[0];
  const loyaltyProgress = Math.min(
    Math.round((loyalty.points / loyalty.nextReward.requiredPoints) * 100),
    100,
  );

  useEffect(() => {
    if (!banners?.length) return;

    const timer = window.setInterval(() => {
      setActiveBanner((current) => (current + 1) % banners.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [banners]);

  return (
    <div>
      <PageHeader
        title="Página Inicial"
        description="Promoções, produtos em destaque, avisos e novidades da semana."
      />

      {isLoading ? (
        <Skeleton className="mb-6 h-64" />
      ) : (
        <section className="mb-6 overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-xl">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <Flame className="h-4 w-4" />
                Promoções da semana
              </div>
              <h2 className="max-w-3xl text-balance text-3xl font-black sm:text-5xl">
                {currentBanner?.title}
              </h2>
              <p className="max-w-2xl text-primary-foreground/80">
                {currentBanner?.subtitle}
              </p>
              <Button variant="secondary" asChild>
                <Link to={currentBanner?.ctaHref ?? "/cliente/cardapio"}>
                  {currentBanner?.ctaLabel ?? "Ver cardápio"}
                </Link>
              </Button>
              <div className="flex gap-2">
                {banners?.map((banner, index) => (
                  <button
                    key={banner.id}
                    type="button"
                    aria-label={`Ver banner ${index + 1}`}
                    className={`h-2.5 rounded-full transition ${index === activeBanner ? "w-8 bg-white" : "w-2.5 bg-white/40"}`}
                    onClick={() => setActiveBanner(index)}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-sm uppercase tracking-wide text-primary-foreground/70">
                Produto do dia
              </p>
              <h3 className="mt-2 text-2xl font-bold">
                {productOfDay[0]?.name ?? "Especial Dona Lu"}
              </h3>
              <p className="mt-2 text-sm text-primary-foreground/75">
                Selecionado fresco para hoje, com preparo artesanal.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Produtos em Destaque</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-3">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Fidelidade Dona Lu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{loyalty.points} pontos</p>
            <p className="mt-2 text-sm text-primary-foreground/80">
              Próxima recompensa: {loyalty.nextReward.title}
            </p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/20">
              <div className="h-full bg-white" style={{ width: `${loyaltyProgress}%` }} />
            </div>
            <Button className="mt-4 w-full" variant="secondary" asChild>
              <Link to="/cliente/fidelidade">Ver benefícios</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Cupons disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-primary">{coupons.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Use em encomendas futuras e campanhas especiais.
            </p>
            <Button className="mt-4 w-full" variant="outline" asChild>
              <Link to="/cliente/cupons">Ver cupons</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-primary" />
              Acompanhe a doceria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Promoções, bastidores e novidades nas redes sociais.
            </p>
            <SocialLinks />
          </CardContent>
        </Card>
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Produtos da Semana</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {products.map((product) => (
            <div key={product.id} className="min-w-72">
              <ProductCard product={product} compact />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Produtos do Dia</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {productOfDay.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              Avisos da Doceria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-xl border bg-secondary/40 p-4">
                <p className="font-semibold">{notification.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {notification.message}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
