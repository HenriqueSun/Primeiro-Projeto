import { Copy, Edit, Plus, Trash2 } from "lucide-react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MediaPicker } from "@/components/MediaPicker";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { useAppStore } from "@/store/appStore";
import type { Product, ProductCategory, ProductStatus } from "@/types";
import { formatCurrency } from "@/utils/formatters";

type ProductForm = {
  name: string;
  category: ProductCategory;
  shortDescription: string;
  fullDescription: string;
  ingredients: string;
  price: string;
  imageUrl: string;
  status: ProductStatus;
  featuredWeek: boolean;
  productOfDay: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  category: "Bolos",
  shortDescription: "",
  fullDescription: "",
  ingredients: "",
  price: "",
  imageUrl: "",
  status: "available",
  featuredWeek: false,
  productOfDay: false,
};

export function AdminProductsPage() {
  const products = useAppStore((state) => state.products);
  const addProduct = useAppStore((state) => state.addProduct);
  const updateProduct = useAppStore((state) => state.updateProduct);
  const deleteProduct = useAppStore((state) => state.deleteProduct);
  const duplicateProduct = useAppStore((state) => state.duplicateProduct);
  const bulkUpdateProducts = useAppStore((state) => state.bulkUpdateProducts);
  const bulkDeleteProducts = useAppStore((state) => state.bulkDeleteProducts);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectedCount = selectedIds.length;

  const activeProducts = useMemo(
    () => products.filter((product) => product.status === "available").length,
    [products],
  );

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      ingredients: product.ingredients.join(", "),
      price: String(product.price),
      imageUrl: product.imageUrl ?? "",
      status: product.status,
      featuredWeek: product.featuredWeek,
      productOfDay: product.productOfDay,
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setFormOpen(false);
  };

  const saveProduct = () => {
    if (!form.name || !form.price) {
      toast.error("Informe nome e valor do produto.");
      return;
    }

    const product: Product = {
      id: editingProduct?.id ?? crypto.randomUUID(),
      name: form.name,
      category: form.category,
      shortDescription: form.shortDescription,
      fullDescription: form.fullDescription,
      ingredients: form.ingredients.split(",").map((item) => item.trim()).filter(Boolean),
      price: Number(form.price),
      imageUrl: form.imageUrl || undefined,
      status: form.status,
      badges: editingProduct?.badges ?? [],
      promotionLabel: editingProduct?.promotionLabel,
      views: editingProduct?.views ?? 0,
      favoriteCount: editingProduct?.favoriteCount ?? 0,
      featuredWeek: form.featuredWeek,
      productOfDay: form.productOfDay,
      createdAt: editingProduct?.createdAt ?? new Date().toISOString().slice(0, 10),
    };

    if (editingProduct) {
      updateProduct(product);
      toast.success("Produto atualizado.");
    } else {
      addProduct(product);
      toast.success("Produto criado.");
    }

    closeForm();
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const applyBulkStatus = (status: ProductStatus) => {
    bulkUpdateProducts(selectedIds, status);
    setSelectedIds([]);
    toast.success("Produtos atualizados em massa.");
  };

  const applyBulkDelete = () => {
    bulkDeleteProducts(selectedIds);
    setSelectedIds([]);
    toast.success("Produtos excluídos.");
  };

  return (
    <div>
      <PageHeader
        title="Gerenciamento de Produtos"
        description={`${products.length} produtos cadastrados, ${activeProducts} disponíveis.`}
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Criar produto
          </Button>
        }
      />

      {selectedCount ? (
        <Card className="mb-4">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold">{selectedCount} produtos selecionados</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => applyBulkStatus("available")}>
                Ativar
              </Button>
              <Button variant="outline" onClick={() => applyBulkStatus("inactive")}>
                Desativar
              </Button>
              <Button variant="destructive" onClick={applyBulkDelete}>
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-secondary text-left text-muted-foreground">
              <tr>
                <th className="p-4">Selecionar</th>
                <th className="p-4">Produto</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Status</th>
                <th className="p-4">Destaques</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleSelection(product.id)}
                    />
                  </td>
                  <td className="p-4">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-muted-foreground">{product.shortDescription}</p>
                  </td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4 font-semibold text-primary">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="p-4">
                    <Badge variant={product.status === "available" ? "success" : "warning"}>
                      {product.status === "available" ? "Disponível" : product.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {product.featuredWeek ? <Badge variant="secondary">Semana</Badge> : null}
                      {product.productOfDay ? <Badge variant="secondary">Dia</Badge> : null}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Editar produto"
                        onClick={() => openEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Duplicar produto"
                        onClick={() => {
                          duplicateProduct(product.id);
                          toast.success("Produto duplicado.");
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Excluir produto"
                        onClick={() => setDeleteTarget(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog
        open={formOpen}
        title={editingProduct ? "Editar produto" : "Criar produto"}
        confirmLabel="Salvar"
        onClose={closeForm}
        onConfirm={saveProduct}
      >
        <ProductFormFields form={form} setForm={setForm} />
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        title="Excluir produto"
        description={`Tem certeza que deseja excluir ${deleteTarget?.name}?`}
        confirmLabel="Excluir"
        destructive
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteProduct(deleteTarget.id);
            setDeleteTarget(null);
            toast.success("Produto excluído.");
          }
        }}
      />
    </div>
  );
}

function ProductFormFields({
  form,
  setForm,
}: {
  form: ProductForm;
  setForm: Dispatch<SetStateAction<ProductForm>>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Nome">
        <Input
          value={form.name}
          onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
        />
      </Field>
      <Field label="Categoria">
        <Select
          value={form.category}
          onChange={(event) =>
            setForm((state) => ({ ...state, category: event.target.value as ProductCategory }))
          }
        >
          <option>Bolos</option>
          <option>Doces</option>
          <option>Sobremesas</option>
          <option>Salgados</option>
        </Select>
      </Field>
      <Field label="Descrição curta">
        <Input
          value={form.shortDescription}
          onChange={(event) =>
            setForm((state) => ({ ...state, shortDescription: event.target.value }))
          }
        />
      </Field>
      <Field label="Valor">
        <Input
          type="number"
          step="0.01"
          value={form.price}
          onChange={(event) => setForm((state) => ({ ...state, price: event.target.value }))}
        />
      </Field>
      <Field label="Descrição completa">
        <Textarea
          value={form.fullDescription}
          onChange={(event) =>
            setForm((state) => ({ ...state, fullDescription: event.target.value }))
          }
        />
      </Field>
      <Field label="Ingredientes">
        <Textarea
          value={form.ingredients}
          placeholder="Chocolate, leite condensado, coco..."
          onChange={(event) =>
            setForm((state) => ({ ...state, ingredients: event.target.value }))
          }
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Foto">
          <MediaPicker
            value={form.imageUrl}
            usage="product"
            allowDelete
            onChange={(imageUrl) => setForm((state) => ({ ...state, imageUrl }))}
          />
        </Field>
      </div>
      <Field label="Status">
        <Select
          value={form.status}
          onChange={(event) =>
            setForm((state) => ({ ...state, status: event.target.value as ProductStatus }))
          }
        >
          <option value="available">Disponível</option>
          <option value="sold_out">Esgotado</option>
          <option value="inactive">Inativo</option>
        </Select>
      </Field>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.featuredWeek}
          onChange={(event) =>
            setForm((state) => ({ ...state, featuredWeek: event.target.checked }))
          }
        />
        Destaque da semana
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.productOfDay}
          onChange={(event) =>
            setForm((state) => ({ ...state, productOfDay: event.target.checked }))
          }
        />
        Produto do dia
      </label>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
