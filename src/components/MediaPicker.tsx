import { Check, ImagePlus, Trash2, UploadCloud, X } from "lucide-react";
import type { ChangeEvent, DragEvent } from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/appStore";
import type { MediaUsage } from "@/types";
import { cn } from "@/utils/cn";

type MediaPickerProps = {
  value?: string;
  onChange: (url: string) => void;
  usage: MediaUsage;
  allowDelete?: boolean;
};

export function MediaPicker({
  value,
  onChange,
  usage,
  allowDelete = false,
}: MediaPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const mediaAssets = useAppStore((state) => state.mediaAssets);
  const addMediaAsset = useAppStore((state) => state.addMediaAsset);
  const deleteMediaAsset = useAppStore((state) => state.deleteMediaAsset);

  const visibleAssets = mediaAssets.filter(
    (asset) => asset.usage === usage || asset.usage === "general",
  );

  const uploadFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return;
    }

    try {
      const url = await readFileAsDataUrl(file);
      const asset = addMediaAsset({
        name: file.name,
        url,
        type: file.type,
        size: file.size,
        usage,
      });

      onChange(asset.url);
      toast.success("Foto salva na biblioteca.");
    } catch {
      toast.error("Não foi possível carregar a foto.");
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    void uploadFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    void uploadFile(event.dataTransfer.files?.[0]);
  };

  const removeAsset = (id: string, selectedUrl: string) => {
    try {
      deleteMediaAsset(id);
      if (value === selectedUrl) onChange("");
      toast.success("Foto excluída da biblioteca.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir.");
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "rounded-2xl border border-dashed bg-secondary/40 p-4 text-center transition",
          dragging && "border-primary bg-primary/10",
        )}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {value ? (
          <img
            src={value}
            alt="Imagem selecionada"
            className="mx-auto mb-3 h-36 w-full rounded-xl object-cover"
          />
        ) : (
          <div className="mx-auto mb-3 grid h-20 w-20 place-items-center rounded-full bg-card text-primary">
            <UploadCloud className="h-8 w-8" />
          </div>
        )}
        <p className="font-semibold">Arraste uma foto aqui</p>
        <p className="text-sm text-muted-foreground">
          Ou selecione uma imagem do celular/computador para salvar na biblioteca.
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
            <ImagePlus className="h-4 w-4" />
            Selecionar foto
          </Button>
          {value ? (
            <Button type="button" variant="ghost" onClick={() => onChange("")}>
              <X className="h-4 w-4" />
              Remover seleção
            </Button>
          ) : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Fotos salvas na biblioteca</p>
        {visibleAssets.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visibleAssets.map((asset) => (
              <div
                key={asset.id}
                role="button"
                tabIndex={0}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-xl border text-left outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
                  value === asset.url && "border-primary ring-2 ring-primary/30",
                )}
                onClick={() => onChange(asset.url)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onChange(asset.url);
                  }
                }}
              >
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="h-24 w-full object-cover transition group-hover:scale-105"
                />
                <span className="block truncate px-2 py-1 text-xs font-medium">
                  {asset.name}
                </span>
                {value === asset.url ? (
                  <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </span>
                ) : null}
                {allowDelete ? (
                  <button
                    type="button"
                    className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-destructive text-destructive-foreground opacity-95"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeAsset(asset.id, asset.url);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        event.stopPropagation();
                        removeAsset(asset.id, asset.url);
                      }
                    }}
                    aria-label={`Excluir ${asset.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-secondary/40 p-4 text-sm text-muted-foreground">
            Nenhuma foto salva ainda.
          </div>
        )}
      </div>
    </div>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
