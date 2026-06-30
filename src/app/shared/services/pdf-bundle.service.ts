import { Injectable } from '@angular/core';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

@Injectable({ providedIn: 'root' })
export class PdfBundleService {

  async mergeBuffers(buffers: ArrayBuffer[]) {

    const mergedPdf = await PDFDocument.create();

    for (const bytes of buffers) {

      if (!bytes || bytes.byteLength < 10) continue;

      if (this.isPdf(bytes)) {
        await this.handlePdf(mergedPdf, bytes);
      } else {
        await this.handleImage(mergedPdf, bytes);
      }
    }

    // 🔥 WATERMARK OPTIONAL
    await this.addWatermark(mergedPdf, 'PT PALM MAS ASRI');

    const result = await mergedPdf.save();

    const blob = new Blob([new Uint8Array(result)], {
      type: 'application/pdf'
    });

    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  private async handlePdf(merged: PDFDocument, bytes: ArrayBuffer) {
    const pdf = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }

  private async handleImage(merged: PDFDocument, bytes: ArrayBuffer) {

    let image;

    try {
      image = await merged.embedJpg(bytes);
    } catch {
      image = await merged.embedPng(bytes);
    }

    const page = merged.addPage([595, 842]);

    const { width, height } = image.scale(0.85);

    page.drawImage(image, {
      x: (595 - width) / 2,
      y: (842 - height) / 2,
      width,
      height
    });
  }

  private async addWatermark(pdf: PDFDocument, text: string) {

    const font = await pdf.embedFont(StandardFonts.HelveticaBold);

    pdf.getPages().forEach(page => {
      const { width, height } = page.getSize();

      page.drawText(text, {
        x: width / 4,
        y: height / 2,
        size: 40,
        font,
        color: rgb(0.8, 0.8, 0.8),
        rotate: degrees(45),
        opacity: 0.3
      });
    });
  }

  private isPdf(bytes: ArrayBuffer): boolean {
    const header = new Uint8Array(bytes).subarray(0, 4);
    return String.fromCharCode(...header) === '%PDF';
  }
}