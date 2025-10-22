import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { FileText, Eye, X } from 'lucide-react';

interface AulaDocumentViewerProps {
  htmlContent: string;
  aulaNome: string;
  trigger?: React.ReactNode;
}

export default function AulaDocumentViewer({ 
  htmlContent, 
  aulaNome, 
  trigger 
}: AulaDocumentViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!htmlContent) return null;

  const defaultTrigger = (
    <Button
      size="sm"
      variant="outline"
      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
    >
      <FileText className="w-4 h-4 mr-2" />
      Ver Documento
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl text-gray-900">
                  Documento da Aula
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">{aulaNome}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-6 bg-white">
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              lineHeight: '1.6',
              color: '#374151'
            }}
          />
        </div>
        
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Material de apoio para a aula
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  if (printWindow) {
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>Documento da Aula - ${aulaNome}</title>
                          <style>
                            body { 
                              font-family: system-ui, -apple-system, sans-serif; 
                              line-height: 1.6; 
                              color: #374151; 
                              max-width: 800px; 
                              margin: 0 auto; 
                              padding: 20px; 
                            }
                            h1, h2, h3, h4, h5, h6 { color: #1f2937; margin-top: 1.5em; margin-bottom: 0.5em; }
                            p { margin-bottom: 1em; }
                            ul, ol { margin-bottom: 1em; padding-left: 1.5em; }
                            img { max-width: 100%; height: auto; }
                            table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
                            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
                            th { background-color: #f9fafb; }
                            code { background-color: #f3f4f6; padding: 2px 4px; border-radius: 3px; font-size: 0.875em; }
                            pre { background-color: #f3f4f6; padding: 1em; border-radius: 6px; overflow-x: auto; }
                            blockquote { border-left: 4px solid #d1d5db; margin: 1em 0; padding-left: 1em; color: #6b7280; }
                          </style>
                        </head>
                        <body>
                          <h1>Documento da Aula: ${aulaNome}</h1>
                          ${htmlContent}
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                    printWindow.print();
                  }
                }}
              >
                <Eye className="w-3 h-3 mr-1" />
                Imprimir
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}