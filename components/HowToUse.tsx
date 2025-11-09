
import React, { useState } from 'react';

const HowToUse: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8 border border-blue-100 rounded-lg bg-blue-50/50 transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left font-semibold text-primary-dark focus:outline-none"
        aria-expanded={isOpen}
        aria-controls="how-to-use-content"
      >
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Como Usar este Gerador SPED
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 transform transition-transform text-primary ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div id="how-to-use-content" className="px-6 pb-6 pt-2 border-t border-blue-200 text-gray-700">
          <p className="mb-4 text-sm">Siga estes 4 passos simples para gerar seu arquivo SPED:</p>
          <ol className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm mr-3">1</div>
              <div>
                <h4 className="font-semibold text-gray-800">Preencha as Configurações</h4>
                <p className="text-sm">Informe o CNPJ da sua empresa, o período de referência (mês/ano), o tipo de SPED e o perfil da escrituração.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm mr-3">2</div>
              <div>
                <h4 className="font-semibold text-gray-800">Carregue os Arquivos XML</h4>
                <p className="text-sm">Clique na área de upload ou arraste e solte os arquivos XML de NF-e/CT-e. Você pode selecionar múltiplos arquivos de uma vez.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm mr-3">3</div>
              <div>
                <h4 className="font-semibold text-gray-800">Gere o Arquivo SPED</h4>
                <p className="text-sm">Clique no botão "Gerar Arquivo SPED". A ferramenta irá ler os XMLs, realizar os ajustes fiscais (ex: conversão de CFOP de saída para entrada) e montar o arquivo.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm mr-3">4</div>
              <div>
                <h4 className="font-semibold text-gray-800">Baixe e Confira</h4>
                <p className="text-sm">Após o processamento, baixe o arquivo .txt gerado e utilize o Relatório de Conferência para verificar as alterações aplicadas.</p>
              </div>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default HowToUse;
