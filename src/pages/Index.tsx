import { useState } from "react";
import { KPICard } from "@/components/KPICard";
import { EditableInput } from "@/components/EditableInput";
import { CustosDetalhados } from "@/components/CustosDetalhados";
import { EstimativasProducao } from "@/components/EstimativasProducao";
import { ScenarioManager } from "@/components/ScenarioManager";
import { ScenarioComparison } from "@/components/ScenarioComparison";
import { Scenario, ScenarioResults } from "@/types/scenario";
import { DollarSign, TrendingUp, Package, ArrowUpDown, Calendar, MapPin, FileDown, Shield, AlertTriangle, BarChart3 } from "lucide-react";
import { generateEditableTemplate } from "@/utils/excelExport";
import { Button } from "@/components/ui/button";
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
  
  // Custos da planilha (Custo Operacional por hectare * Área de cultivo)
  const custosOperacional = custosCultivo.custoOperacional * estimativas.areaCultivo;

  // Cálculos dos KPIs conforme fórmula fornecida
  const calculaFaturamento = () => {
    // Conversão: bushel para sacas (1 bushel = 27.216 kg, 1 saca = 60 kg)
    const bushelsParaSacas = quantidadeBushel / 2.204;
    const valorVendaSojaFisica = precoSojaFisico * bushelsParaSacas;
    
    // Ajuste NDF Soja (em dólares)
    const ajusteNDFSoja = (travaNDFSoja - precoSojaChicago) * quantidadeBushel;
    
    // Ajuste NDF Dólar (em reais)
    const ajusteNDFDolar = (travaNDFDolar - dolarPtax) * quantidadeDolar;
    
    // Faturamento = Valor de Venda + (Ajuste Soja * Dólar Ptax) + Ajuste Dólar
    return valorVendaSojaFisica + (ajusteNDFSoja * dolarPtax) + ajusteNDFDolar;
  };

  // Cálculos separados: Parcela Protegida vs Parcela Exposta
  const bushelsParaSacas = quantidadeBushel / 2.204; // Sacas protegidas pelo hedge
  const sacasExpostas = estimativas.quantidadeSacas - bushelsParaSacas; // Sacas sem proteção
  const percentualCobertura = (bushelsParaSacas / estimativas.quantidadeSacas) * 100;
  
  // Parcela Protegida (Hedge)
  const faturamentoProtegido = calculaFaturamento();
  const valorPorSacaProtegida = faturamentoProtegido / bushelsParaSacas;
  const custoOperacionalProtegido = (bushelsParaSacas / estimativas.quantidadeSacas) * custosOperacional;
  const lucroProtegido = faturamentoProtegido - custoOperacionalProtegido;
  
  // Parcela Exposta (Spot)
  const faturamentoExpostoSpot = precoSojaFisico * sacasExpostas;
  const valorPorSacaSpot = precoSojaFisico;
  const custoOperacionalExposto = (sacasExpostas / estimativas.quantidadeSacas) * custosOperacional;
  const lucroExpostoSpot = faturamentoExpostoSpot - custoOperacionalExposto;
  
  // Totais Consolidados
  const faturamentoTotal = faturamentoProtegido + faturamentoExpostoSpot;
  const lucroTotal = lucroProtegido + lucroExpostoSpot;
  const valorPorSaca = faturamentoTotal / estimativas.quantidadeSacas;
  const diferencaTravaCerealista = valorPorSacaProtegida - informacoesHedge.precoRealPorSaca;

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
    const sacasExpostas = estimativas.quantidadeSacas - bushelsParaSacas;
    
    // Parcela Protegida - usando fórmula correta
    const valorVendaSojaFisica = scenario.precoSojaFisico * bushelsParaSacas;
    const ajusteNDFSoja = (travaNDFSoja - scenario.precoSojaChicago) * quantidadeBushel;
    const ajusteNDFDolar = (travaNDFDolar - scenario.dolarPtax) * quantidadeDolar;
    const faturamentoProtegido = valorVendaSojaFisica + (ajusteNDFSoja * scenario.dolarPtax) + ajusteNDFDolar;
    
    // Parcela Exposta
    const faturamentoExpostoSpot = scenario.precoSojaFisico * sacasExpostas;
    
    // Totais
    const faturamento = faturamentoProtegido + faturamentoExpostoSpot;
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

  const handleExportExcel = () => {
    generateEditableTemplate(scenarios, {
      precoSojaChicago,
      precoSojaFisico,
      dolarPtax,
    });
  };

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
            <Button 
              onClick={handleExportExcel}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <FileDown className="h-4 w-4" />
              Exportar Template Excel
            </Button>
          </div>
          <div className="flex gap-4 text-sm mt-4">
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
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* KPIs Section - Totais Consolidados */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Indicadores Consolidados</h2>
            <div className="bg-primary/10 px-4 py-2 rounded-lg border border-primary/30">
              <p className="text-sm text-muted-foreground">Cobertura do Hedge</p>
              <p className="text-lg font-bold text-primary">{percentualCobertura.toFixed(1)}%</p>
            </div>
          </div>
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
              title="Valor Médio por Saca"
              value={formatCurrency(valorPorSaca)}
              subtitle={`${formatNumber(estimativas.quantidadeSacas, 0)} sacas totais`}
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

        {/* KPIs Section - Parcela Protegida vs Exposta */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Análise Segmentada</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Parcela Protegida */}
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/30">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <Shield className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Parcela Protegida (Hedge)</h3>
                      <p className="text-sm text-muted-foreground">{formatNumber(bushelsParaSacas, 0)} sacas</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Faturamento</span>
                    <span className="text-lg font-bold text-foreground">{formatCurrency(faturamentoProtegido)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Lucro</span>
                    <span className={`text-lg font-bold ${lucroProtegido > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(lucroProtegido)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Valor por Saca</span>
                    <span className="text-lg font-bold text-foreground">{formatCurrency(valorPorSacaProtegida)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-green-500/20">
                    <span className="text-sm text-muted-foreground">Margem de Lucro</span>
                    <span className="text-base font-semibold text-green-500">
                      {((lucroProtegido / faturamentoProtegido) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Parcela Exposta */}
            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/30">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-500/20 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Parcela Exposta (Spot)</h3>
                      <p className="text-sm text-muted-foreground">{formatNumber(sacasExpostas, 0)} sacas</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Faturamento</span>
                    <span className="text-lg font-bold text-foreground">{formatCurrency(faturamentoExpostoSpot)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Lucro</span>
                    <span className={`text-lg font-bold ${lucroExpostoSpot > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(lucroExpostoSpot)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Valor por Saca</span>
                    <span className="text-lg font-bold text-foreground">{formatCurrency(valorPorSacaSpot)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-orange-500/20">
                    <span className="text-sm text-muted-foreground">Margem de Lucro</span>
                    <span className="text-base font-semibold text-orange-500">
                      {((lucroExpostoSpot / faturamentoExpostoSpot) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Comparação Direta */}
          <Card className="mt-6 bg-gradient-card border-border/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Comparação de Performance</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface/30 rounded-lg p-4 border border-border/20">
                  <p className="text-xs text-muted-foreground mb-2">Diferença de Valor por Saca</p>
                  <p className={`text-2xl font-bold ${(valorPorSacaProtegida - valorPorSacaSpot) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(valorPorSacaProtegida - valorPorSacaSpot)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(valorPorSacaProtegida - valorPorSacaSpot) > 0 ? 'Hedge melhor que Spot' : 'Spot melhor que Hedge'}
                  </p>
                </div>
                
                <div className="bg-surface/30 rounded-lg p-4 border border-border/20">
                  <p className="text-xs text-muted-foreground mb-2">Diferença de Margem</p>
                  <p className={`text-2xl font-bold ${((lucroProtegido/faturamentoProtegido) - (lucroExpostoSpot/faturamentoExpostoSpot)) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {(((lucroProtegido/faturamentoProtegido) - (lucroExpostoSpot/faturamentoExpostoSpot)) * 100).toFixed(2)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Protegida vs Exposta</p>
                </div>
                
                <div className="bg-surface/30 rounded-lg p-4 border border-border/20">
                  <p className="text-xs text-muted-foreground mb-2">Impacto do Hedge no Total</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency((valorPorSacaProtegida - valorPorSacaSpot) * bushelsParaSacas)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Ganho/Perda vs Spot puro</p>
                </div>
              </div>
            </div>
          </Card>
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
