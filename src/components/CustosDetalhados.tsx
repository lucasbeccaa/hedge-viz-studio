import { Card } from "@/components/ui/card";
import { custosCultivo } from "@/data/hedgeData";

export const CustosDetalhados = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Planilha de Custos - Cultivo de Soja</h2>
      
      <div className="space-y-6">
        {/* Custos Variáveis */}
        <div>
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
            Custos Variáveis
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-border/20">
              <span className="text-muted-foreground">Operação de máquinas e implementos</span>
              <span className="font-medium text-foreground">{formatCurrency(custosCultivo.operacaoMaquinas)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/20">
              <span className="text-muted-foreground">Despesas de manutenção de benfeitorias</span>
              <span className="font-medium text-foreground">{formatCurrency(custosCultivo.manutencaoBenfeitorias)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/20">
              <span className="text-muted-foreground">Mão-de-obra temporária</span>
              <span className="font-medium text-foreground">{formatCurrency(custosCultivo.maoObraTemporaria)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/20">
              <span className="text-muted-foreground">Sementes/Manivas</span>
              <span className="font-medium text-foreground">{formatCurrency(custosCultivo.sementes)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/20">
              <span className="text-muted-foreground">Fertilizantes</span>
              <span className="font-medium text-foreground">{formatCurrency(custosCultivo.fertilizantes)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/20">
              <span className="text-muted-foreground">Defensivos</span>
              <span className="font-medium text-foreground">{formatCurrency(custosCultivo.defensivos)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/20">
              <span className="text-muted-foreground">Despesas gerais</span>
              <span className="font-medium text-foreground">{formatCurrency(custosCultivo.despesasGerais)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/20">
              <span className="text-muted-foreground">Transporte externo</span>
              <span className="font-medium text-foreground">{formatCurrency(custosCultivo.transporteExterno)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/20">
              <span className="text-muted-foreground">Assistência técnica</span>
              <span className="font-medium text-foreground">{formatCurrency(custosCultivo.assistenciaTecnica)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/20">
              <span className="text-muted-foreground">PROAGRO/SEGURO</span>
              <span className="font-medium text-foreground">{formatCurrency(custosCultivo.proagroSeguro)}</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-primary/30 mt-2">
              <span className="font-semibold text-foreground">Total Custos Variáveis</span>
              <span className="font-bold text-primary text-base">{formatCurrency(custosCultivo.totalCustosVariaveis)}</span>
            </div>
          </div>
        </div>

        {/* Custos Fixos */}
        <div>
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
            Custos Fixos
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-border/20">
              <span className="text-muted-foreground">Depreciação de máquinas e implementos</span>
              <span className="font-medium text-foreground">{formatCurrency(custosCultivo.depreciacaoMaquinas)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/20">
              <span className="text-muted-foreground">Depreciação de benfeitorias e instalações</span>
              <span className="font-medium text-foreground">{formatCurrency(custosCultivo.depreciacaoBenfeitorias)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/20">
              <span className="text-muted-foreground">Sistematização e correção do solo</span>
              <span className="font-medium text-foreground">{formatCurrency(custosCultivo.sistematizacaoSolo)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/20">
              <span className="text-muted-foreground">Seguro do capital</span>
              <span className="font-medium text-foreground">{formatCurrency(custosCultivo.seguroCapital)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/20">
              <span className="text-muted-foreground">Mão-de-obra permanente</span>
              <span className="font-medium text-foreground">{formatCurrency(custosCultivo.maoObraPermanente)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/20">
              <span className="text-muted-foreground">Remuneração do capital próprio</span>
              <span className="font-medium text-foreground">{formatCurrency(custosCultivo.remuneracaoCapital)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/20">
              <span className="text-muted-foreground">Remuneração da terra</span>
              <span className="font-medium text-foreground">{formatCurrency(custosCultivo.remuneracaoTerra)}</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-primary/30 mt-2">
              <span className="font-semibold text-foreground">Total Custos Fixos</span>
              <span className="font-bold text-primary text-base">{formatCurrency(custosCultivo.totalCustosFixos)}</span>
            </div>
          </div>
        </div>

        {/* Resumo Total */}
        <div className="bg-surface/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between py-2">
            <span className="font-semibold text-foreground">Custo Operacional</span>
            <span className="font-bold text-lg text-foreground">{formatCurrency(custosCultivo.custoOperacional)}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-primary/20">
            <span className="font-semibold text-foreground">Custo Total</span>
            <span className="font-bold text-xl text-primary">{formatCurrency(custosCultivo.custoTotal)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
