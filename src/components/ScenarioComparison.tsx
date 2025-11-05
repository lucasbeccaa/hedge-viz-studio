import { Scenario, ScenarioResults } from "@/types/scenario";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, DollarSign, Package, Target } from "lucide-react";

interface ScenarioComparisonProps {
  scenarioResults: ScenarioResults[];
}

export const ScenarioComparison = ({ scenarioResults }: ScenarioComparisonProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getTipoColor = (tipo: Scenario["tipo"]) => {
    switch (tipo) {
      case "otimista":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pessimista":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "realista":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-surface/20 text-muted-foreground border-border/30";
    }
  };

  const getTrendIcon = (tipo: Scenario["tipo"]) => {
    switch (tipo) {
      case "otimista":
        return <TrendingUp className="h-4 w-4" />;
      case "pessimista":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getBestScenario = (metric: keyof Pick<ScenarioResults, 'faturamentoTotal' | 'lucroTotal' | 'valorPorSaca'>) => {
    if (scenarioResults.length === 0) return null;
    return scenarioResults.reduce((best, current) => 
      current[metric] > best[metric] ? current : best
    );
  };

  const bestFaturamento = getBestScenario('faturamentoTotal');
  const bestLucro = getBestScenario('lucroTotal');
  const bestValorSaca = getBestScenario('valorPorSaca');

  if (scenarioResults.length === 0) {
    return (
      <Card className="p-8 bg-surface/30 border-border/50 text-center">
        <p className="text-muted-foreground">
          Nenhum cenário disponível para comparação. Crie cenários na aba "Cenários" para visualizar a comparação.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Comparação de Cenários ({scenarioResults.length})
        </h2>
      </div>

      {/* Comparação lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {scenarioResults.map((result) => (
          <Card
            key={result.scenario.id}
            className="p-6 bg-gradient-card border-border/50 hover:border-primary/30 transition-all"
          >
            {/* Header do cenário */}
            <div className="mb-4 pb-4 border-b border-border/30">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground text-lg">
                  {result.scenario.nome}
                </h3>
                {getTrendIcon(result.scenario.tipo)}
              </div>
              <Badge className={getTipoColor(result.scenario.tipo)}>
                {result.scenario.tipo.charAt(0).toUpperCase() + result.scenario.tipo.slice(1)}
              </Badge>
            </div>

            {/* Parâmetros do cenário */}
            <div className="space-y-2 mb-4 pb-4 border-b border-border/30">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Soja Chicago:</span>
                <span className="font-semibold text-foreground">${result.scenario.precoSojaChicago.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Soja Físico:</span>
                <span className="font-semibold text-foreground">R$ {result.scenario.precoSojaFisico.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dólar Ptax:</span>
                <span className="font-semibold text-foreground">R$ {result.scenario.dolarPtax.toFixed(2)}</span>
              </div>
            </div>

            {/* Resultados */}
            <div className="space-y-3">
              <div className="bg-surface/30 rounded-lg p-3 border border-border/20">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Faturamento Total</span>
                  {bestFaturamento?.scenario.id === result.scenario.id && (
                    <Badge variant="outline" className="ml-auto text-xs bg-primary/20 text-primary border-primary/30">
                      Melhor
                    </Badge>
                  )}
                </div>
                <p className="text-lg font-bold text-foreground">{formatCurrency(result.faturamentoTotal)}</p>
              </div>

              <div className="bg-surface/30 rounded-lg p-3 border border-border/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Lucro Total</span>
                  {bestLucro?.scenario.id === result.scenario.id && (
                    <Badge variant="outline" className="ml-auto text-xs bg-primary/20 text-primary border-primary/30">
                      Melhor
                    </Badge>
                  )}
                </div>
                <p className={`text-lg font-bold ${result.lucroTotal > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(result.lucroTotal)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Margem: {result.margemLucro.toFixed(2)}% | ROI: {result.roi.toFixed(2)}%
                </p>
              </div>

              <div className="bg-surface/30 rounded-lg p-3 border border-border/20">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Valor por Saca</span>
                  {bestValorSaca?.scenario.id === result.scenario.id && (
                    <Badge variant="outline" className="ml-auto text-xs bg-primary/20 text-primary border-primary/30">
                      Melhor
                    </Badge>
                  )}
                </div>
                <p className="text-lg font-bold text-foreground">{formatCurrency(result.valorPorSaca)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Resumo comparativo */}
      {scenarioResults.length > 1 && (
        <Card className="p-6 bg-gradient-card border-primary/20">
          <h3 className="text-lg font-semibold text-foreground mb-4">Resumo Comparativo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface/30 rounded-lg p-4 border border-border/20">
              <p className="text-sm text-muted-foreground mb-2">Melhor Faturamento</p>
              <p className="font-bold text-primary">{bestFaturamento?.scenario.nome}</p>
              <p className="text-lg font-semibold text-foreground mt-1">
                {formatCurrency(bestFaturamento?.faturamentoTotal || 0)}
              </p>
            </div>
            <div className="bg-surface/30 rounded-lg p-4 border border-border/20">
              <p className="text-sm text-muted-foreground mb-2">Melhor Lucro</p>
              <p className="font-bold text-primary">{bestLucro?.scenario.nome}</p>
              <p className="text-lg font-semibold text-green-400 mt-1">
                {formatCurrency(bestLucro?.lucroTotal || 0)}
              </p>
            </div>
            <div className="bg-surface/30 rounded-lg p-4 border border-border/20">
              <p className="text-sm text-muted-foreground mb-2">Melhor Valor/Saca</p>
              <p className="font-bold text-primary">{bestValorSaca?.scenario.nome}</p>
              <p className="text-lg font-semibold text-foreground mt-1">
                {formatCurrency(bestValorSaca?.valorPorSaca || 0)}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
