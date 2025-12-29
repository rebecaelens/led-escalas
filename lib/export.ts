import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportToPDF(elementId: string, fileName: string = 'escala.pdf') {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      alert('❌ Elemento não encontrado para exportar');
      return;
    }

    // Criar um clone do elemento
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Criar estilos CSS para o clone mantendo visual bonito
    const styles = document.createElement('style');
    styles.innerHTML = `
      .pdf-export {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: white;
        padding: 40px;
        color: #333;
      }
      .pdf-export h1, .pdf-export h2, .pdf-export h3 {
        color: #1f2937;
      }
      .pdf-export .grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 8px;
        margin: 20px 0;
      }
      .pdf-export .day-header {
        font-weight: bold;
        text-align: center;
        padding: 12px;
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 6px;
      }
      .pdf-export .day {
        border: 2px solid #e5e7eb;
        border-radius: 6px;
        padding: 12px;
        min-height: 100px;
        background: #fafafa;
        display: flex;
        flex-direction: column;
      }
      .pdf-export .day-number {
        font-weight: bold;
        font-size: 14px;
        color: #1f2937;
        margin-bottom: 8px;
      }
      .pdf-export .day-name {
        background: linear-gradient(135deg, #06b6d4 0%, #a855f7 100%);
        color: white;
        padding: 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        word-break: break-word;
      }
      .pdf-export .day-empty {
        color: #9ca3af;
        font-size: 12px;
      }
      .pdf-export table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 30px;
      }
      .pdf-export th {
        background: #1f2937;
        color: white;
        padding: 12px;
        text-align: left;
        font-weight: bold;
        border: 1px solid #111827;
      }
      .pdf-export td {
        padding: 12px;
        border: 1px solid #e5e7eb;
        background: white;
      }
      .pdf-export tr:nth-child(even) td {
        background: #f9fafb;
      }
      .pdf-export .header-section {
        margin-bottom: 30px;
        border-bottom: 3px solid #1f2937;
        padding-bottom: 20px;
      }
      .pdf-export .title {
        font-size: 28px;
        font-weight: bold;
        color: #1f2937;
        margin-bottom: 10px;
      }
      .pdf-export .subtitle {
        font-size: 14px;
        color: #6b7280;
      }
    `;
    
    clone.classList.add('pdf-export');
    
    // Limpar classes do clone para evitar conflitos
    clone.querySelectorAll('[class]').forEach(el => {
      const classList = Array.from((el as HTMLElement).classList);
      // Manter apenas classes necessárias ou remover tudo
      (el as HTMLElement).className = '';
    });

    // Adicionar ao DOM temporariamente
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '900px';
    container.style.background = 'white';
    container.appendChild(styles);
    container.appendChild(clone);
    document.body.appendChild(container);

    // Aguardar um pouco para renderização
    await new Promise(resolve => setTimeout(resolve, 100));

    // Renderizar com html2canvas
    const canvas = await html2canvas(container, { 
      scale: 2,
      logging: false,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      width: 900,
      windowHeight: 3000
    });

    // Remover elemento temporário
    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/png');
    
    // Criar PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Adicionar imagem ao PDF
    let position = margin;
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    
    // Adicionar páginas adicionais se necessário
    let remainingHeight = imgHeight;
    while (remainingHeight > pageHeight) {
      pdf.addPage();
      position = (pageHeight - margin) - remainingHeight;
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      remainingHeight -= (pageHeight - (margin * 2));
    }
    
    pdf.save(fileName);
    alert('✅ PDF baixado com sucesso!');
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    alert('❌ Erro: ' + errorMsg);
  }
}

export async function printPage(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('❌ Elemento não encontrado para imprimir');
    return;
  }

  try {
    const printWindow = window.open('', '', 'height=600,width=900');
    if (!printWindow) {
      alert('❌ Falha ao abrir janela de impressão');
      return;
    }

    // Clone do elemento para impressão
    const clonedElement = element.cloneNode(true) as HTMLElement;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Imprimir Escala</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 20px;
              background: white;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              gap: 5px;
              margin-top: 20px;
            }
            .day {
              border: 1px solid #ddd;
              padding: 10px;
              min-height: 80px;
              background: white;
            }
            .day-header {
              font-weight: bold;
              text-align: center;
              padding: 10px;
              background: #f5f5f5;
            }
            @media print {
              body { padding: 10px; }
              .day { min-height: 60px; }
            }
          </style>
        </head>
        <body>
          ${clonedElement.innerHTML}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 250);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  } catch (error) {
    console.error('Erro ao imprimir:', error);
    alert('❌ Erro ao imprimir. Tente novamente.');
  }
}
