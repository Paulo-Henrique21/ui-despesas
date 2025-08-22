import { MonthItem } from "../types";

export const monthList: MonthItem[] = [
  { label: "Jan", full: "Janeiro", value: "01" },
  { label: "Fev", full: "Fevereiro", value: "02" },
  { label: "Mar", full: "Março", value: "03" },
  { label: "Abr", full: "Abril", value: "04" },
  { label: "Mai", full: "Maio", value: "05" },
  { label: "Jun", full: "Junho", value: "06" },
  { label: "Jul", full: "Julho", value: "07" },
  { label: "Ago", full: "Agosto", value: "08" },
  { label: "Set", full: "Setembro", value: "09" },
  { label: "Out", full: "Outubro", value: "10" },
  { label: "Nov", full: "Novembro", value: "11" },
  { label: "Dez", full: "Dezembro", value: "12" },
];

const currentYear = new Date().getFullYear();
export const yearOptions = Array.from({ length: 5 }, (_, i) =>
  String(currentYear - 2 + i)
);

// Cores fixas para até 20 categorias
export const predefinedColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
  "var(--chart-9)",
  "var(--chart-10)",
  "var(--chart-11)",
  "var(--chart-12)",
  "var(--chart-13)",
  "var(--chart-14)",
  "var(--chart-15)",
  "var(--chart-16)",
  "var(--chart-17)",
  "var(--chart-18)",
  "var(--chart-19)",
  "var(--chart-20)",
];

export const inputDescriptions = [
  {
    name: "title",
    description:
      "Nome identificador da despesa (ex: 'Aluguel', 'Conta de Luz')",
  },
  {
    name: "description",
    description: "Informações adicionais para melhor identificação da despesa",
  },
  {
    name: "category",
    description:
      "Classificação da despesa para melhor organização (Casa, Carro, Lazer)",
  },
  {
    name: "dueDay",
    description: "Dia do mês para vencimento da despesa (1 a 31)",
  },
  {
    name: "startDate",
    description:
      "Data inicial a partir da qual a despesa será registrada no sistema",
  },
  {
    name: "defaultValue",
    description: "Valor padrão da despesa em reais (R$)",
  },
  {
    name: "paymentStatus",
    description:
      "Status atual do pagamento. Se marcado como pago, afetará apenas o mês atual. Meses futuros permanecerão como não pagos",
  },
];

export const categories = [
  { value: "Casa", label: "Casa" },
  { value: "Carro", label: "Carro" },
  { value: "Lazer", label: "Lazer" },
  { value: "Saúde", label: "Saúde" },
  { value: "Educação", label: "Educação" },
  { value: "Alimentação", label: "Alimentação" },
  { value: "Transporte", label: "Transporte" },
  { value: "Vestuário", label: "Vestuário" },
  { value: "Tecnologia", label: "Tecnologia" },
  { value: "Investimentos", label: "Investimentos" },

  // Sugestões adicionais:
  { value: "Assinaturas", label: "Assinaturas" }, // Ex: Netflix, Spotify
  { value: "Pets", label: "Pets" }, // Ex: ração, veterinário
  { value: "Impostos", label: "Impostos" }, // Ex: IPVA, IPTU
  { value: "Doações", label: "Doações" }, // Ex: contribuições mensais
  { value: "Filhos", label: "Filhos" }, // Ex: escola, atividades
  { value: "Serviços", label: "Serviços" }, // Ex: diarista, manutenção
  { value: "Empréstimos", label: "Empréstimos" }, // parcelas de dívidas

  { value: "Outros", label: "Outros" },
];
