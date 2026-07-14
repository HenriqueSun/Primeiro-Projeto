import tkinter as tk
from tkinter import ttk, messagebox
import uuid
from PIL import Image, ImageTk
import json
import os
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

# Cores da doceria
COR_PRINCIPAL = "#992842"
COR_FUNDO = "#FEF2E8"
COR_SUAVE = "#FDEEF5"

# Arquivo JSON
ARQUIVO_JSON = "ingredientes.json"
ingredientes = []

# ------------------- Funções de Dados -------------------

def carregar_dados():
    global ingredientes
    if os.path.exists(ARQUIVO_JSON):
        with open(ARQUIVO_JSON, "r") as f:
            ingredientes = json.load(f)
    else:
        ingredientes = []

def salvar_dados():
    with open(ARQUIVO_JSON, "w") as f:
        json.dump(ingredientes, f, indent=4)

# ------------------- Funções de Cadastro -------------------

def cadastrar_ingrediente():
    nome = entry_nome.get().strip()
    valor = entry_valor_cadastro.get().strip()
    estoque = entry_estoque.get().strip()
    mercado = entry_mercado.get().strip()

    print(f"DEBUG: nome='{nome}', valor='{valor}', estoque='{estoque}', mercado='{mercado}'")

    if any(campo == '' for campo in [nome, valor, estoque, mercado]):
        messagebox.showwarning("Atenção", "Preencha todos os campos!")
        return

    try:
        valor = float(valor)
        estoque = int(estoque)
    except ValueError:
        messagebox.showerror("Erro", "Valor e Estoque devem ser números!")
        return

    ingrediente = {
        "uid": str(uuid.uuid4()),
        "nome": nome,
        "valor": valor,
        "estoque": estoque,
        "mercado": mercado,
        "data": datetime.now().strftime("%Y-%m-%d")
    }
    ingredientes.append(ingrediente)
    salvar_dados()
    atualizar_lista()
    limpar_campos()
    messagebox.showinfo("Sucesso", f"Ingrediente '{nome}' Cadastrado!")


def atualizar_lista():
    listbox.delete(*listbox.get_children())
    for idx, ing in enumerate(ingredientes):
        data = ing.get("data", "Sem data")
        listbox.insert("", "end", iid=idx, values=(ing["nome"], f"R$ {ing['valor']:.2f}", f"{ing['estoque']} un", ing["mercado"], data))

def limpar_campos():
    entry_nome.delete(0, tk.END)
    entry_valor_cadastro.delete(0, tk.END)
    entry_estoque.delete(0, tk.END)
    entry_mercado.delete(0, tk.END)

# ------------------- Funções de Alterar e Excluir -------------------

def abrir_janela_alterar():
    selected_items = listbox.selection()
    if not selected_items:
        messagebox.showwarning("Atenção", "Selecione pelo menos um ingrediente para alterar!")
        return

    janela = tk.Toplevel(root)
    janela.title("Alterar Ingredentes Selecionados")
    janela.configure(bg=COR_FUNDO)

    entradas = []

    for idx, selected in enumerate(selected_items):
        ing_idx = int(selected)
        ing = ingredientes[ing_idx]

        tk.Label(janela, text=f"Ingrediente {ing_idx + 1}", bg=COR_FUNDO, fg=COR_PRINCIPAL, font=("Arial", 12, "bold")).grid(row=idx*5, column=0, columnspan=2, pady=(10, 0))

        campos = ["Nome", "Valor", "Estoque", "Mercado"]
        valores = [ing["nome"], ing["valor"], ing["estoque"], ing["mercado"]]

        for i, campo in enumerate(campos):
            tk.Label(janela, text=f"{campo}:", bg=COR_FUNDO, fg=COR_PRINCIPAL, font=("Arial", 11)).grid(row=idx*5 + i + 1, column=0, padx=5, pady=2, sticky="w")
            entry = tk.Entry(janela, font=("Arial", 11))
            entry.insert(0, valores[i])
            entry.grid(row=idx*5 + i + 1, column=1, padx=5, pady=2)
            entradas.append((ing_idx, campo, entry))

    def salvar_alteracoes():
        for ing_idx, campo, entry in entradas:
            valor = entry.get()
            try:
                if campo == "Valor" or campo == "Estoque":
                    ingredientes[ing_idx][campo.lower()] = float(valor)
                else:
                    ingredientes[ing_idx][campo.lower()] = valor
            except ValueError:
                messagebox.showerror("Erro", f"Valor inválido em {campo} do ingrediente {ing_idx + 1}!")
                return
        salvar_dados()
        atualizar_lista()
        janela.destroy()
        messagebox.showinfo("Sucesso", "Ingredientes alterados com sucesso!")

    btn_salvar = tk.Button(janela, text="Salvar Alterações", bg=COR_PRINCIPAL, fg="white", font=("Arial", 11), command=salvar_alteracoes)
    btn_salvar.grid(row=len(selected_items)*5, column=0, columnspan=2, pady=10)

