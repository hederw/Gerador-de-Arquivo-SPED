
import { SpedConfig, ProcessedNFe, NFeItem } from '../types';

// Helper to get text content from an XML element
const getText = (node: Element, selector: string): string => {
  return node.querySelector(selector)?.textContent ?? '';
};

const getFloat = (node: Element, selector: string): number => {
  return parseFloat(getText(node, selector)) || 0;
};

// --- 1. XML Parsing ---
const parseNFeXML = (xmlString: string, config: SpedConfig): ProcessedNFe => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  
  if (xmlDoc.getElementsByTagName('parsererror').length) {
    throw new Error('Falha ao parsear o arquivo XML.');
  }

  const infNFe = xmlDoc.querySelector('infNFe');
  if (!infNFe) throw new Error('Estrutura de XML inválida: tag <infNFe> não encontrada.');

  const items: NFeItem[] = Array.from(infNFe.querySelectorAll('det')).map((det, index) => {
    const prod = det.querySelector('prod');
    const icms = det.querySelector('ICMS > *'); // Grabs the first child of ICMS (ICMS00, ICMS10, etc.)
    const pis = det.querySelector('PIS > *');
    const cofins = det.querySelector('COFINS > *');

    if (!prod || !icms) {
      throw new Error(`Item ${index + 1} com dados incompletos no XML.`);
    }

    return {
      id: `${getText(infNFe.querySelector('ide > nNF') ?? new Element(), 'nNF')}-${getText(prod, 'cProd')}`,
      code: getText(prod, 'cProd'),
      description: getText(prod, 'xProd'),
      ncm: getText(prod, 'NCM'),
      cfop: getText(prod, 'CFOP'),
      cstIcms: getText(icms, 'CST'),
      cstPis: getText(pis ?? new Element(), 'CST'),
      cstCofins: getText(cofins ?? new Element(), 'CST'),
      unit: getText(prod, 'uCom'),
      quantity: getFloat(prod, 'qCom'),
      unitValue: getFloat(prod, 'vUnCom'),
      totalValue: getFloat(prod, 'vProd'),
      bcIcms: getFloat(icms, 'vBC'),
      icmsValue: getFloat(icms, 'vICMS'),
      aliqIcms: getFloat(icms, 'pICMS'),
      // Adjusted fields will be populated later
      adjustedCfop: '',
      adjustedCstIcms: '',
    };
  });
  
  return {
    key: infNFe.getAttribute('Id')?.replace('NFe', '') ?? '',
    number: getText(infNFe, 'ide > nNF'),
    date: getText(infNFe, 'ide > dhEmi'),
    totalValue: getFloat(infNFe, 'total > ICMSTot > vNF'),
    emitterCnpj: getText(infNFe, 'emit > CNPJ'),
    recipientCnpj: getText(infNFe, 'dest > CNPJ'),
    items,
  };
};

// --- 2. Fiscal Adjustments ---
const applyFiscalAdjustments = (nfe: ProcessedNFe): ProcessedNFe => {
  nfe.items.forEach(item => {
    // Rule: Map supplier's exit CFOP (5xxx) to buyer's entry CFOP (1xxx)
    if (item.cfop.startsWith('5')) {
      item.adjustedCfop = '1' + item.cfop.substring(1);
    } else if (item.cfop.startsWith('6')) {
      item.adjustedCfop = '2' + item.cfop.substring(1);
    } else {
      item.adjustedCfop = item.cfop; // Keep original if not a standard exit
    }

    // Rule: Adjust CST for credit utilization (example rule)
    // If CST is 00 (Taxed integrally), it becomes 50 (Suspension) on entry for some regimes. This is a simplification.
    if (item.cstIcms === '00' || item.cstIcms === '20') {
      item.adjustedCstIcms = '50';
    } else {
      item.adjustedCstIcms = item.cstIcms;
    }
  });
  return nfe;
};

// --- 3. SPED File Generation ---
const generateSpedString = (processedData: ProcessedNFe[], config: SpedConfig): string => {
  let sped = '';
  const pipe = '|';

  const formatDate = (isoDate: string) => isoDate.substring(8, 10) + isoDate.substring(5, 7) + isoDate.substring(0, 4);
  const formatValue = (value: number) => value.toFixed(2).replace('.', ',');
  
  // Bloco 0
  const [year, month] = config.period.split('-');
  const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
  sped += `|0000|017|0|${month}${year}|01${month}${year}|${lastDay}${month}${year}|${config.cnpj.replace(/\D/g,'')}|RAZAO SOCIAL EXEMPLO|UF|IE|COD_MUN|IM|${config.profile}|1|\n`;
  sped += `|0001|0|\n`;
  sped += `|0150||||${config.cnpj.replace(/\D/g,'')}|IE|COD_MUN||ENDERECO|NUM|COMPLEMENTO|BAIRRO|\n`;
  
  const allItems = new Map<string, NFeItem>();
  processedData.forEach(nfe => nfe.items.forEach(item => allItems.set(item.code, item)));

  allItems.forEach(item => {
      sped += `|0200|${item.code}|${item.description}|${item.code}|${item.ncm}|||${item.unit}|1|\n`;
  });
  
  sped += `|0990|${sped.split('\n').length}|\n`;

  // Bloco C
  let c100count = 0;
  processedData.forEach(nfe => {
    // Only process entry notes for the configured CNPJ
    if(nfe.recipientCnpj !== config.cnpj.replace(/\D/g,'')) return;

    c100count++;
    sped += `|C100|0|1|${nfe.emitterCnpj}|55|00|1|${nfe.number}|${nfe.key}|${formatDate(nfe.date)}|${formatDate(nfe.date)}|${formatValue(nfe.totalValue)}|0|0,00|0,00|0,00|${formatValue(nfe.totalValue)}|9|0,00|0,00|0,00|0,00|0,00|0,00|0,00|\n`;
    
    nfe.items.forEach(item => {
      sped += `|C170|${c100count}|${item.code}|${item.description}|${formatValue(item.quantity)}|${item.unit}|${formatValue(item.totalValue)}|0,00|0|${item.adjustedCstIcms}|${item.adjustedCfop}|5.00||${formatValue(item.bcIcms)}|${formatValue(item.aliqIcms)}|${formatValue(item.icmsValue)}|0,00|0,00|0|${item.cstPis}|0,00|0,00|0,00|0,00|0|${item.cstCofins}|0,00|0,00|0,00|0,00||\n`;
    });
  });

  sped += `|C990|${sped.split('\n').filter(l => l.startsWith('|C')).length}|\n`;
  // Add other blocks (E, H, etc.) and closing blocks as needed
  sped += `|E990|${sped.split('\n').filter(l => l.startsWith('|E')).length + 1}|\n`;
  sped += `|9001|0|\n`;
  sped += `|9900|0000|1|\n`;
  sped += `|9900|0001|1|\n`;
  // ... continue for all record types
  sped += `|9990|${sped.split('\n').filter(l => l.startsWith('|9')).length}|\n`;
  sped += `|9999|${sped.split('\n').length}|\n`;


  return sped;
};


// --- Main Orchestration Function ---
export const processAndGenerateSped = async (
  files: File[], 
  config: SpedConfig
): Promise<{ processedNFe: ProcessedNFe[], spedFile: string }> => {
  const fileReadPromises = files.map(file => file.text());
  const xmlContents = await Promise.all(fileReadPromises);

  const parsedNFe = xmlContents.map(xml => parseNFeXML(xml, config));
  const processedNFe = parsedNFe.map(applyFiscalAdjustments);

  const spedFile = generateSpedString(processedNFe, config);

  return { processedNFe, spedFile };
};
