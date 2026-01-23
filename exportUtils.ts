
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToXLSX = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const downloadTemplate = (type: 'employees' | 'assets' | 'projects') => {
  let headers: string[] = [];
  let sampleData: any[] = [];

  switch (type) {
    case 'employees':
      headers = ["firstName", "lastName", "designation", "department", "lumovyEmail", "microsoftEmail", "contactNumber", "skillsets", "reportingManager", "technicalLead", "projectLead"];
      sampleData = [{
        firstName: "Jane",
        lastName: "Smith",
        designation: "Software Engineer",
        department: "Engineering",
        lumovyEmail: "jane.smith@lumovy.com",
        microsoftEmail: "j.smith@microsoft.com",
        contactNumber: "+1 555-0199",
        skillsets: "React, TypeScript, Node.js",
        reportingManager: "John Miller",
        technicalLead: "Dave Brown",
        projectLead: "Michael Kyle"
      }];
      break;
    case 'assets':
      headers = ["type", "make", "model", "serialNumber"];
      sampleData = [{
        type: "Laptop",
        make: "Apple",
        model: "MacBook Pro M3 Max",
        serialNumber: "SN-LUM-9944"
      }];
      break;
    case 'projects':
      headers = ["name", "clientName", "description", "startDate", "endDate", "projectLead", "technicalLead"];
      sampleData = [{
        name: "Enterprise ERP Refactor",
        clientName: "Global Logistics Inc",
        description: "Modernizing core legacy systems to cloud-native architecture.",
        startDate: "2024-06-01",
        endDate: "2025-06-01",
        projectLead: "Sarah Connor",
        technicalLead: "Dave Brown"
      }];
      break;
  }

  // Create worksheet with headers and one row of sample data
  const ws = XLSX.utils.json_to_sheet(sampleData, { header: headers });
  
  // Set column widths for better readability in Excel
  const wscols = headers.map(() => ({ wch: 20 }));
  ws['!cols'] = wscols;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Import Template");
  XLSX.writeFile(wb, `barracks_${type}_onboarding_template.xlsx`);
};

export const exportToPDF = (headers: string[], data: any[][], title: string, fileName: string) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Exported on ${new Date().toLocaleString()}`, 14, 30);
  
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [79, 70, 229] }, // indigo-600
  });
  
  doc.save(`${fileName}.pdf`);
};
