import { Card } from "@/components/ui/card";
import { estimativas } from "@/data/hedgeData";
import { Wheat, MapPin, Package2, Truck } from "lucide-react";

interface EstimativasProducaoProps {
  custoFrete60Ton: number;
}

export const EstimativasProducao = ({ custoFrete60Ton }: EstimativasProducaoProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const cards = [
    {
      icon: Wheat,
      label: "Produtividade",
      value: `${estimativas.sacasPorHectare} sc/ha`,
      color: "text-green-400",
    },
    {
      icon: MapPin,
      label: "Área de Cultivo",
      value: `${formatNumber(estimativas.areaCultivo)} hectares`,
      color: "text-blue-400",
    },
    {
      icon: Package2,
      label: "Produção Total",
      value: `${formatNumber(estimativas.quantidadeSacas)} sacas`,
      color: "text-primary",
    },
    {
      icon: Truck,
      label: "Frete Itaí → Santos",
      value: formatCurrency(custoFrete60Ton),
      color: "text-orange-400",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Estimativas de Produção</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card key={index} className="bg-gradient-card border-border/50 shadow-card p-4">
            <div className="flex items-center gap-3">
              <div className="bg-surface/50 p-2 rounded-lg">
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-lg font-bold text-foreground">{card.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-card border-border/50 shadow-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between py-2 border-b border-border/30">
            <span className="text-muted-foreground">Custo Operacional/Saca:</span>
            <span className="font-semibold text-foreground">{formatCurrency(estimativas.custoOperacionalPorSaca)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/30">
            <span className="text-muted-foreground">Custo Total/Saca:</span>
            <span className="font-semibold text-foreground">{formatCurrency(estimativas.custoTotalPorSaca)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/30">
            <span className="text-muted-foreground">Custo Frete/Saca:</span>
            <span className="font-semibold text-foreground">{formatCurrency(estimativas.custoFretePorSaca)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/30">
            <span className="text-muted-foreground">Custo Total + Frete/Saca:</span>
            <span className="font-semibold text-primary">
              {formatCurrency(estimativas.custoTotalPorSaca + estimativas.custoFretePorSaca)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
