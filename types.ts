
export enum SpedType {
  ICMS_IPI = 'EFD ICMS/IPI',
  CONTRIBUICOES = 'EFD Contribuições',
}

export enum SpedProfile {
  A = 'A',
  B = 'B',
  C = 'C',
}

export interface SpedConfig {
  cnpj: string;
  period: string; // YYYY-MM
  profile: SpedProfile;
  spedType: SpedType;
}

export interface NFeItem {
  id: string;
  code: string;
  description: string;
  ncm: string;
  cfop: string;
  cstIcms: string;
  cstPis: string;
  cstCofins: string;
  unit: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  bcIcms: number;
  icmsValue: number;
  aliqIcms: number;
  adjustedCfop: string;
  adjustedCstIcms: string;
}

export interface ProcessedNFe {
  key: string;
  number: string;
  date: string;
  totalValue: number;
  emitterCnpj: string;
  recipientCnpj: string;
  items: NFeItem[];
}
