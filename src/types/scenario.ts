export interface Scenario {
  id: string;
  nome: string;
  tipo: 'otimista' | 'realista' | 'pessimista' | 'personalizado';
  precoSojaChicago: number;
  precoSojaFisico: number;
  dolarPtax: number;
  dataCriacao: Date;
}

export interface ScenarioResults {
  scenario: Scenario;
  faturamentoTotal: number;
  lucroTotal: number;
  valorPorSaca: number;
  margemLucro: number;
  roi: number;
}
