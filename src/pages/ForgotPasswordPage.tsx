import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, Input, Label } from "@/components/ui/form";
import { useAppStore } from "@/store/appStore";

const schema = z.object({
  email: z.string().email("Informe um e-mail válido."),
});

type ForgotPasswordForm = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const requestPasswordReset = useAppStore((state) => state.requestPasswordReset);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: ForgotPasswordForm) => {
    try {
      requestPasswordReset(data.email);
      setSent(true);
      toast.success("Fluxo de recuperação iniciado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao solicitar recuperação.");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle>Esqueci minha senha</CardTitle>
          <CardDescription>
            Informe seu e-mail para iniciar a recuperação. O envio real será integrado ao backend futuramente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="rounded-xl border bg-secondary p-4 text-sm text-secondary-foreground">
              Se o e-mail existir, enviaremos as instruções de recuperação quando o backend estiver conectado.
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="min-h-12 pl-9"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="usuario@email.com"
                    aria-invalid={Boolean(errors.email)}
                    {...register("email")}
                  />
                </div>
                <FieldError message={errors.email?.message} />
              </div>
              <Button className="min-h-12 w-full" disabled={isSubmitting}>
                <Send className="h-4 w-4" />
                Enviar instruções
              </Button>
            </form>
          )}

          <Button variant="ghost" className="mt-4 w-full" asChild>
            <Link to="/login">
              <ArrowLeft className="h-4 w-4" />
              Voltar para login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
