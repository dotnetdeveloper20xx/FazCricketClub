import { Injectable } from '@angular/core';

export interface ExportColumn {
  key: string;
  header: string;
  formatter?: (value: any) => string;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  /**
   * Export data to CSV file
   */
  exportToCsv<T>(
    data: T[],
    columns: ExportColumn[],
    filename: string = 'export'
  ): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Create header row
    const headers = columns.map(col => this.escapeCsvValue(col.header));

    // Create data rows
    const rows = data.map(item => {
      return columns.map(col => {
        const value = this.getNestedValue(item, col.key);
        const formattedValue = col.formatter ? col.formatter(value) : value;
        return this.escapeCsvValue(formattedValue);
      });
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Add BOM for Excel compatibility with UTF-8
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });

    this.downloadBlob(blob, `${filename}.csv`);
  }

  /**
   * Export data to JSON file
   */
  exportToJson<T>(data: T[], filename: string = 'export'): void {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    this.downloadBlob(blob, `${filename}.json`);
  }

  /**
   * Print a specific element or the current page
   */
  print(elementId?: string): void {
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Print</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  table { width: 100%; border-collapse: collapse; }
                  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                  th { background-color: #f5f5f5; }
                  @media print {
                    body { -webkit-print-color-adjust: exact; }
                  }
                </style>
              </head>
              <body>
                ${element.innerHTML}
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 250);
        }
      }
    } else {
      window.print();
    }
  }

  /**
   * Generate printable HTML table from data
   */
  generatePrintableTable<T>(
    data: T[],
    columns: ExportColumn[],
    title: string = 'Report'
  ): string {
    const headers = columns.map(col => `<th>${col.header}</th>`).join('');
    const rows = data.map(item => {
      const cells = columns.map(col => {
        const value = this.getNestedValue(item, col.key);
        const formattedValue = col.formatter ? col.formatter(value) : value ?? '';
        return `<td>${formattedValue}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    return `
      <h1>${title}</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      <table>
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  /**
   * Open print preview with generated table
   */
  printTable<T>(
    data: T[],
    columns: ExportColumn[],
    title: string = 'Report'
  ): void {
    const tableHtml = this.generatePrintableTable(data, columns, title);
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                max-width: 1200px;
                margin: 0 auto;
              }
              h1 {
                color: #2eb82e;
                margin-bottom: 8px;
              }
              p {
                color: #666;
                margin-bottom: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 16px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 12px 16px;
                text-align: left;
              }
              th {
                background-color: #2eb82e;
                color: white;
                font-weight: 600;
              }
              tr:nth-child(even) {
                background-color: #f8f8f8;
              }
              tr:hover {
                background-color: #f0f0f0;
              }
              @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                th { background-color: #2eb82e !important; color: white !important; }
              }
            </style>
          </head>
          <body>
            ${tableHtml}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  }

  /**
   * Escape CSV special characters
   */
  private escapeCsvValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue = String(value);

    // If value contains comma, newline, or quotes, wrap in quotes and escape internal quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  }

  /**
   * Get nested object value using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  /**
   * Trigger file download
   */
  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