def excluir_ingredientes():
    selected_items = listbox.selection()
    if not selected_items:
        messagebox.showwarning("Atenção", "Selecione pelo menos um ingrediente para excluir!")
        return

    confirm = messagebox.askyesno("Confirmar Exclusão", f"Tem certeza que quer excluir {len(selected_items)} ingrediente(s)?")
    if confirm:
        for selected in sorted(selected_items, reverse=True):
            idx = int(selected)
            ingredientes.pop(idx)
        salvar_dados()
        atualizar_lista()
        limpar_campos()
        messagebox.showinfo("Sucesso", "Ingredientes excluídos com sucesso!")

# ------------------- Relatório -------------------

def gerar_relatorio():
    for item in relatorio_tree.get_children():
        relatorio_tree.delete(item)

    total_gasto = 0
    total_estoque = 0

    for ing in ingredientes:
        valor_total = ing["valor"] * ing["estoque"]
        total_gasto += valor_total
        total_estoque += ing["estoque"]

        relatorio_tree.insert("", "end", values=(ing["nome"], f"{ing['estoque']} un", f"R$ {valor_total:.2f}"))

    resumo_texto = f"Total Gasto: R$ {total_gasto:.2f}    |    Total em Estoque: {total_estoque} unidades"
    lbl_resumo.config(text=resumo_texto)

# ------------------- Gráfico -------------------

def gerar_grafico():
    periodo = periodo_var.get().strip()
    hoje = datetime.now()

    if periodo == "Semana":
        limite = hoje - timedelta(days=7)
    else:
        limite = hoje - timedelta(days=30)

    nomes = []
    quantidades = []
    valores_totais = []

    for ing in ingredientes:
        data_str = ing.get("data", hoje.strftime("%Y-%m-%d"))
        data_ing = datetime.strptime(data_str, "%Y-%m-%d")
        if data_ing >= limite:
            nomes.append(ing["nome"])
            quantidades.append(ing["estoque"])
            valores_totais.append(ing["estoque"] * ing["valor"])

    if not nomes:
        messagebox.showinfo("Informação", f"Não há dados para o período selecionado: {periodo}.")
        return

    fig, ax1 = plt.subplots(figsize=(6,4))

    ax1.bar(nomes, quantidades, color=COR_PRINCIPAL, label="Quantidade")
    ax1.set_ylabel('Quantidade')

    ax2 = ax1.twinx()
    ax2.plot(nomes, valores_totais, color='black', marker='o', label='Valor Total')
    ax2.set_ylabel('Valor Total (R$)')

    plt.title(f'Estoque e Gastos - {periodo}')
    plt.xticks(rotation=45, ha='right')

    for widget in frame_grafico.winfo_children():
        if isinstance(widget, FigureCanvasTkAgg):
            widget.get_tk_widget().destroy()

    canvas = FigureCanvasTkAgg(fig, master=frame_grafico)
    canvas.draw()
    canvas.get_tk_widget().pack(fill="both", expand=True)

# ------------------- Interface -------------------

root = tk.Tk()
root.title("Sistema de Gerenciamento - Doceria Dona Lu")
root.geometry("1000x750")
root.configure(bg=COR_FUNDO)

# ------------------- Cabeçalho com Logo -------------------

header = tk.Frame(root, bg=COR_FUNDO)
header.pack(pady=10)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOGO_PATH = os.path.join(BASE_DIR, "Logo-Doceria.png")

logo_image = Image.open(LOGO_PATH)
logo_image = logo_image.resize((200, 150))
logo = ImageTk.PhotoImage(logo_image)

logo_label = tk.Label(header, image=logo, bg=COR_FUNDO)
logo_label.pack(side="left", padx=10)


# ------------------- Estilo das Abas -------------------

style = ttk.Style()
style.theme_use('default')

style.configure('TNotebook', background=COR_FUNDO, borderwidth=0)
style.configure('TNotebook.Tab',
                font=('Arial', 12, 'bold'),
                padding=[10, 5],
                background=COR_SUAVE,
                foreground=COR_PRINCIPAL)

style.map('TNotebook.Tab',
          background=[('selected', COR_PRINCIPAL)],
          foreground=[('selected', 'white')])

# ------------------- Sistema de Scroll -------------------

canvas = tk.Canvas(root, bg=COR_FUNDO)
canvas.pack(side="left", fill="both", expand=True)

