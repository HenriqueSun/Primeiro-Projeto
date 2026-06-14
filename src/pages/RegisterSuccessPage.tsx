import { CheckCircle2, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/appStore";

export function RegisterSuccessPage() {
  const navigate = useNavigate();
  const users = useAppStore((state) => state.users);
  const setUser = useAppStore((state) => state.setUser);
  const newestClient = users.find((user) => user.role === "client");

  const enterNow = () => {
    if (!newestClient) {
      navigate("/login");
      return;
    }

    setUser(newestClient);
    toast.success("Sessão iniciada.");
    navigate("/cliente", { replace: true });
  };

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-lg text-center shadow-2xl">
        <CardHeader>
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-secondary text-primary">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4 text-2xl">Cadastro realizado com sucesso.</CardTitle>
          <CardDescription>
            Sua conta foi criada e já está pronta para acessar a área do cliente.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Button variant="outline" asChild>
            <Link to="/login">Ir para Login</Link>
          </Button>
          <Button onClick={enterNow}>
            <LogIn className="h-4 w-4" />
            Entrar Agora
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
