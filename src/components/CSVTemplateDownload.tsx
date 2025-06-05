
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface CSVTemplateDownloadProps {
  type: 'prompts' | 'ideas' | 'products';
}

const CSVTemplateDownload: React.FC<CSVTemplateDownloadProps> = ({ type }) => {
  const generateCSVTemplate = () => {
    let headers: string[] = [];
    let sampleData: string[] = [];

    switch (type) {
      case 'prompts':
        headers = ['judul_konten', 'deskripsi_konten', 'required_permission_key', 'is_published'];
        sampleData = ['Contoh Prompt AI', 'Deskripsi prompt yang detail...', 'premium_access', 'true'];
        break;
      case 'ideas':
        headers = ['judul_konten', 'deskripsi_konten', 'required_permission_key', 'is_published'];
        sampleData = ['Ide Aplikasi Mobile', 'Konsep aplikasi inovatif untuk...', 'premium_access', 'true'];
        break;
      case 'products':
        headers = ['nama_produk', 'link_produk', 'required_permission_key', 'is_published'];
        sampleData = ['Template Design', 'https://example.com/product', 'premium_access', 'true'];
        break;
    }

    const csvContent = [
      headers.join(','),
      sampleData.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `template_${type}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'prompts':
        return 'Prompt';
      case 'ideas':
        return 'Ide Produk';
      case 'products':
        return 'Produk Digital';
      default:
        return '';
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={generateCSVTemplate}
      className="flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Download Template {getTypeLabel()}
    </Button>
  );
};

export default CSVTemplateDownload;
