"use client";
import React from 'react';
import Link from 'next/link';

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-[#FCFDFB] py-10 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3 sm:mb-4">Complete Your Upgrade</h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Scan the QR code below using <span className="text-[#9AD872] font-bold">Google Pay</span> or any UPI app to activate your Premium membership.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left: QR Code Section */}
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] shadow-2xl shadow-[#9AD872]/10 border border-gray-100 text-center">
            <div className="mb-4 sm:mb-6">
              <span className="bg-[#9AD872]/10 text-[#7db55a] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                Official UPI Payment
              </span>
            </div>
            
            {/* The QR Code Image */}
            <div className="relative inline-block bg-gray-50 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-2 border-dashed border-[#9AD872]/30 mb-4 sm:mb-6">
              <img 
                src="/fathahullah_qr.jpeg"
                alt="UPI QR Code for Payment" 
                className="w-48 sm:w-64 h-auto rounded-xl mx-auto"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400 font-medium">UPI ID:</p>
              <p className="text-lg sm:text-xl font-mono font-bold text-gray-800 bg-gray-50 py-2 rounded-xl border border-gray-100">
                pncfath@oksbi
              </p>
            </div>
            
            <p className="mt-4 sm:mt-6 text-xs text-gray-400 italic">
              Verified Name: ABDULKADER FATHAHULLA
            </p>
          </div>

          {/* Right: Payment Instructions & Summary */}
          <div className="space-y-6">
            
            {/* Order Summary Card */}
            <div className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
                <span className="text-gray-600">Premium Plan (6 Months)</span>
                <span className="font-bold text-gray-900">₹499</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-gray-900">Total Amount</span>
                <span className="font-black text-[#7db55a]">₹499</span>
              </div>
            </div>

            {/* Steps Card */}
            <div className="bg-[#9AD872] p-5 sm:p-8 rounded-[2rem] sm:rounded-[3rem] text-gray-900 shadow-lg shadow-[#9AD872]/20">
              <h3 className="font-black text-lg sm:text-xl mb-3 sm:mb-4">How to Pay:</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <span className="bg-white/40 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <p className="text-sm font-medium">Open <span className="font-bold">Google Pay</span> or any UPI app on your phone.</p>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="bg-white/40 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <p className="text-sm font-medium">Scan the QR code or enter the UPI ID manually.</p>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="bg-white/40 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <p className="text-sm font-medium">After successful payment, send a screenshot to our WhatsApp support for instant activation.</p>
                </li>
              </ul>
              
              <Link 
                href="https://wa.me/918220121113?text=I%20have%20completed%20the%20Premium%20payment"
                className="mt-8 block text-center bg-gray-900 text-white py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all"
              >
                Share Screenshot via WhatsApp
              </Link>
            </div>

            <Link href="/" className="block text-center text-gray-400 text-sm hover:text-gray-600 transition-colors">
              ← Cancel and return to home
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}