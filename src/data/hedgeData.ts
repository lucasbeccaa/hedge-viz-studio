// Dados extraídos do Excel - Dados_para_Dashboard.xlsx

export interface CustosCultivo {
  operacaoMaquinas: number;
  manutencaoBenfeitorias: number;
  maoObraTemporaria: number;
  sementes: number;
  fertilizantes: number;
  defensivos: number;
  despesasGerais: number;
  transporteExterno: number;
  assistenciaTecnica: number;
  proagroSeguro: number;
  totalCustosVariaveis: number;
  depreciacaoMaquinas: number;
  depreciacaoBenfeitorias: number;
  sistematizacaoSolo: number;
  seguroCapital: number;
  maoObraPermanente: number;
  remuneracaoCapital: number;
  remuneracaoTerra: number;
  totalCustosFixos: number;
  totalCustoOportunidade: number;
  custoOperacional: number;
  custoTotal: number;
}

export interface PrecoMercadoFisico {
  precoFOBItai: number;
  precoCIFSantos: number;
}

export interface InformacoesHedge {
  dataTrava: number; // Data em formato Excel
  ndfDolar: number;
  dolarPtax: number;
  ndfSoja: number;
  precoChicagoFechamento: number;
  quantidadeBushel: number;
  precoRealPorSaca: number;
}

export interface Estimativas {
  sacasPorHectare: number;
  areaCultivo: number;
  quantidadeSacas: number;
  custoOperacionalPorSaca: number;
  custoTotalPorSaca: number;
  freteItaiSantos: number;
  custoFretePorSaca: number;
}

// Página 1: Planilha de Custos (valores em reais)
export const custosCultivo: CustosCultivo = {
  operacaoMaquinas: 414.14,
  manutencaoBenfeitorias: 55.33,
  maoObraTemporaria: 68.40,
  sementes: 761.40,
  fertilizantes: 924.34,
  defensivos: 493.48,
  despesasGerais: 51.46,
  transporteExterno: 188.10,
  assistenciaTecnica: 55.37,
  proagroSeguro: 165.74,
  totalCustosVariaveis: 3177.76,
  depreciacaoMaquinas: 410.21,
  depreciacaoBenfeitorias: 73.78,
  sistematizacaoSolo: 159.33,
  seguroCapital: 44.31,
  maoObraPermanente: 254.94,
  remuneracaoCapital: 296.38,
  remuneracaoTerra: 1453.92,
  totalCustosFixos: 942.57,
  totalCustoOportunidade: 1750.30,
  custoOperacional: 4120.33,
  custoTotal: 5870.63,
};

// Página 2: Preço mercado físico (31/10)
export const precoMercadoFisico: PrecoMercadoFisico = {
  precoFOBItai: 124.00,
  precoCIFSantos: 134.00,
};

// Página 3: Informações de Hedge
export const informacoesHedge: InformacoesHedge = {
  dataTrava: 45960, // Data no formato Excel
  ndfDolar: 5.5605,
  dolarPtax: 5.3832,
  ndfSoja: 11.14,
  precoChicagoFechamento: 11.29,
  quantidadeBushel: 45000,
  precoRealPorSaca: 136.5245099,
};

// Página 4: Estimativas
export const estimativas: Estimativas = {
  sacasPorHectare: 90,
  areaCultivo: 500,
  quantidadeSacas: 45000,
  custoOperacionalPorSaca: 45.78,
  custoTotalPorSaca: 65.23,
  freteItaiSantos: 8500.00,
  custoFretePorSaca: 8.50,
};

// Função auxiliar para converter data do Excel para Date
export const excelDateToJSDate = (excelDate: number): Date => {
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return date;
};

// Função para formatar a data de trava
export const getDataTravaFormatada = (): string => {
  const date = excelDateToJSDate(informacoesHedge.dataTrava);
  return date.toLocaleDateString('pt-BR');
};
