import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import type { Booking } from '../types';
import { format } from 'date-fns';

export function exportToCSV(bookings: Booking[]) {
  const data = bookings.map(b => ({
    'Client Name': b.clientName,
    'Function Name': b.functionName,
    Contact: b.contact,
    Year: b.year,
    Date: b.functionDate,
    Category: b.category,
    'Booking Amount': b.bookingAmount,
    'Advance Paid': b.advancePaid,
    'Balance Amount': b.balanceAmount,
    'Balance Paid': b.isBalancePaid ? 'Yes' : 'No',
    Status: b.status,
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `bookings_${format(new Date(), 'yyyyMMdd')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(bookings: Booking[]) {
  const data = bookings.map(b => ({
    'Client Name': b.clientName,
    'Function Name': b.functionName,
    Contact: b.contact,
    Year: b.year,
    Date: b.functionDate,
    Category: b.category,
    'Booking Amount': b.bookingAmount,
    'Advance Paid': b.advancePaid,
    'Balance Amount': b.balanceAmount,
    Status: b.status,
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
  XLSX.writeFile(wb, `bookings_${format(new Date(), 'yyyyMMdd')}.xlsx`);
}

export function exportToPDF(bookings: Booking[]) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Bookings Report', 14, 15);

  let yPos = 30;
  bookings.forEach((b, index) => {
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${b.clientName} — ${b.functionName}`, 14, yPos);
    yPos += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${b.functionDate} | Status: ${b.status} | Category: ${b.category || '-'}`, 14, yPos);
    yPos += 5;
    doc.text(`Booking: ₹${b.bookingAmount} | Advance: ₹${b.advancePaid} | Balance: ₹${b.balanceAmount}`, 14, yPos);
    yPos += 10;
  });

  doc.save(`bookings_${format(new Date(), 'yyyyMMdd')}.pdf`);
}
