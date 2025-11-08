
import React from 'react';
import { ProcessedNFe } from '../types';

interface ResultsDisplayProps {
  processedData: ProcessedNFe[];
  spedFileContent: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ processedData, spedFileContent }) => {

  const handleDownload = () => {
    const blob = new Blob([spedFileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date();
    const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    link.download = `SPED_${formattedDate}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-primary-dark mb-6">3. Resultados e Conferência</h2>
      
      {spedFileContent && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md mb-6">
            <div className="flex items-center">
                <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-800 font-semibold">Arquivo SPED gerado com sucesso!</p>
            </div>
            <button
                onClick={handleDownload}
                className="mt-4 bg-secondary hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200 inline-flex items-center"
            >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Baixar Arquivo SPED (.txt)
            </button>
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-800 mb-4">Relatório de Conferência</h3>
      <p className="text-sm text-gray-600 mb-4">
        Visualize os dados originais do XML lado a lado com os dados ajustados que foram para o SPED.
      </p>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CFOP Original</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CFOP Ajustado</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CST ICMS Original</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CST ICMS Ajustado</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {processedData.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Nenhum dado para exibir. Processe os arquivos primeiro.</td>
                </tr>
            ) : (
                processedData.map(nfe => (
                    <React.Fragment key={nfe.key}>
                        <tr className="bg-blue-50">
                            <td colSpan={6} className="px-6 py-2 font-bold text-primary-dark">
                                NF-e: {nfe.number} (Chave: {nfe.key})
                            </td>
                        </tr>
                        {nfe.items.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cfop}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{item.adjustedCfop}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cstIcms}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{item.adjustedCstIcms}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            </tr>
                        ))}
                    </React.Fragment>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsDisplay;
