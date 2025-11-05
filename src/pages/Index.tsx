import { useState } from "react";
import { KPICard } from "@/components/KPICard";
import { EditableInput } from "@/components/EditableInput";
import { CustosDetalhados } from "@/components/CustosDetalhados";
import { EstimativasProducao } from "@/components/EstimativasProducao";
import { ScenarioManager } from "@/components/ScenarioManager";
import { ScenarioComparison } from "@/components/ScenarioComparison";
import { Scenario, ScenarioResults } from "@/types/scenario";
import { DollarSign, TrendingUp, Package, ArrowUpDown, Calendar, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  informacoesHedge, 
  precoMercadoFisico, 
  estimativas, 
  custosCultivo,
  getDataTravaFormatada 
} from "@/data/hedgeData";

const Index = () => {
  // Estados para valores editáveis - inicializados com dados reais
  const [precoSojaChicago, setPrecoSojaChicago] = useState(informacoesHedge.precoChicagoFechamento);
  const [precoSojaFisico, setPrecoSojaFisico] = useState(precoMercadoFisico.precoCIFSantos);
  const [dolarPtax, setDolarPtax] = useState(informacoesHedge.dolarPtax);
  
  // Estado para gerenciar cenários salvos
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  
  // Valores fixos da trava
  const travaNDFSoja = informacoesHedge.ndfSoja;
  const travaNDFDolar = informacoesHedge.ndfDolar;
  const quantidadeBushel = informacoesHedge.quantidadeBushel;
  
  // Cálculo da quantidade de dólares baseado no valor da operação
  const quantidadeDolar = quantidadeBushel * travaNDFSoja;
  
  // Custos da planilha
  const custosOperacional = custosCultivo.custoOperacional * estimativas.quantidadeSacas;

  // Cálculos dos KPIs conforme fórmula fornecida
  const calculaFaturamento = () => {
    // Conversão: bushel para sacas (1 bushel = 27.216 kg, 1 saca = 60 kg)
    const bushelsParaSacas = quantidadeBushel / 2.204;
    const valorVendaSojaFisica = precoSojaFisico * bushelsParaSacas;
    
    // Ajuste NDF Soja
    const ajusteNDFSoja = (travaNDFSoja - precoSojaChicago) * quantidadeBushel;
    
    // Ajuste NDF Dólar
    const ajusteNDFDolar = (travaNDFDolar - dolarPtax) * quantidadeDolar;
    
    return valorVendaSojaFisica - (ajusteNDFSoja * ajusteNDFDolar);
  };

  const faturamentoTotal = calculaFaturamento();
  const lucroTotal = faturamentoTotal - custosOperacional;
  const valorPorSaca = faturamentoTotal / estimativas.quantidadeSacas;
  const diferencaTravaCerealista = precoSojaFisico - informacoesHedge.precoRealPorSaca;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals);
  };

  // Funções para gerenciar cenários
  const handleAddScenario = (scenario: Scenario) => {
    setScenarios([...scenarios, scenario]);
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  // Calcular resultados para cada cenário
  const calculateScenarioResults = (scenario: Scenario): ScenarioResults => {
    const bushelsParaSacas = quantidadeBushel / 2.204;
    const valorVendaSojaFisica = scenario.precoSojaFisico * bushelsParaSacas;
    const ajusteNDFSoja = (travaNDFSoja - scenario.precoSojaChicago) * quantidadeBushel;
    const ajusteNDFDolar = (travaNDFDolar - scenario.dolarPtax) * quantidadeDolar;
    const faturamento = valorVendaSojaFisica - (ajusteNDFSoja * ajusteNDFDolar);
    const lucro = faturamento - custosOperacional;
    const valorSaca = faturamento / estimativas.quantidadeSacas;
    const margem = (lucro / faturamento) * 100;
    const roi = (lucro / custosOperacional) * 100;

    return {
      scenario,
      faturamentoTotal: faturamento,
      lucroTotal: lucro,
      valorPorSaca: valorSaca,
      margemLucro: margem,
      roi: roi,
    };
  };

  const scenarioResults: ScenarioResults[] = scenarios.map(calculateScenarioResults);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Dashboard de <span className="text-primary">Hedge</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Análise e simulação de operações de proteção financeira
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="bg-surface/50 px-4 py-2 rounded-lg border border-border/30">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Data da Trava</p>
                    <p className="font-semibold text-foreground">{getDataTravaFormatada()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface/50 px-4 py-2 rounded-lg border border-border/30">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Área Total</p>
                    <p className="font-semibold text-foreground">{estimativas.areaCultivo} hectares</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* KPIs Section */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Indicadores Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Faturamento Total"
              value={formatCurrency(faturamentoTotal)}
              icon={DollarSign}
              trend="up"
            />
            <KPICard
              title="Lucro Total"
              value={formatCurrency(lucroTotal)}
              subtitle={`Margem: ${((lucroTotal / faturamentoTotal) * 100).toFixed(1)}%`}
              icon={TrendingUp}
              trend={lucroTotal > 0 ? "up" : "down"}
            />
            <KPICard
              title="Valor por Saca"
              value={formatCurrency(valorPorSaca)}
              subtitle={`${formatNumber(estimativas.quantidadeSacas, 0)} sacas`}
              icon={Package}
              trend="neutral"
            />
            <KPICard
              title="Diferença sobre Trava"
              value={formatCurrency(diferencaTravaCerealista)}
              subtitle={diferencaTravaCerealista > 0 ? "Acima da trava" : "Abaixo da trava"}
              icon={ArrowUpDown}
              trend={diferencaTravaCerealista > 0 ? "up" : "down"}
            />
          </div>
        </section>

        {/* Tabs para diferentes visualizações */}
        <Tabs defaultValue="simulacao" className="space-y-6">
          <TabsList className="bg-surface border border-border/50">
            <TabsTrigger value="simulacao">Simulação</TabsTrigger>
            <TabsTrigger value="cenarios">Cenários</TabsTrigger>
            <TabsTrigger value="comparacao">Comparação</TabsTrigger>
            <TabsTrigger value="custos">Custos Detalhados</TabsTrigger>
            <TabsTrigger value="estimativas">Estimativas</TabsTrigger>
          </TabsList>

          {/* Tab: Simulação */}
          <TabsContent value="simulacao" className="space-y-6">
            {/* Parâmetros Editáveis */}
            <section className="bg-gradient-card border border-border/50 rounded-lg shadow-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Parâmetros de Simulação</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                    Valores Editáveis
                  </h3>
                  <EditableInput
                    label="Preço Soja Chicago (vencimento)"
                    value={precoSojaChicago}
                    onChange={setPrecoSojaChicago}
                    prefix="$"
                  />
                  <EditableInput
                    label="Preço Soja Físico CIF/Santos"
                    value={precoSojaFisico}
                    onChange={setPrecoSojaFisico}
                    prefix="R$"
                  />
                  <EditableInput
                    label="Dólar Ptax (vencimento)"
                    value={dolarPtax}
                    onChange={setDolarPtax}
                    prefix="R$"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                    Valores da Trava (Fixos)
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-surface/30 rounded-lg p-3 border border-border/20">
                      <p className="text-xs text-muted-foreground mb-1">NDF Soja</p>
                      <p className="text-lg font-bold text-foreground">${formatNumber(travaNDFSoja)}</p>
                    </div>
                    <div className="bg-surface/30 rounded-lg p-3 border border-border/20">
                      <p className="text-xs text-muted-foreground mb-1">NDF Dólar</p>
                      <p className="text-lg font-bold text-foreground">R$ {formatNumber(travaNDFDolar)}</p>
                    </div>
                    <div className="bg-surface/30 rounded-lg p-3 border border-border/20">
                      <p className="text-xs text-muted-foreground mb-1">Quantidade de Bushel</p>
                      <p className="text-lg font-bold text-foreground">{formatNumber(quantidadeBushel, 0)} bu</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                    Preços de Referência
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-surface/30 rounded-lg p-3 border border-border/20">
                      <p className="text-xs text-muted-foreground mb-1">Preço FOB Itaí</p>
                      <p className="text-lg font-bold text-foreground">{formatCurrency(precoMercadoFisico.precoFOBItai)}</p>
                    </div>
                    <div className="bg-surface/30 rounded-lg p-3 border border-border/20">
                      <p className="text-xs text-muted-foreground mb-1">Preço CIF Santos</p>
                      <p className="text-lg font-bold text-foreground">{formatCurrency(precoMercadoFisico.precoCIFSantos)}</p>
                    </div>
                    <div className="bg-surface/30 rounded-lg p-3 border border-border/20">
                      <p className="text-xs text-muted-foreground mb-1">Preço R$/Saca (Trava)</p>
                      <p className="text-lg font-bold text-primary">{formatCurrency(informacoesHedge.precoRealPorSaca)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Resumo da Operação */}
            <section className="bg-gradient-card border border-primary/20 rounded-lg shadow-elevated p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Resumo da Operação</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Valor de Venda Soja Física:</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(precoSojaFisico * (quantidadeBushel / 2.204))}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Ajuste NDF Soja:</span>
                    <span className="font-semibold text-foreground">
                      ${formatNumber((travaNDFSoja - precoSojaChicago) * quantidadeBushel, 2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Ajuste NDF Dólar:</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency((travaNDFDolar - dolarPtax) * quantidadeDolar)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Custos Operacional Total:</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(custosOperacional)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Total de Bushels:</span>
                    <span className="font-semibold text-foreground">
                      {formatNumber(quantidadeBushel, 0)} bu
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Total de Sacas:</span>
                    <span className="font-semibold text-foreground">
                      {formatNumber(estimativas.quantidadeSacas, 0)} sacas
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Margem de Lucro:</span>
                    <span className={`font-semibold ${lucroTotal > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {((lucroTotal / faturamentoTotal) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground">ROI sobre Custos:</span>
                    <span className="font-semibold text-primary">
                      {((lucroTotal / custosOperacional) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* Tab: Cenários */}
          <TabsContent value="cenarios">
            <ScenarioManager
              scenarios={scenarios}
              onAddScenario={handleAddScenario}
              onDeleteScenario={handleDeleteScenario}
              currentValues={{
                precoSojaChicago,
                precoSojaFisico,
                dolarPtax,
              }}
            />
          </TabsContent>

          {/* Tab: Comparação */}
          <TabsContent value="comparacao">
            <ScenarioComparison scenarioResults={scenarioResults} />
          </TabsContent>

          {/* Tab: Custos Detalhados */}
          <TabsContent value="custos">
            <CustosDetalhados />
          </TabsContent>

          {/* Tab: Estimativas */}
          <TabsContent value="estimativas">
            <EstimativasProducao />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
