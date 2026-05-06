"use client";
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-[80vh] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-[#9AD872] p-8 sm:p-12 text-center">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Contact Us</h1>
            <p className="mt-4 text-white/80 font-medium">We are here to help you find your perfect match.</p>
          </div>
          
          <div className="p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto text-[#9AD872]">
                <Mail size={24} />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Email</p>
              <p className="text-gray-900 font-bold">support@alfattah.com</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-500">
                <Phone size={24} />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Phone</p>
              <p className="text-gray-900 font-bold">+91 98765 43210</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
                <MapPin size={24} />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Office</p>
              <p className="text-gray-900 font-bold">Chennai, Tamil Nadu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
