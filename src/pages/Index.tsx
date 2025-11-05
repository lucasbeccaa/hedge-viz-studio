import { useState } from "react";
import { KPICard } from "@/components/KPICard";
import { EditableInput } from "@/components/EditableInput";
import { DollarSign, TrendingUp, Package, ArrowUpDown } from "lucide-react";

const Index = () => {
  // Estados para valores editáveis
  const [precoSojaChicago, setPrecoSojaChicago] = useState(1250.00);
  const [precoSojaFisico, setPrecoSojaFisico] = useState(1300.00);
  const [dolarPtax, setDolarPtax] = useState(5.20);
  const [travaNDFSoja, setTravaNDFSoja] = useState(1280.00);
  const [travaNDFDolar, setTravaNDFDolar] = useState(5.30);
  const [quantidadeBushel, setQuantidadeBushel] = useState(10000);
  const [quantidadeDolar, setQuantidadeDolar] = useState(50000);
  const [custosOperacional, setCustosOperacional] = useState(150000);
  const [travaCerealista, setTravaCerealista] = useState(1290.00);

  // Cálculos dos KPIs
  const calculaFaturamento = () => {
    const valorVendaSoja = precoSojaFisico * quantidadeBushel;
    const ajusteSoja = (travaNDFSoja - precoSojaChicago) * quantidadeBushel;
    const ajusteDolar = (travaNDFDolar - dolarPtax) * quantidadeDolar;
    return valorVendaSoja - (ajusteSoja * ajusteDolar);
  };

  const faturamentoTotal = calculaFaturamento();
  const lucroTotal = faturamentoTotal - custosOperacional;
  const valorPorSaca = faturamentoTotal / (45000 * 2.204);
  const diferencaTravaCerealista = precoSojaFisico - travaCerealista;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard de <span className="text-primary">Hedge</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Análise e simulação de operações de proteção financeira
          </p>
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
              subtitle={`Base: 45.000 sacas`}
              icon={Package}
              trend="neutral"
            />
            <KPICard
              title="Diferença sobre Trava Cerealista"
              value={`${formatNumber(diferencaTravaCerealista, 2)} pts`}
              subtitle={diferencaTravaCerealista > 0 ? "Acima da trava" : "Abaixo da trava"}
              icon={ArrowUpDown}
              trend={diferencaTravaCerealista > 0 ? "up" : "down"}
            />
          </div>
        </section>

        {/* Parâmetros Editáveis */}
        <section className="bg-gradient-card border border-border/50 rounded-lg shadow-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Parâmetros de Simulação</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                Preços de Soja
              </h3>
              <EditableInput
                label="Preço Soja Chicago"
                value={precoSojaChicago}
                onChange={setPrecoSojaChicago}
                prefix="$"
              />
              <EditableInput
                label="Preço Soja Físico"
                value={precoSojaFisico}
                onChange={setPrecoSojaFisico}
                prefix="$"
              />
              <EditableInput
                label="Trava NDF Soja"
                value={travaNDFSoja}
                onChange={setTravaNDFSoja}
                prefix="$"
              />
              <EditableInput
                label="Trava Cerealista"
                value={travaCerealista}
                onChange={setTravaCerealista}
                prefix="$"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                Câmbio
              </h3>
              <EditableInput
                label="Dólar Ptax"
                value={dolarPtax}
                onChange={setDolarPtax}
                prefix="R$"
              />
              <EditableInput
                label="Trava NDF Dólar"
                value={travaNDFDolar}
                onChange={setTravaNDFDolar}
                prefix="R$"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                Quantidades e Custos
              </h3>
              <EditableInput
                label="Quantidade de Bushel"
                value={quantidadeBushel}
                onChange={setQuantidadeBushel}
                suffix="bu"
              />
              <EditableInput
                label="Quantidade de Dólar"
                value={quantidadeDolar}
                onChange={setQuantidadeDolar}
                prefix="$"
              />
              <EditableInput
                label="Custos Operacional"
                value={custosOperacional}
                onChange={setCustosOperacional}
                prefix="R$"
              />
            </div>
          </div>
        </section>

        {/* Resumo da Operação */}
        <section className="bg-gradient-card border border-primary/20 rounded-lg shadow-elevated p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Resumo da Operação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Valor de Venda Soja Física:</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(precoSojaFisico * quantidadeBushel)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Ajuste NDF Soja:</span>
                <span className="font-semibold text-foreground">
                  {formatNumber((travaNDFSoja - precoSojaChicago) * quantidadeBushel, 2)} pts
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Ajuste NDF Dólar:</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency((travaNDFDolar - dolarPtax) * quantidadeDolar)}
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
      </main>
    </div>
  );
};

export default Index;
