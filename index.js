const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

// Function to merge PDF files
const mergePDFs = async (inputDir, outputFile) => {
  const pdfFiles = fs.readdirSync(inputDir).filter(file => path.extname(file).toLowerCase() === '.pdf');
  const mergedPdf = await PDFDocument.create();

  for (const pdfFile of pdfFiles) {
    const filePath = path.join(inputDir, pdfFile);
    const pdfBytes = fs.readFileSync(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync(outputFile, mergedPdfBytes);
  console.log(`Merged PDF saved to ${outputFile}`);
};

// Define input directory and output file
const inputDir = './pdfs'; // Change this to your folder containing PDFs
const outputFile = './merged.pdf'; // Change this to your desired output file path

// Merge the PDFs
mergePDFs(inputDir, outputFile).catch(err => console.error(err));
