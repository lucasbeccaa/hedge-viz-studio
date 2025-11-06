import { useState } from "react";
import { Scenario } from "@/types/scenario";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ScenarioManagerProps {
  scenarios: Scenario[];
  onAddScenario: (scenario: Scenario) => void;
  onDeleteScenario: (id: string) => void;
  currentValues: {
    precoSojaChicago: number;
    precoSojaFisico: number;
    dolarPtax: number;
    tipoEntrega: 'FOB' | 'CIF';
    custoFrete60Ton: number;
  };
}

export const ScenarioManager = ({
  scenarios,
  onAddScenario,
  onDeleteScenario,
  currentValues,
}: ScenarioManagerProps) => {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<Scenario["tipo"]>("realista");
  const [precoSojaChicago, setPrecoSojaChicago] = useState(currentValues.precoSojaChicago);
  const [precoSojaFisico, setPrecoSojaFisico] = useState(currentValues.precoSojaFisico);
  const [dolarPtax, setDolarPtax] = useState(currentValues.dolarPtax);
  const [tipoEntrega, setTipoEntrega] = useState<'FOB' | 'CIF'>(currentValues.tipoEntrega);
  const [custoFrete60Ton, setCustoFrete60Ton] = useState(currentValues.custoFrete60Ton);

  const handleAddScenario = () => {
    if (!nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o cenário.",
        variant: "destructive",
      });
      return;
    }

    const newScenario: Scenario = {
      id: `scenario-${Date.now()}`,
      nome,
      tipo,
      precoSojaChicago,
      precoSojaFisico,
      dolarPtax,
      tipoEntrega,
      custoFrete60Ton,
      dataCriacao: new Date(),
    };

    onAddScenario(newScenario);
    
    // Reset form
    setNome("");
    setTipo("realista");
    
    toast({
      title: "Cenário criado",
      description: `Cenário "${nome}" foi adicionado com sucesso.`,
    });
  };

  const getTipoColor = (tipo: Scenario["tipo"]) => {
    switch (tipo) {
      case "otimista":
        return "text-green-400";
      case "pessimista":
        return "text-red-400";
      case "realista":
        return "text-blue-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getTipoLabel = (tipo: Scenario["tipo"]) => {
    switch (tipo) {
      case "otimista":
        return "Otimista";
      case "pessimista":
        return "Pessimista";
      case "realista":
        return "Realista";
      default:
        return "Personalizado";
    }
  };

  return (
    <div className="space-y-6">
      {/* Form para criar novo cenário */}
      <Card className="p-6 bg-gradient-card border-border/50">
        <h3 className="text-lg font-semibold text-foreground mb-4">Criar Novo Cenário</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label>Nome do Cenário</Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Preços Baixos Q1 2024"
              className="bg-surface border-border"
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={(value) => setTipo(value as Scenario["tipo"])}>
              <SelectTrigger className="bg-surface border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="otimista">Otimista</SelectItem>
                <SelectItem value="realista">Realista</SelectItem>
                <SelectItem value="pessimista">Pessimista</SelectItem>
                <SelectItem value="personalizado">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="space-y-2">
            <Label>Preço Soja Chicago</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                value={precoSojaChicago}
                onChange={(e) => setPrecoSojaChicago(parseFloat(e.target.value) || 0)}
                className="bg-surface border-border pl-8"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preço Soja Físico</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
              <Input
                type="number"
                value={precoSojaFisico}
                onChange={(e) => setPrecoSojaFisico(parseFloat(e.target.value) || 0)}
                className="bg-surface border-border pl-8"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dólar Ptax</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
              <Input
                type="number"
                value={dolarPtax}
                onChange={(e) => setDolarPtax(parseFloat(e.target.value) || 0)}
                className="bg-surface border-border pl-8"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Tipo de Entrega</Label>
            <Select value={tipoEntrega} onValueChange={(value: 'FOB' | 'CIF') => setTipoEntrega(value)}>
              <SelectTrigger className="bg-surface border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface border-border z-50">
                <SelectItem value="FOB">FOB/Itaí</SelectItem>
                <SelectItem value="CIF">CIF/Santos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Custo Frete 60 Ton</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
              <Input
                type="number"
                value={custoFrete60Ton}
                onChange={(e) => setCustoFrete60Ton(parseFloat(e.target.value) || 0)}
                className="bg-surface border-border pl-8"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <Button onClick={handleAddScenario} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Cenário
        </Button>
      </Card>

      {/* Lista de cenários salvos */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          Cenários Salvos ({scenarios.length})
        </h3>
        
        {scenarios.length === 0 ? (
          <Card className="p-6 bg-surface/30 border-border/50 text-center">
            <p className="text-muted-foreground">
              Nenhum cenário salvo. Crie seu primeiro cenário acima.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className="p-4 bg-surface/50 border-border/50 hover:border-primary/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{scenario.nome}</h4>
                    <p className={`text-sm ${getTipoColor(scenario.tipo)}`}>
                      {getTipoLabel(scenario.tipo)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteScenario(scenario.id)}
                    className="h-8 w-8 hover:bg-destructive/20"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Soja Chicago:</span>
                    <span className="font-semibold text-foreground">${scenario.precoSojaChicago.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Soja Físico:</span>
                    <span className="font-semibold text-foreground">R$ {scenario.precoSojaFisico.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dólar Ptax:</span>
                    <span className="font-semibold text-foreground">R$ {scenario.dolarPtax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entrega:</span>
                    <span className="font-semibold text-foreground">{scenario.tipoEntrega}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete 60 Ton:</span>
                    <span className="font-semibold text-foreground">R$ {scenario.custoFrete60Ton.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
