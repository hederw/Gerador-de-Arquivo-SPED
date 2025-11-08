
import React, { useState, useCallback } from 'react';
import { SpedConfig, SpedType, SpedProfile, ProcessedNFe } from './types';
import { processAndGenerateSped } from './services/spedService';
import Header from './components/Header';
import ConfigForm from './components/ConfigForm';
import FileUpload from './components/FileUpload';
import ResultsDisplay from './components/ResultsDisplay';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [config, setConfig] = useState<SpedConfig>({
    cnpj: '',
    period: '',
    profile: SpedProfile.A,
    spedType: SpedType.ICMS_IPI,
  });
  const [xmlFiles, setXmlFiles] = useState<File[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedNFe[]>([]);
  const [spedFileContent, setSpedFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessFiles = useCallback(async () => {
    if (xmlFiles.length === 0) {
      setError('Por favor, selecione ao menos um arquivo XML.');
      return;
    }
    if (!config.cnpj || !config.period) {
      setError('Por favor, preencha o CNPJ e o Período de Referência.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProcessedData([]);
    setSpedFileContent('');

    try {
      const result = await processAndGenerateSped(xmlFiles, config);
      setProcessedData(result.processedNFe);
      setSpedFileContent(result.spedFile);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  }, [xmlFiles, config]);

  return (
    <div className="min-h-screen bg-gray-50 text-onSurface">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-surface shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-primary-dark mb-6">1. Configurações da Escrituração</h2>
            <ConfigForm config={config} setConfig={setConfig} />

            <h2 className="text-2xl font-bold text-primary-dark mt-8 mb-6">2. Upload dos Arquivos XML</h2>
            <FileUpload onFilesSelect={setXmlFiles} />

            <div className="mt-8 border-t pt-6 text-center">
              <button
                onClick={handleProcessFiles}
                disabled={isLoading}
                className="w-full md:w-auto bg-primary-dark hover:bg-primary text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Processando...
                  </>
                ) : (
                  'Gerar Arquivo SPED'
                )}
              </button>
            </div>
            
            {error && (
              <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
                <p className="font-bold">Erro!</p>
                <p>{error}</p>
              </div>
            )}
          </div>
          
          {(processedData.length > 0 || spedFileContent) && (
             <div className="bg-gray-50 p-6 md:p-8">
               <ResultsDisplay processedData={processedData} spedFileContent={spedFileContent} />
             </div>
          )}
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Desenvolvido por um Engenheiro de IA de classe mundial.</p>
      </footer>
    </div>
  );
};

export default App;
