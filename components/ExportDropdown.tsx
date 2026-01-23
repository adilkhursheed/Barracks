
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, FileSpreadsheet, FileText, Download } from 'lucide-react';

interface ExportDropdownProps {
  onExportXLSX: () => void;
  onExportPDF: () => void;
  label?: string;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ onExportXLSX, onExportPDF, label = "Export" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all shadow-sm active:scale-95"
      >
        <Download size={18} className="text-blue-600" />
        <span>{label}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-slate-100 ring-1 ring-black ring-opacity-5 z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="py-1">
            <button
              onClick={() => {
                onExportXLSX();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors gap-3"
            >
              <div className="p-1.5 bg-emerald-50 rounded-lg">
                <FileSpreadsheet size={16} className="text-emerald-600" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold">Excel Spreadsheet</span>
                <span className="text-[10px] text-slate-400">.xlsx format</span>
              </div>
            </button>
            <button
              onClick={() => {
                onExportPDF();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors gap-3"
            >
              <div className="p-1.5 bg-red-50 rounded-lg">
                <FileText size={16} className="text-red-600" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold">PDF Document</span>
                <span className="text-[10px] text-slate-400">Print ready</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
