import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CustosCultivo } from "@/data/hedgeData";

interface CustosDetalhadosProps {
  custos: CustosCultivo;
  onCustosChange: (custos: CustosCultivo) => void;
}

export const CustosDetalhados = ({ custos, onCustosChange }: CustosDetalhadosProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleValueChange = (field: keyof CustosCultivo, value: number) => {
    const updatedCustos = { ...custos, [field]: value };
    
    // Recalcular totais
    updatedCustos.totalCustosVariaveis = 
      updatedCustos.operacaoMaquinas +
      updatedCustos.manutencaoBenfeitorias +
      updatedCustos.maoObraTemporaria +
      updatedCustos.sementes +
      updatedCustos.fertilizantes +
      updatedCustos.defensivos +
      updatedCustos.despesasGerais +
      updatedCustos.transporteExterno +
      updatedCustos.assistenciaTecnica +
      updatedCustos.proagroSeguro;
    
    updatedCustos.totalCustosFixos = 
      updatedCustos.depreciacaoMaquinas +
      updatedCustos.depreciacaoBenfeitorias +
      updatedCustos.sistematizacaoSolo +
      updatedCustos.seguroCapital +
      updatedCustos.maoObraPermanente +
      updatedCustos.remuneracaoCapital +
      updatedCustos.remuneracaoTerra;
    
    updatedCustos.custoOperacional = updatedCustos.totalCustosVariaveis;
    updatedCustos.custoTotal = updatedCustos.totalCustosVariaveis + updatedCustos.totalCustosFixos;
    
    onCustosChange(updatedCustos);
  };

  const EditableValue = ({ value, field }: { value: number; field: keyof CustosCultivo }) => (
    <Input
      type="number"
      value={value}
      onChange={(e) => handleValueChange(field, parseFloat(e.target.value) || 0)}
      className="h-8 w-32 text-right bg-surface border-border text-foreground font-medium"
      step="0.01"
    />
  );

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
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Operação de máquinas e implementos</span>
              <EditableValue value={custos.operacaoMaquinas} field="operacaoMaquinas" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Despesas de manutenção de benfeitorias</span>
              <EditableValue value={custos.manutencaoBenfeitorias} field="manutencaoBenfeitorias" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Mão-de-obra temporária</span>
              <EditableValue value={custos.maoObraTemporaria} field="maoObraTemporaria" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Sementes/Manivas</span>
              <EditableValue value={custos.sementes} field="sementes" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Fertilizantes</span>
              <EditableValue value={custos.fertilizantes} field="fertilizantes" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Defensivos</span>
              <EditableValue value={custos.defensivos} field="defensivos" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Despesas gerais</span>
              <EditableValue value={custos.despesasGerais} field="despesasGerais" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Transporte externo</span>
              <EditableValue value={custos.transporteExterno} field="transporteExterno" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Assistência técnica</span>
              <EditableValue value={custos.assistenciaTecnica} field="assistenciaTecnica" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">PROAGRO/SEGURO</span>
              <EditableValue value={custos.proagroSeguro} field="proagroSeguro" />
            </div>
            <div className="flex justify-between py-3 border-t-2 border-primary/30 mt-2">
              <span className="font-semibold text-foreground">Total Custos Variáveis</span>
              <span className="font-bold text-primary text-base">{formatCurrency(custos.totalCustosVariaveis)}</span>
            </div>
          </div>
        </div>

        {/* Custos Fixos */}
        <div>
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
            Custos Fixos
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Depreciação de máquinas e implementos</span>
              <EditableValue value={custos.depreciacaoMaquinas} field="depreciacaoMaquinas" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Depreciação de benfeitorias e instalações</span>
              <EditableValue value={custos.depreciacaoBenfeitorias} field="depreciacaoBenfeitorias" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Sistematização e correção do solo</span>
              <EditableValue value={custos.sistematizacaoSolo} field="sistematizacaoSolo" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Seguro do capital</span>
              <EditableValue value={custos.seguroCapital} field="seguroCapital" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Mão-de-obra permanente</span>
              <EditableValue value={custos.maoObraPermanente} field="maoObraPermanente" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Remuneração do capital próprio</span>
              <EditableValue value={custos.remuneracaoCapital} field="remuneracaoCapital" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Remuneração da terra</span>
              <EditableValue value={custos.remuneracaoTerra} field="remuneracaoTerra" />
            </div>
            <div className="flex justify-between py-3 border-t-2 border-primary/30 mt-2">
              <span className="font-semibold text-foreground">Total Custos Fixos</span>
              <span className="font-bold text-primary text-base">{formatCurrency(custos.totalCustosFixos)}</span>
            </div>
          </div>
        </div>

        {/* Resumo Total */}
        <div className="bg-surface/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between py-2">
            <span className="font-semibold text-foreground">Custo Operacional</span>
            <span className="font-bold text-lg text-foreground">{formatCurrency(custos.custoOperacional)}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-primary/20">
            <span className="font-semibold text-foreground">Custo Total</span>
            <span className="font-bold text-xl text-primary">{formatCurrency(custos.custoTotal)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