scrollbar = ttk.Scrollbar(root, orient="vertical", command=canvas.yview)
scrollbar.pack(side="right", fill="y")

canvas.configure(yscrollcommand=scrollbar.set)
canvas.bind('<Configure>', lambda e: canvas.configure(scrollregion=canvas.bbox("all")))

scroll_frame = tk.Frame(canvas, bg=COR_FUNDO)
canvas.create_window((0, 0), window=scroll_frame, anchor="nw")

# ------------------- Notebook -------------------

notebook = ttk.Notebook(scroll_frame)
notebook.pack(fill="both", expand=True)

frame_cadastro = tk.Frame(notebook, bg=COR_FUNDO)
notebook.add(frame_cadastro, text="Cadastro")

frame_relatorio = tk.Frame(notebook, bg=COR_FUNDO)
notebook.add(frame_relatorio, text="Relatório")

frame_grafico = tk.Frame(notebook, bg=COR_FUNDO)
notebook.add(frame_grafico, text="Gráfico")

font_padrao = ("Arial", 12)

# ------- Cadastro --------

frame = tk.Frame(frame_cadastro, bg=COR_FUNDO)
frame.pack(pady=10)

for i, label in enumerate(["Nome", "Valor pago", "Estoque", "Mercado"]):
    tk.Label(frame, text=label+":", bg=COR_FUNDO, fg=COR_PRINCIPAL, font=font_padrao).grid(row=i, column=0, padx=5, pady=5, sticky="w")

entry_nome = tk.Entry(frame, font=font_padrao)
entry_nome.grid(row=0, column=1, padx=5, pady=5)

entry_valor_cadastro = tk.Entry(frame, font=font_padrao)
entry_valor_cadastro.grid(row=1, column=1, padx=5, pady=5)

entry_estoque = tk.Entry(frame, font=font_padrao)
entry_estoque.grid(row=2, column=1, padx=5, pady=5)

entry_mercado = tk.Entry(frame, font=font_padrao)
entry_mercado.grid(row=3, column=1, padx=5, pady=5)

btn_cadastrar = tk.Button(frame, text="Cadastrar", bg=COR_PRINCIPAL, fg="white", font=font_padrao, command=cadastrar_ingrediente)
btn_cadastrar.grid(row=4, column=0, pady=10)

btn_alterar = tk.Button(frame, text="Alterar Selecionados", bg=COR_PRINCIPAL, fg="white", font=font_padrao, command=abrir_janela_alterar)
btn_alterar.grid(row=4, column=1, pady=10)

btn_excluir = tk.Button(frame, text="Excluir Selecionados", bg=COR_PRINCIPAL, fg="white", font=font_padrao, command=excluir_ingredientes)
btn_excluir.grid(row=4, column=2, pady=10)

columns = ("Nome", "Valor Pago", "Estoque", "Mercado", "Data")
listbox = ttk.Treeview(frame_cadastro, columns=columns, show='headings', selectmode='extended')
for col in columns:
    listbox.heading(col, text=col)
listbox.pack(pady=10, fill="both", expand=True)

# ------- Relatório --------

btn_gerar_relatorio = tk.Button(frame_relatorio, text="Gerar Relatório", bg=COR_PRINCIPAL, fg="white", font=font_padrao, command=gerar_relatorio)
btn_gerar_relatorio.pack(pady=10)

relatorio_columns = ("Ingrediente", "Quantidade", "Valor Total")
relatorio_tree = ttk.Treeview(frame_relatorio, columns=relatorio_columns, show='headings')

for col in relatorio_columns:
    relatorio_tree.heading(col, text=col)
    relatorio_tree.column(col, anchor="center")

relatorio_tree.pack(pady=10, fill="both", expand=True)

lbl_resumo = tk.Label(frame_relatorio, text="", font=("Arial", 12, "bold"), bg=COR_SUAVE, fg=COR_PRINCIPAL, justify="center")
lbl_resumo.pack(pady=10, fill="x")

# ------- Gráfico --------

periodo_var = tk.StringVar(value="Semana")

periodo_frame = tk.Frame(frame_grafico, bg=COR_FUNDO)
periodo_frame.pack(pady=10)

tk.Label(periodo_frame, text="Período:", bg=COR_FUNDO, fg=COR_PRINCIPAL, font=font_padrao).pack(side="left", padx=5)

periodo_combo = ttk.Combobox(periodo_frame, textvariable=periodo_var, values=["Semana", "Mês"], state="readonly", font=font_padrao, width=10)
periodo_combo.pack(side="left", padx=5)

btn_gerar_grafico = tk.Button(frame_grafico, text="Gerar Gráfico", bg=COR_PRINCIPAL, fg="white", font=font_padrao, command=gerar_grafico)
btn_gerar_grafico.pack(pady=20)

