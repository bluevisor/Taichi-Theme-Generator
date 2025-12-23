import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Twitter, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react';
import { ThemeTokens } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  theme: ThemeTokens; // Use the current theme for styling
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url, theme }) => {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) setMounted(true);
    else setTimeout(() => setMounted(false), 300); // Wait for exit animation
  }, [isOpen]);

  if (!mounted && !isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = "Check out this color theme I generated with Taichi!";
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  // Social Links
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'bg-black/40 backdrop-blur-sm opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
        style={{ backgroundColor: theme.surface, color: theme.text, borderColor: theme.border, borderWidth: 1 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: theme.border }}>
          <h2 className="text-xl font-bold">Share Theme</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
            style={{ color: theme.textMuted }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center space-y-8">
          
          {/* QR Code Card */}
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center space-y-2">
            <QRCodeSVG 
              value={url} 
              size={180} 
              level="M" 
              includeMargin={true}
              imageSettings={{
                src: "/favicon.svg", // Assuming there is one, or just omit
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }} 
            />
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest mt-2">{url.split('?')[0].replace('https://', '')}</span>
          </div>

          <div className="w-full space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1">Socials</label>
            <div className="grid grid-cols-3 gap-3">
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" 
                 className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#1DA1F2] text-white hover:brightness-95 transition-all hover:scale-105 active:scale-95 shadow-md shadow-[#1DA1F2]/20">
                <Twitter size={18} fill="currentColor" />
                <span className="font-bold text-sm">Post</span>
              </a>
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" 
                 className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#4267B2] text-white hover:brightness-95 transition-all hover:scale-105 active:scale-95 shadow-md shadow-[#4267B2]/20">
                <Facebook size={18} fill="currentColor" />
                <span className="font-bold text-sm">Share</span>
              </a>
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" 
                 className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#0077b5] text-white hover:brightness-95 transition-all hover:scale-105 active:scale-95 shadow-md shadow-[#0077b5]/20">
                <Linkedin size={18} fill="currentColor" />
                <span className="font-bold text-sm">Post</span>
              </a>
            </div>
          </div>

          <div className="w-full space-y-2">
             <label className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1">Direct Link</label>
             <div className="flex items-center gap-2 p-1.5 rounded-xl border transition-colors focus-within:ring-2" 
                  style={{ backgroundColor: theme.surface2, borderColor: theme.border }}>
               <div className="p-2 text-opacity-50" style={{ color: theme.text }}>
                 <LinkIcon size={16} />
               </div>
               <input 
                 readOnly 
                 value={url} 
                 className="flex-1 bg-transparent text-sm font-mono outline-none truncate"
                 style={{ color: theme.textMuted }}
               />
               <button 
                 onClick={handleCopy}
                 className="p-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all hover:brightness-110 active:scale-95"
                 style={{ backgroundColor: copied ? theme.success : theme.primary, color: '#fff' }}
               >
                 {copied ? <Check size={16} /> : <Copy size={16} />}
                 {copied ? 'Copied' : 'Copy'}
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShareModal;
