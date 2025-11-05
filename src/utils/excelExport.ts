import * as XLSX from 'xlsx';
import { custosCultivo, precoMercadoFisico, informacoesHedge, estimativas } from '@/data/hedgeData';
import { Scenario } from '@/types/scenario';

export const generateEditableTemplate = (
  scenarios: Scenario[] = [],
  currentValues: {
    precoSojaChicago: number;
    precoSojaFisico: number;
    dolarPtax: number;
  }
) => {
  const workbook = XLSX.utils.book_new();

  // ============================================================
  // ABA 1: PLANILHA DE CUSTOS
  // ============================================================
  const custosData: any[][] = [
    ['PLANILHA DE CUSTOS - SOJA', '', '', ''],
    ['Instruções: Células em branco podem ser editadas. Totais são calculados automaticamente.', '', '', ''],
    ['', '', '', ''],
    ['CUSTOS VARIÁVEIS', 'Valor (R$/ha)', 'Área (ha)', 'Total (R$)'],
    ['Operação de Máquinas', custosCultivo.operacaoMaquinas, estimativas.areaCultivo, { f: `B5*C5` }],
    ['Manutenção de Benfeitorias', custosCultivo.manutencaoBenfeitorias, estimativas.areaCultivo, { f: `B6*C6` }],
    ['Mão de Obra Temporária', custosCultivo.maoObraTemporaria, estimativas.areaCultivo, { f: `B7*C7` }],
    ['Sementes', custosCultivo.sementes, estimativas.areaCultivo, { f: `B8*C8` }],
    ['Fertilizantes', custosCultivo.fertilizantes, estimativas.areaCultivo, { f: `B9*C9` }],
    ['Defensivos', custosCultivo.defensivos, estimativas.areaCultivo, { f: `B10*C10` }],
    ['Despesas Gerais', custosCultivo.despesasGerais, estimativas.areaCultivo, { f: `B11*C11` }],
    ['Transporte Externo', custosCultivo.transporteExterno, estimativas.areaCultivo, { f: `B12*C12` }],
    ['Assistência Técnica', custosCultivo.assistenciaTecnica, estimativas.areaCultivo, { f: `B13*C13` }],
    ['Proagro/Seguro', custosCultivo.proagroSeguro, estimativas.areaCultivo, { f: `B14*C14` }],
    ['TOTAL CUSTOS VARIÁVEIS', '', '', { f: `SUM(D5:D14)` }],
    ['', '', '', ''],
    ['CUSTOS FIXOS', 'Valor (R$/ha)', 'Área (ha)', 'Total (R$)'],
    ['Depreciação Máquinas', custosCultivo.depreciacaoMaquinas, estimativas.areaCultivo, { f: `B18*C18` }],
    ['Depreciação Benfeitorias', custosCultivo.depreciacaoBenfeitorias, estimativas.areaCultivo, { f: `B19*C19` }],
    ['Sistematização do Solo', custosCultivo.sistematizacaoSolo, estimativas.areaCultivo, { f: `B20*C20` }],
    ['Seguro Capital', custosCultivo.seguroCapital, estimativas.areaCultivo, { f: `B21*C21` }],
    ['Mão de Obra Permanente', custosCultivo.maoObraPermanente, estimativas.areaCultivo, { f: `B22*C22` }],
    ['Remuneração Capital', custosCultivo.remuneracaoCapital, estimativas.areaCultivo, { f: `B23*C23` }],
    ['Remuneração Terra', custosCultivo.remuneracaoTerra, estimativas.areaCultivo, { f: `B24*C24` }],
    ['TOTAL CUSTOS FIXOS', '', '', { f: `SUM(D18:D24)` }],
    ['', '', '', ''],
    ['TOTAIS GERAIS', '', '', ''],
    ['Custo Operacional (Variáveis)', '', '', { f: `D15` }],
    ['Custo Total (Variáveis + Fixos)', '', '', { f: `D15+D25` }],
    ['', '', '', ''],
    ['Custo Operacional por Saca', '', '', { f: `D28/Estimativas!D9` }],
    ['Custo Total por Saca', '', '', { f: `D29/Estimativas!D9` }],
  ];

  const wsCustos = XLSX.utils.aoa_to_sheet(custosData);
  wsCustos['!cols'] = [{ wch: 35 }, { wch: 18 }, { wch: 15 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(workbook, wsCustos, 'Planilha de Custos');

  // ============================================================
  // ABA 2: PREÇO MERCADO FÍSICO
  // ============================================================
  const mercadoData: any[][] = [
    ['PREÇO MERCADO FÍSICO', '', ''],
    ['Valores atuais de referência do mercado brasileiro', '', ''],
    ['', '', ''],
    ['Tipo', 'Preço (R$/saca)', 'Data'],
    ['Preço FOB Itaí', precoMercadoFisico.precoFOBItai, new Date().toLocaleDateString('pt-BR')],
    ['Preço CIF Santos', precoMercadoFisico.precoCIFSantos, new Date().toLocaleDateString('pt-BR')],
    ['', '', ''],
    ['Observações:', '', ''],
    ['Estes preços podem ser editados para simular diferentes cenários de mercado', '', ''],
  ];

  const wsMercado = XLSX.utils.aoa_to_sheet(mercadoData);
  wsMercado['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, wsMercado, 'Preço Mercado Físico');

  // ============================================================
  // ABA 3: INFORMAÇÕES DE HEDGE
  // ============================================================
  const hedgeData: any[][] = [
    ['INFORMAÇÕES DE HEDGE', '', ''],
    ['Dados da operação de trava e valores atuais', '', ''],
    ['', '', ''],
    ['Parâmetro', 'Valor', 'Unidade'],
    ['Data da Trava', new Date(2025, 4, 5), 'dd/mm/yyyy'],
    ['NDF Dólar (trava)', informacoesHedge.ndfDolar, 'R$'],
    ['Dólar Ptax (atual)', currentValues.dolarPtax, 'R$'],
    ['NDF Soja (trava)', informacoesHedge.ndfSoja, 'US$'],
    ['Preço Soja Chicago (atual)', currentValues.precoSojaChicago, 'US$'],
    ['Quantidade de Bushel', informacoesHedge.quantidadeBushel, 'bu'],
    ['', '', ''],
    ['CÁLCULOS DERIVADOS', '', ''],
    ['Preço Real por Saca (trava)', { f: `B6*B8/2.204` }, 'R$/saca'],
    ['Quantidade de Dólares', { f: `B10*B8` }, 'US$'],
    ['Quantidade de Sacas', { f: `B10/2.204` }, 'sacas'],
  ];

  const wsHedge = XLSX.utils.aoa_to_sheet(hedgeData);
  wsHedge['!cols'] = [{ wch: 35 }, { wch: 18 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, wsHedge, 'Informações de Hedge');

  // ============================================================
  // ABA 4: ESTIMATIVAS
  // ============================================================
  const estimativasData: any[][] = [
    ['ESTIMATIVAS DE PRODUÇÃO', '', ''],
    ['Parâmetros de produção e custos logísticos', '', ''],
    ['', '', ''],
    ['Parâmetro', 'Valor', 'Unidade'],
    ['Sacas por Hectare', estimativas.sacasPorHectare, 'sc/ha'],
    ['Área de Cultivo', estimativas.areaCultivo, 'hectares'],
    ['', '', ''],
    ['CÁLCULOS', '', ''],
    ['Quantidade Total de Sacas', { f: `B5*B6` }, 'sacas'],
    ['', '', ''],
    ['CUSTOS LOGÍSTICOS', '', ''],
    ['Frete Itaí-Santos (total)', estimativas.freteItaiSantos, 'R$'],
    ['Custo Frete por Saca', { f: `B12/B9` }, 'R$/saca'],
  ];

  const wsEstimativas = XLSX.utils.aoa_to_sheet(estimativasData);
  wsEstimativas['!cols'] = [{ wch: 35 }, { wch: 18 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, wsEstimativas, 'Estimativas');

  // ============================================================
  // ABA 5: DASHBOARD - KPIs
  // ============================================================
  const dashboardData: any[][] = [
    ['DASHBOARD DE HEDGE - ANÁLISE DE KPIs', '', '', ''],
    ['Esta aba calcula automaticamente todos os indicadores com base nos valores das outras abas', '', '', ''],
    ['', '', '', ''],
    ['PARÂMETROS DE SIMULAÇÃO', '', '', ''],
    ['Parâmetro', 'Valor', 'Origem', 'Observação'],
    ['Preço Soja Chicago (vencimento)', currentValues.precoSojaChicago, 'Editável', 'Valor atual ou projetado'],
    ['Preço Soja Físico CIF/Santos', currentValues.precoSojaFisico, 'Editável', 'Valor atual ou projetado'],
    ['Dólar Ptax (vencimento)', currentValues.dolarPtax, 'Editável', 'Valor atual ou projetado'],
    ['NDF Soja (trava)', { f: `'Informações de Hedge'!B8` }, 'Fixo', 'Valor travado'],
    ['NDF Dólar (trava)', { f: `'Informações de Hedge'!B6` }, 'Fixo', 'Valor travado'],
    ['Quantidade de Bushel', { f: `'Informações de Hedge'!B10` }, 'Fixo', 'Volume da operação'],
    ['', '', '', ''],
    ['CÁLCULOS INTERMEDIÁRIOS', '', '', ''],
    ['Descrição', 'Fórmula/Valor', '', ''],
    ['Conversão Bushel para Sacas', { f: `B11/2.204` }, '', 'sacas'],
    ['Valor Venda Soja Física', { f: `B7*B15` }, '', 'R$'],
    ['Ajuste NDF Soja', { f: `(B9-B6)*B11` }, '', 'US$'],
    ['Ajuste NDF Soja em Reais', { f: `B17*B8` }, '', 'R$'],
    ['Quantidade de Dólares', { f: `B11*B9` }, '', 'US$'],
    ['Ajuste NDF Dólar', { f: `(B10-B8)*B19` }, '', 'R$'],
    ['Custo Operacional Total', { f: `'Planilha de Custos'!D28` }, '', 'R$'],
    ['Custo Total', { f: `'Planilha de Custos'!D29` }, '', 'R$'],
    ['', '', '', ''],
    ['KPIS PRINCIPAIS', '', '', ''],
    ['Indicador', 'Valor', 'Fórmula', 'Interpretação'],
    ['Faturamento Total', { f: `B16+B18+B20+(B7*(Estimativas!D9-B15))` }, 'Protegida + Exposta', 'Receita final esperada'],
    ['Lucro Total', { f: `B25-B21` }, 'Faturamento - Custo Op.', 'Resultado líquido operacional'],
    ['Valor por Saca', { f: `B25/Estimativas!D9` }, 'Faturamento / Qtd Sacas', 'Preço médio realizado'],
    ['Diferença sobre Trava', { f: `B27-'Informações de Hedge'!B13` }, 'Valor Saca - Preço Trava', 'Ganho/Perda vs trava'],
    ['Margem de Lucro (%)', { f: `(B26/B25)*100` }, '(Lucro / Faturamento) x 100', 'Rentabilidade sobre venda'],
    ['ROI (%)', { f: `(B26/B21)*100` }, '(Lucro / Custo) x 100', 'Retorno sobre investimento'],
    ['', '', '', ''],
    ['RESUMO VISUAL', '', '', ''],
    ['KPI', 'Status', '', ''],
    ['Faturamento', { f: `TEXT(B25,"R$ #,##0.00")` }, '', ''],
    ['Lucro', { f: `TEXT(B26,"R$ #,##0.00")` }, '', ''],
    ['Margem', { f: `TEXT(B29,"0.00") & "%"` }, '', ''],
    ['ROI', { f: `TEXT(B30,"0.00") & "%"` }, '', ''],
  ];

  const wsDashboard = XLSX.utils.aoa_to_sheet(dashboardData);
  wsDashboard['!cols'] = [{ wch: 35 }, { wch: 20 }, { wch: 25 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(workbook, wsDashboard, 'Dashboard - KPIs');

  // ============================================================
  // ABA 6: CENÁRIOS SALVOS
  // ============================================================
  if (scenarios.length > 0) {
    const cenariosData: any[][] = [
      ['CENÁRIOS SALVOS', '', '', '', '', '', '', '', '', ''],
      ['Comparação entre diferentes simulações de mercado', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      [
        'Nome',
        'Tipo',
        'Chicago',
        'Físico',
        'Dólar',
        'Faturamento',
        'Lucro',
        'Valor/Saca',
        'Margem %',
        'ROI %',
      ],
    ];

    scenarios.forEach((scenario, index) => {
      const rowNum = index + 5;
      cenariosData.push([
        scenario.nome,
        scenario.tipo,
        scenario.precoSojaChicago,
        scenario.precoSojaFisico,
        scenario.dolarPtax,
        {
          f: `(D${rowNum}*'Informações de Hedge'!B15) + ((('Informações de Hedge'!B8-C${rowNum})*'Informações de Hedge'!B10)*E${rowNum}) + (('Informações de Hedge'!B6-E${rowNum})*'Informações de Hedge'!B14) + (D${rowNum}*(Estimativas!D9-'Informações de Hedge'!B15))`,
        },
        { f: `F${rowNum}-'Planilha de Custos'!D28` },
        { f: `F${rowNum}/Estimativas!D9` },
        { f: `(G${rowNum}/F${rowNum})*100` },
        { f: `(G${rowNum}/'Planilha de Custos'!D28)*100` },
      ]);
    });

    cenariosData.push(['', '', '', '', '', '', '', '', '', '']);
    cenariosData.push(['ANÁLISE COMPARATIVA', '', '', '', '', '', '', '', '', '']);
    cenariosData.push([
      'Melhor Cenário (Faturamento)',
      { f: `INDEX(A5:A${4 + scenarios.length},MATCH(MAX(F5:F${4 + scenarios.length}),F5:F${4 + scenarios.length},0))` },
      '',
      '',
      '',
      { f: `MAX(F5:F${4 + scenarios.length})` },
      '',
      '',
      '',
      '',
    ]);
    cenariosData.push([
      'Melhor Cenário (Lucro)',
      { f: `INDEX(A5:A${4 + scenarios.length},MATCH(MAX(G5:G${4 + scenarios.length}),G5:G${4 + scenarios.length},0))` },
      '',
      '',
      '',
      '',
      { f: `MAX(G5:G${4 + scenarios.length})` },
      '',
      '',
      '',
    ]);
    cenariosData.push([
      'Melhor Cenário (ROI)',
      { f: `INDEX(A5:A${4 + scenarios.length},MATCH(MAX(J5:J${4 + scenarios.length}),J5:J${4 + scenarios.length},0))` },
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      { f: `MAX(J5:J${4 + scenarios.length})` },
    ]);

    const wsCenarios = XLSX.utils.aoa_to_sheet(cenariosData);
    wsCenarios['!cols'] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 18 },
      { wch: 18 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
    ];
    XLSX.utils.book_append_sheet(workbook, wsCenarios, 'Cenários Salvos');
  }

  // Gerar e baixar o arquivo
  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
  const fileName = `Hedge_Dashboard_Template_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, fileName);
};