# ------------------- Funções de Vendas -------------------

ARQUIVO_VENDAS = "vendas.json"
vendas = []

def carregar_vendas():
    global vendas
    if os.path.exists(ARQUIVO_VENDAS) and os.path.getsize(ARQUIVO_VENDAS) > 0:
        try:
            with open(ARQUIVO_VENDAS, "r") as f:
                vendas = json.load(f)
        except json.JSONDecodeError:
            messagebox.showwarning("Atenção", "Arquivo de vendas corrompido. Será reiniciado.")
            vendas = []
            salvar_vendas()
    else:
        vendas = []

def salvar_vendas():
    with open(ARQUIVO_VENDAS, "w") as f:
        json.dump(vendas, f, indent=4)

def registrar_venda():
    produto = entry_produto.get()
    quantidade = entry_quantidade.get()
    valor = entry_valor_venda.get()

    if not produto or not quantidade or not valor:
        messagebox.showwarning("Atenção", "Preencha todos os campos!")
        return

    try:
        quantidade = int(quantidade)
        valor = float(valor)
    except ValueError:
        messagebox.showerror("Erro", "Quantidade e Valor devem ser numéricos!")
        return

    venda = {
        "produto": produto,
        "quantidade": quantidade,
        "valor": valor,
        "data": datetime.now().strftime("%Y-%m-%d")
    }

    vendas.append(venda)
    salvar_vendas()
    entry_produto.delete(0, tk.END)
    entry_quantidade.delete(0, tk.END)
    entry_valor_venda.delete(0, tk.END)
    messagebox.showinfo("Sucesso", f"Venda de '{produto}' registrada!")

def gerar_relatorio_vendas():
    for item in tree_vendas.get_children():
        tree_vendas.delete(item)

    total_vendido = 0
    total_reais = 0

    for venda in vendas:
        total_vendido += venda["quantidade"]
        total_reais += venda["quantidade"] * venda["valor"]
        tree_vendas.insert("", "end", values=(venda["produto"], venda["quantidade"], f"R$ {venda['valor']:.2f}", venda["data"]))

    lbl_resumo_vendas.config(text=f"Total vendido: {total_vendido} unidades | Total arrecadado: R$ {total_reais:.2f}")

# ------------------- Abas de Vendas -------------------

frame_vendas = tk.Frame(notebook, bg=COR_FUNDO)
notebook.add(frame_vendas, text="Registro de Vendas")

frame_relatorio_vendas = tk.Frame(notebook, bg=COR_FUNDO)
notebook.add(frame_relatorio_vendas, text="Relatório de Vendas")

# ------------------- Widgets Registro de Vendas -------------------

tk.Label(frame_vendas, text="Produto:", bg=COR_FUNDO, fg=COR_PRINCIPAL).pack(pady=5)
entry_produto = tk.Entry(frame_vendas)
entry_produto.pack(pady=5)

tk.Label(frame_vendas, text="Quantidade:", bg=COR_FUNDO, fg=COR_PRINCIPAL).pack(pady=5)
entry_quantidade = tk.Entry(frame_vendas)
entry_quantidade.pack(pady=5)

tk.Label(frame_vendas, text="Valor da Venda:", bg=COR_FUNDO, fg=COR_PRINCIPAL).pack(pady=5)
entry_valor_venda = tk.Entry(frame_vendas)
entry_valor_venda.pack(pady=5)

btn_registrar = tk.Button(frame_vendas, text="Registrar Venda", bg=COR_PRINCIPAL, fg="white", command=registrar_venda)
btn_registrar.pack(pady=10)

# ------------------- Widgets Relatório de Vendas -------------------

btn_gerar_relatorio_vendas = tk.Button(frame_relatorio_vendas, text="Gerar Relatório de Vendas", bg=COR_PRINCIPAL, fg="white", command=gerar_relatorio_vendas)
btn_gerar_relatorio_vendas.pack(pady=10)

tree_vendas = ttk.Treeview(frame_relatorio_vendas, columns=("Produto", "Quantidade", "Valor", "Data"), show='headings')
for col in ("Produto", "Quantidade", "Valor", "Data"):
    tree_vendas.heading(col, text=col)
    tree_vendas.column(col, anchor="center")
tree_vendas.pack(pady=10, fill="both", expand=True)

lbl_resumo_vendas = tk.Label(frame_relatorio_vendas, text="", font=("Arial", 12, "bold"), bg=COR_SUAVE, fg=COR_PRINCIPAL, justify="center")
lbl_resumo_vendas.pack(pady=10, fill="x")

# ------------------- Inicialização -------------------

carregar_vendas()
carregar_dados()
atualizar_lista()

root.mainloop()
