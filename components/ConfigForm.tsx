import React from 'react';
import { SpedConfig, SpedType, SpedProfile } from '../types';

interface ConfigFormProps {
  config: SpedConfig;
  setConfig: React.Dispatch<React.SetStateAction<SpedConfig>>;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ config, setConfig }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
    setConfig(prev => ({...prev, cnpj: value}));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
          CNPJ do Contribuinte
        </label>
        <input
          type="text"
          name="cnpj"
          id="cnpj"
          value={config.cnpj}
          onChange={handleCnpjChange}
          placeholder="00.000.000/0000-00"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
          Período de Referência (Mês/Ano)
        </label>
        <input
          type="month"
          name="period"
          id="period"
          value={config.period}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="spedType" className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de SPED
        </label>
        <select
          name="spedType"
          id="spedType"
          value={config.spedType}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          {Object.values(SpedType).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="profile" className="block text-sm font-medium text-gray-700 mb-1">
          Perfil
        </label>
        <select
          name="profile"
          id="profile"
          value={config.profile}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          {Object.values(SpedProfile).map(prof => (
            <option key={prof} value={prof}>{prof}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ConfigForm;