import { CalendarDays, Mail, Megaphone, Phone, Shield, UserRoundCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/form";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsers } from "@/hooks/useUsers";
import { formatDate, getInitials } from "@/utils/formatters";

type UserFilter = "recent" | "active";

export function AdminUsersPage() {
  const { data: users = [], isLoading } = useUsers();
  const [filter, setFilter] = useState<UserFilter>("recent");

  const sortedUsers = useMemo(() => {
    const list = [...users];

    if (filter === "active") {
      return list.sort(
        (a, b) =>
          new Date(b.lastActiveAt ?? b.createdAt).getTime() -
          new Date(a.lastActiveAt ?? a.createdAt).getTime(),
      );
    }

    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [filter, users]);

  const clients = users.filter((user) => user.role === "client");
  const marketingUsers = users.filter((user) => user.marketingConsent);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuários"
        description="Acompanhe clientes cadastrados, consentimento de marketing e estrutura base para permissões futuras."
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Usuários cadastrados"
          value={users.length}
          helper={`${clients.length} clientes`}
          icon={<UserRoundCheck className="h-5 w-5" />}
        />
        <StatCard
          title="Consentimento marketing"
          value={marketingUsers.length}
          helper="Aceitaram receber campanhas"
          icon={<Megaphone className="h-5 w-5" />}
        />
        <StatCard
          title="Perfis administrativos"
          value={users.filter((user) => user.role === "admin").length}
          helper="Preparado para permissões"
          icon={<Shield className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Lista de usuários</CardTitle>
            <CardDescription>Dados carregados do Firestore, sem exposição de senha.</CardDescription>
          </div>
          <Select
            value={filter}
            onChange={(event) => setFilter(event.target.value as UserFilter)}
            className="w-full sm:w-48"
          >
            <option value="recent">Mais recentes</option>
            <option value="active">Mais ativos</option>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {sortedUsers.map((user) => (
              <article
                key={user.id}
                className="grid gap-4 rounded-2xl border p-4 md:grid-cols-[1fr_auto]"
              >
                <div className="flex gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary font-bold text-primary">
                    {user.avatar || user.avatarUrl ? (
                      <img
                        src={user.avatar || user.avatarUrl}
                        alt={`Avatar de ${user.name}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(user.fullName ?? user.name)
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">{user.fullName ?? user.name}</h3>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role === "admin" ? "Admin" : "Cliente"}
                      </Badge>
                      {user.marketingConsent ? (
                        <Badge variant="outline">Marketing aceito</Badge>
                      ) : null}
                    </div>
                    <div className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                      <span className="inline-flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {user.phone || "Não informado"}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        Cadastro: {formatDate(user.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <UserRoundCheck className="h-4 w-4" />
                        Última atividade: {formatDate(user.lastActiveAt ?? user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-secondary p-3 text-sm text-secondary-foreground">
                  <p className="font-semibold">Permissões futuras</p>
                  <p className="text-muted-foreground">
                    Estrutura pronta para papéis, bloqueios e auditoria no backend.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
