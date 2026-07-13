import { zodResolver } from "@hookform/resolvers/zod";
import { Apple, ArrowRight, CheckCircle2, Chrome, Eye, EyeOff, Lock, Mail, Phone, Share2, UserRound, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, Input, Label } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthProvider";
import type { RegisterDTO } from "@/types";
import { cn } from "@/utils/cn";
import { formatBrazilianPhone, getPasswordStrength, isValidBrazilianPhone, normalizeEmail } from "@/utils/auth";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Informe nome e sobrenome.")
      .max(100, "Nome muito longo.")
      .regex(/^[A-Za-zÀ-ÿ\s]+$/, "O nome não pode conter números."),
    email: z.string().email("Informe um e-mail válido.").transform(normalizeEmail),
    phone: z.string().refine(isValidBrazilianPhone, "Informe um telefone válido."),
    password: z
      .string()
      .min(8, "Use no mínimo 8 caracteres.")
      .regex(/[A-Z]/, "Inclua uma letra maiúscula.")
      .regex(/[a-z]/, "Inclua uma letra minúscula.")
      .regex(/\d/, "Inclua um número.")
      .regex(/[^A-Za-z0-9]/, "Inclua um caractere especial."),
    confirmPassword: z.string(),
    acceptedTerms: z
      .boolean()
      .refine((value) => value, "Você precisa aceitar os termos."),
    marketingConsent: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não conferem.",
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: createAccount } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptedTerms: false,
      marketingConsent: true,
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const onSubmit = async (data: RegisterDTO) => {
    try {
      setLoading(true);
      await createAccount(data);
      toast.success("Cadastro realizado com sucesso.");
      navigate("/register/success");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1fr_520px] lg:items-center">
        <section className="space-y-4">
          <div className="inline-flex rounded-full border bg-card px-4 py-2 text-sm font-semibold text-primary">
            Doceria Dona Lu
          </div>
          <h1 className="text-balance text-3xl font-black text-primary sm:text-5xl">
            Crie sua conta em poucos passos.
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Salve favoritos, receba cupons e acompanhe novidades da doceria pelo celular.
          </p>
        </section>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>Campos pensados para uma experiência mobile first.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid gap-2 sm:grid-cols-3">
              {[
                { icon: <Chrome className="h-4 w-4" />, label: "Google" },
                { icon: <Apple className="h-4 w-4" />, label: "Apple" },
                { icon: <Share2 className="h-4 w-4" />, label: "Facebook" },
              ].map((item) => (
                <Button key={item.label} variant="outline" disabled className="min-h-12">
                  {item.icon}
                  {item.label} em breve
                </Button>
              ))}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Field
                id="fullName"
                label="Nome completo"
                icon={<UserRound className="h-4 w-4" />}
                error={errors.fullName?.message}
                valid={!errors.fullName && Boolean(watch("fullName"))}
              >
                <Input
                  id="fullName"
                  className="min-h-12 pl-9"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.fullName)}
                  placeholder="João Silva"
                  {...register("fullName")}
                />
              </Field>

              <Field
                id="email"
                label="E-mail"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                valid={!errors.email && Boolean(watch("email"))}
              >
                <Input
                  id="email"
                  type="email"
                  className="min-h-12 pl-9"
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={Boolean(errors.email)}
                  placeholder="usuario@email.com"
                  {...register("email")}
                />
              </Field>

              <Field
                id="phone"
                label="Telefone"
                icon={<Phone className="h-4 w-4" />}
                error={errors.phone?.message}
                valid={!errors.phone && Boolean(watch("phone"))}
              >
                <Input
                  id="phone"
                  className="min-h-12 pl-9"
                  autoComplete="tel"
                  inputMode="tel"
                  aria-invalid={Boolean(errors.phone)}
                  placeholder="(11) 99999-9999"
                  {...register("phone", {
                    onChange: (event) =>
                      setValue("phone", formatBrazilianPhone(event.target.value), {
                        shouldValidate: true,
                      }),
                  })}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="password"
                  label="Senha"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.password?.message}
                  valid={!errors.password && Boolean(password)}
                >
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="min-h-12 pl-9 pr-10"
                      autoComplete="new-password"
                      aria-invalid={Boolean(errors.password)}
                      placeholder="Doceria@2026"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted-foreground"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </Field>

                <Field
                  id="confirmPassword"
                  label="Confirmar senha"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.confirmPassword?.message}
                  valid={Boolean(confirmPassword) && password === confirmPassword}
                >
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    className="min-h-12 pl-9"
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.confirmPassword)}
                    {...register("confirmPassword")}
                  />
                </Field>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Força da senha</span>
                  <span className="text-muted-foreground">{strength.label}</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "h-2 rounded-full bg-secondary",
                        index < strength.score && strength.color,
                      )}
                    />
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-3 rounded-xl border p-3 text-sm">
                <input type="checkbox" className="mt-1" {...register("acceptedTerms")} />
                <span>
                  Li e concordo com os <strong>Termos de Uso</strong> e Política de Privacidade.
                  <FieldError message={errors.acceptedTerms?.message} />
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-xl border p-3 text-sm">
                <input type="checkbox" className="mt-1" {...register("marketingConsent")} />
                <span>Quero receber promoções e novidades da doceria.</span>
              </label>

              <Button className="min-h-12 w-full" disabled={!isValid || loading}>
                {loading ? "Criando conta..." : "Criar Conta"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link to="/login" className="font-semibold text-primary">
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Field({
  id,
  label,
  icon,
  error,
  valid,
  children,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  error?: string;
  valid?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {valid ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            válido
          </span>
        ) : error ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
            <XCircle className="h-3.5 w-3.5" />
            revisar
          </span>
        ) : null}
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-4 text-muted-foreground">
          {icon}
        </span>
        {children}
      </div>
      <FieldError message={error} />
    </div>
  );
}
