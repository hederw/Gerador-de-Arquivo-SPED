import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { DocumentIcon } from './icons/DocumentIcon';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelect }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(newFiles);
      onFilesSelect(newFiles);
    }
  };
  
  const handleDragEvent = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isEntering);
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // FIX: Explicitly type `file` as `File` to fix type inference issue.
      const newFiles = Array.from(e.dataTransfer.files).filter((file: File) => file.type === 'text/xml' || file.name.endsWith('.xml'));
      setSelectedFiles(newFiles);
      onFilesSelect(newFiles);
      // Clean up the data transfer object
      e.dataTransfer.clearData();
    }
  }, [onFilesSelect]);

  return (
    <div>
      <div 
        onDragEnter={(e) => handleDragEvent(e, true)}
        onDragLeave={(e) => handleDragEvent(e, false)}
        onDragOver={(e) => handleDragEvent(e, true)}
        onDrop={handleDrop}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-primary' : 'border-gray-300'} border-dashed rounded-md transition-colors duration-200`}
      >
        <div className="space-y-1 text-center">
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400"/>
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
            >
              <span>Carregue os arquivos</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept=".xml,text/xml" onChange={handleFileChange} />
            </label>
            <p className="pl-1">ou arraste e solte aqui</p>
          </div>
          <p className="text-xs text-gray-500">Apenas arquivos .XML</p>
        </div>
      </div>
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-700">Arquivos Selecionados:</h4>
          <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div className="w-0 flex-1 flex items-center">
                  <DocumentIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                  <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;