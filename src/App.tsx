import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ClientLayout } from "@/layouts/ClientLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { useAppStore } from "@/store/appStore";
import { Skeleton } from "@/components/ui/skeleton";

const LoginPage = lazy(() => import("@/pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const ClientDashboard = lazy(() => import("@/pages/client/ClientDashboard").then((module) => ({ default: module.ClientDashboard })));
const ClientVotingPage = lazy(() => import("@/pages/client/ClientVotingPage").then((module) => ({ default: module.ClientVotingPage })));
const ClientFeedbackPage = lazy(() => import("@/pages/client/ClientFeedbackPage").then((module) => ({ default: module.ClientFeedbackPage })));
const ClientMenuPage = lazy(() => import("@/pages/client/ClientMenuPage").then((module) => ({ default: module.ClientMenuPage })));
const ClientFavoritesPage = lazy(() => import("@/pages/client/ClientFavoritesPage").then((module) => ({ default: module.ClientFavoritesPage })));
const ClientLoyaltyPage = lazy(() => import("@/pages/client/ClientLoyaltyPage").then((module) => ({ default: module.ClientLoyaltyPage })));
const ClientCouponsPage = lazy(() => import("@/pages/client/ClientCouponsPage").then((module) => ({ default: module.ClientCouponsPage })));
const ClientProfilePage = lazy(() => import("@/pages/client/ClientProfilePage").then((module) => ({ default: module.ClientProfilePage })));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard").then((module) => ({ default: module.AdminDashboard })));
const AdminProductsPage = lazy(() => import("@/pages/admin/AdminProductsPage").then((module) => ({ default: module.AdminProductsPage })));
const AdminVotesPage = lazy(() => import("@/pages/admin/AdminVotesPage").then((module) => ({ default: module.AdminVotesPage })));
const AdminPromotionsPage = lazy(() => import("@/pages/admin/AdminPromotionsPage").then((module) => ({ default: module.AdminPromotionsPage })));
const AdminCouponsPage = lazy(() => import("@/pages/admin/AdminCouponsPage").then((module) => ({ default: module.AdminCouponsPage })));
const AdminFeaturedProductsPage = lazy(() => import("@/pages/admin/AdminFeaturedProductsPage").then((module) => ({ default: module.AdminFeaturedProductsPage })));
const AdminFeedbacksPage = lazy(() => import("@/pages/admin/AdminFeedbacksPage").then((module) => ({ default: module.AdminFeedbacksPage })));
const AdminNoticesPage = lazy(() => import("@/pages/admin/AdminNoticesPage").then((module) => ({ default: module.AdminNoticesPage })));
const AdminSettingsPage = lazy(() => import("@/pages/admin/AdminSettingsPage").then((module) => ({ default: module.AdminSettingsPage })));

export function App() {
  const user = useAppStore((state) => state.user);
  const home = user?.role === "admin" ? "/admin" : "/cliente";

  return (
    <Suspense fallback={<RouteSkeleton />}>
      <Routes>
        <Route path="/" element={<Navigate to={user ? home : "/login"} replace />} />
        <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute role="client" />}>
        <Route element={<ClientLayout />}>
          <Route path="/cliente" element={<ClientDashboard />} />
          <Route path="/cliente/votacao" element={<ClientVotingPage />} />
          <Route path="/cliente/feedbacks" element={<ClientFeedbackPage />} />
          <Route path="/cliente/cardapio" element={<ClientMenuPage />} />
          <Route path="/cliente/favoritos" element={<ClientFavoritesPage />} />
          <Route path="/cliente/fidelidade" element={<ClientLoyaltyPage />} />
          <Route path="/cliente/cupons" element={<ClientCouponsPage />} />
          <Route path="/cliente/perfil" element={<ClientProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/produtos" element={<AdminProductsPage />} />
          <Route path="/admin/votacoes" element={<AdminVotesPage />} />
          <Route path="/admin/promocoes" element={<AdminPromotionsPage />} />
          <Route path="/admin/cupons" element={<AdminCouponsPage />} />
          <Route
            path="/admin/produtos-dia"
            element={<AdminFeaturedProductsPage mode="day" />}
          />
          <Route
            path="/admin/produtos-semana"
            element={<AdminFeaturedProductsPage mode="week" />}
          />
          <Route path="/admin/feedbacks" element={<AdminFeedbacksPage />} />
          <Route path="/admin/avisos" element={<AdminNoticesPage />} />
          <Route path="/admin/configuracoes" element={<AdminSettingsPage />} />
        </Route>
      </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function RouteSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-48 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}
