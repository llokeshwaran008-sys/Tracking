import React, { useState, useEffect, useMemo } from 'react';
import { bookingService } from '../services/bookingService';
import type { Booking } from '../types';
import { Search, Filter, Download, Edit2, X, FileText, FileSpreadsheet } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { useSearchParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Skeleton } from '../components/ui/Skeleton';
import { getCategoryColors } from '../lib/categoryColors';

export default function BookingsPage() {
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize search term from URL query param if present
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Edit Modal State
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editAdvancePaid, setEditAdvancePaid] = useState<string>('');
  const [editStatus, setEditStatus] = useState<Booking['status']>('Upcoming');

  useEffect(() => {
    // Update search term if URL changes
    const q = searchParams.get('q');
    if (q !== null) setSearchTerm(q);
  }, [searchParams]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    const data = await bookingService.getBookings();
    setBookings(data);
    setLoading(false);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = 
        booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.functionName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Upcoming': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleEditClick = (booking: Booking) => {
    setEditingBooking(booking);
    setEditAdvancePaid(String(booking.advancePaid));
    setEditStatus(booking.status);
  };

  const handleSaveEdit = async () => {
    if (!editingBooking) return;
    
    const newAdvance = Number(editAdvancePaid);
    const newBalance = editingBooking.bookingAmount - newAdvance;
    
    const updates: Partial<Booking> = {
      advancePaid: newAdvance,
      balanceAmount: newBalance >= 0 ? newBalance : 0,
      isBalancePaid: newBalance <= 0,
      status: editStatus
    };

    await bookingService.updateBooking(editingBooking.id, updates);
    setEditingBooking(null);
    loadBookings();
  };

  const exportCSV = () => {
    const headers = ['Client Name', 'Function', 'Category', 'Contact', 'Date', 'Booking Amount', 'Advance', 'Balance', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredBookings.map(b => [
        `"${b.clientName}"`,
        `"${b.functionName}"`,
        `"${b.category || ''}"`,
        `"${b.contact}"`,
        `"${b.functionDate ? format(new Date(b.functionDate), 'dd-MM-yyyy') : ''}"`,
        b.bookingAmount,
        b.advancePaid,
        b.balanceAmount,
        `"${b.status}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bookings_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    setShowExportMenu(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Bookings Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on ${format(new Date(), 'PPpp')}`, 14, 22);

    const tableData = filteredBookings.map(b => [
      b.clientName,
      b.functionName,
      b.functionDate ? format(new Date(b.functionDate), 'dd-MM-yyyy') : '-',
      b.bookingAmount.toString(),
      b.balanceAmount.toString(),
      b.status
    ]);

    autoTable(doc, {
      startY: 28,
      head: [['Client', 'Function', 'Date', 'Amount', 'Balance', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [109, 77, 255] }
    });

    doc.save(`bookings_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    setShowExportMenu(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-float-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient-clay">All Bookings</h2>
          <p className="text-muted-foreground mt-1">Manage and track all your event bookings.</p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="clay-btn flex items-center gap-2 px-5 py-2.5 bg-card text-foreground rounded-xl text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
          
          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl border border-border shadow-lg p-2 z-10 clay-card animate-float-in" style={{ animationDelay: '0ms' }}>
              <button 
                onClick={exportCSV}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-secondary/80 rounded-lg transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-green-500" />
                Export as CSV
              </button>
              <button 
                onClick={exportPDF}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-secondary/80 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4 text-red-500" />
                Export as PDF
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="clay-card border border-border/50 rounded-2xl flex-1 flex flex-col overflow-hidden animate-float-in" style={{ animationDelay: '100ms' }}>
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/20">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by client or function..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="clay-input w-full pl-9 pr-4 py-2 bg-background/50 text-sm focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="clay-input w-full sm:w-auto px-3 py-2 bg-background/50 text-sm focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Processing">Processing</option>
              <option value="Done">Done</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/30 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Function</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Balance</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl opacity-50">🔍</span>
                      <p>No bookings found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const catColor = getCategoryColors(booking.category);
                  return (
                    <tr key={booking.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">{booking.clientName}</div>
                        <div className="text-xs text-muted-foreground">{booking.contact}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">{booking.functionName}</td>
                      <td className="px-6 py-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", catColor.bg, catColor.text)}>
                          {booking.category || 'Other'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {booking.functionDate ? format(new Date(booking.functionDate), 'dd MMM yyyy') : '-'}
                      </td>
                      <td className="px-6 py-4 font-semibold">{formatCurrency(booking.bookingAmount)}</td>
                      <td className="px-6 py-4">
                        {booking.balanceAmount > 0 ? (
                          <span className="text-destructive font-bold">{formatCurrency(booking.balanceAmount)}</span>
                        ) : (
                          <span className="text-green-500 font-bold">Paid</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold border", getStatusColor(booking.status))}>
                          {booking.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleEditClick(booking)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Edit Status & Payment"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col gap-4 p-4 overflow-y-auto bg-muted/10">
          {filteredBookings.length === 0 ? (
             <div className="py-12 text-center text-muted-foreground">
               <div className="flex flex-col items-center gap-2">
                 <span className="text-4xl opacity-50">🔍</span>
                 <p>No bookings found.</p>
               </div>
             </div>
          ) : (
            filteredBookings.map((booking) => {
              const catColor = getCategoryColors(booking.category);
              return (
                <div key={booking.id} className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-lg">{booking.clientName}</h4>
                      <p className="text-sm text-muted-foreground">{booking.functionName}</p>
                    </div>
                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border", getStatusColor(booking.status))}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", catColor.bg, catColor.text)}>
                      {booking.category || 'Other'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {booking.functionDate ? format(new Date(booking.functionDate), 'dd MMM yyyy') : '-'}
                    </span>
                  </div>

                  <div className="flex justify-between items-end pt-3 border-t border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Balance</p>
                      {booking.balanceAmount > 0 ? (
                        <p className="text-destructive font-bold text-sm">{formatCurrency(booking.balanceAmount)}</p>
                      ) : (
                        <p className="text-green-500 font-bold text-sm">Fully Paid</p>
                      )}
                    </div>
                    <button 
                      onClick={() => handleEditClick(booking)}
                      className="clay-btn p-2 bg-secondary/80 rounded-xl text-foreground"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Edit Modal Overlay with Glassmorphism */}
      {editingBooking && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-float-in" style={{ animationDuration: '0.2s' }}>
          <div className="clay-card bg-card/90 w-full max-w-md rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gradient-clay">Update Booking</h3>
              <button onClick={() => setEditingBooking(null)} className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div className="p-3 bg-secondary/40 rounded-xl border border-border/30">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Client Name</p>
                <p className="font-bold text-lg">{editingBooking.clientName}</p>
                <p className="text-sm text-muted-foreground">{editingBooking.functionName}</p>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/80">Update Paid Amount (₹)</label>
                <input
                  type="number"
                  value={editAdvancePaid}
                  onChange={(e) => setEditAdvancePaid(e.target.value)}
                  className="clay-input w-full px-3 py-2.5 bg-secondary/60 text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/80">Update Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as Booking['status'])}
                  className="clay-input w-full px-3 py-2.5 bg-secondary/60 text-foreground"
                >
                  <option value="Upcoming">📅 Upcoming</option>
                  <option value="Processing">⚙️ Processing</option>
                  <option value="Done">✅ Done</option>
                  <option value="Cancelled">❌ Cancelled</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-border/30">
                <button 
                  onClick={() => setEditingBooking(null)}
                  className="clay-input px-5 py-2.5 text-sm font-semibold hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveEdit}
                  className="clay-btn px-6 py-2.5 text-sm font-bold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, hsl(252 80% 60%), hsl(220 80% 62%))' }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

