import { Heart, Instagram, MessageCircle, MessageSquare, Package, Share2, Star, TrendingUp, Vote } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/appStore";
import type { ProductCategory, ProductStatus } from "@/types";

const categoryList: ProductCategory[] = ["Bolos", "Doces", "Sobremesas", "Salgados"];
const statusList: ProductStatus[] = ["available", "sold_out", "inactive"];
const colors = ["#992842", "#f7c9d8", "#702238"];

export function AdminDashboard() {
  const products = useAppStore((state) => state.products);
  const votes = useAppStore((state) => state.votes);
  const feedbacks = useAppStore((state) => state.feedbacks);
  const favoriteProductIds = useAppStore((state) => state.favoriteProductIds);
  const marketingMetrics = useAppStore((state) => state.marketingMetrics);

  const totalVotes = votes
    .flatMap((vote) => vote.options)
    .reduce((sum, option) => sum + option.votes, 0);
  const topOption = votes
    .flatMap((vote) => vote.options)
    .sort((a, b) => b.votes - a.votes)[0];
  const categoryData = categoryList.map((category) => ({
    name: category,
    produtos: products.filter((product) => product.category === category).length,
  }));
  const statusData = statusList.map((status) => ({
    name:
      status === "available"
        ? "Disponível"
        : status === "sold_out"
          ? "Esgotado"
          : "Inativo",
    value: products.filter((product) => product.status === status).length,
  }));
  const topViewedProducts = [...products]
    .sort(
      (a, b) =>
        (marketingMetrics.productViews[b.id] ?? b.views ?? 0) -
        (marketingMetrics.productViews[a.id] ?? a.views ?? 0),
    )
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard Administrativo"
        description="Visão consolidada dos produtos, votações e feedbacks da doceria."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total de produtos" value={products.length} icon={<Package />} />
        <StatCard
          title="Produtos ativos"
          value={products.filter((product) => product.status === "available").length}
          icon={<Star />}
        />
        <StatCard title="Total de votos" value={totalVotes} icon={<Vote />} />
        <StatCard
          title="Feedbacks recebidos"
          value={feedbacks.length}
          icon={<MessageSquare />}
        />
        <StatCard
          title="Mais votado"
          value={topOption?.productName ?? "-"}
          icon={<Vote />}
          helper={`${topOption?.votes ?? 0} votos`}
        />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          title="Cliques WhatsApp"
          value={marketingMetrics.whatsappClicks}
          icon={<MessageCircle />}
        />
        <StatCard
          title="Cliques Instagram"
          value={marketingMetrics.instagramClicks}
          icon={<Instagram />}
        />
        <StatCard
          title="Compartilhamentos"
          value={marketingMetrics.shareClicks}
          icon={<Share2 />}
        />
        <StatCard
          title="Produtos favoritos"
          value={favoriteProductIds.length}
          icon={<Heart />}
        />
        <StatCard
          title="Favoritos adicionados"
          value={marketingMetrics.favoriteAdds}
          icon={<Star />}
        />
        <StatCard
          title="Taxa de engajamento"
          value={`${marketingMetrics.engagementRate}%`}
          icon={<TrendingUp />}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Produtos por categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="produtos" fill="#992842" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos produtos</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={110} label>
                  {statusData.map((item, index) => (
                    <Cell key={item.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos mais visualizados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topViewedProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <p className="font-semibold">
                    {index + 1}. {product.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <strong className="text-primary">
                  {marketingMetrics.productViews[product.id] ?? product.views ?? 0} views
                </strong>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
