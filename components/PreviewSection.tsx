import React, { useState } from 'react';
import {
  Palette, Shuffle, Image as ImageIcon,
  ChevronRight, Check, Copy, Download, Share2,
  Sliders, RefreshCw, Sparkles, Upload, Github,
  History, Sun, Moon, Menu, Lock
} from 'lucide-react';
import { DesignOptions } from '../types';

interface PreviewProps {
  themeName: string;
  options: DesignOptions;
  onUpdateOption?: (key: keyof DesignOptions, value: number | boolean) => void;
  onOpenImagePicker?: () => void;
}

// Controlled Slider Component
const ControlledSlider: React.FC<{
  rClass: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}> = ({ rClass, label, value, onChange, min = -5, max = 5 }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm font-medium text-t-text">{label}</label>
        <span className="text-xs font-mono text-t-primary font-bold">
          {value > 0 ? `+${value}` : value}
        </span>
      </div>
      <input 
        type="range" 
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={`w-full h-2 bg-t-text/15 ${rClass} appearance-none cursor-pointer accent-t-primary transition-colors`} 
      />
    </div>
  );
};

// Color Swatch with Copy
const ColorSwatch: React.FC<{
  name: string;
  colorClass: string;
  description: string;
  rClass: string;
}> = ({ name, colorClass, description, rClass }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`var(--${name})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  return (
    <div 
      className={`relative flex w-full items-center gap-3 p-2 pr-8 bg-t-card/50 ${rClass} cursor-pointer hover:bg-t-card transition-colors group/swatch`}
      onClick={handleCopy}
    >
      <div className={`w-8 h-8 ${rClass} ${colorClass} shadow-inner shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-mono text-t-text truncate">{name}</div>
        <div className="text-[10px] text-t-textMuted truncate">{description}</div>
      </div>
      <span className="absolute right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center">
        {copied ? (
          <Check size={14} className="text-t-good shrink-0" />
        ) : (
          <Copy size={14} className="text-t-textMuted opacity-0 group-hover/swatch:opacity-100 transition-opacity shrink-0" />
        )}
      </span>
    </div>
  );
};

const PreviewSection: React.FC<PreviewProps> = ({ themeName, options, onUpdateOption, onOpenImagePicker }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => ({
    start: true,
    adjust: true,
    swatches: true,
    export: true
  }));
  
  // Style utilities based on options
  const getRadius = (level: number) => {
    switch(level) {
      case 0: return 'rounded-none';
      case 1: return 'rounded-sm';
      case 2: return 'rounded-md';
      case 3: return 'rounded-lg';
      case 4: return 'rounded-xl';
      case 5: return 'rounded-2xl';
      default: return 'rounded-lg';
    }
  };
  
  const getBorder = (width: number) => {
    const clamped = Math.min(Math.max(width, 0), 2);
    if (clamped === 0) return 'border-0';
    if (clamped === 1) return 'border border-t-border';
    return 'border-2 border-t-border';
  };
  
  const getShadow = (strength: number, opacity: number) => {
    const clampedStrength = Math.min(Math.max(strength, 0), 5);
    const alpha = Math.min(Math.max(opacity, 0), 100) / 100;
    if (clampedStrength === 0) return 'shadow-none';
    const shadowLevels = [
      '',
      `0_1px_2px_0_rgba(0,0,0,${alpha})`,
      `0_1px_3px_0_rgba(0,0,0,${alpha}),_0_1px_2px_-1px_rgba(0,0,0,${alpha})`,
      `0_4px_6px_-1px_rgba(0,0,0,${alpha}),_0_2px_4px_-2px_rgba(0,0,0,${alpha})`,
      `0_10px_15px_-3px_rgba(0,0,0,${alpha}),_0_4px_6px_-4px_rgba(0,0,0,${alpha})`,
      `0_25px_50px_-12px_rgba(0,0,0,${alpha})`,
    ];
    return `shadow-[${shadowLevels[clampedStrength]}]`;
  };
  
  const rClass = getRadius(options.radius);
  const bClass = getBorder(options.borderWidth);
  const sClass = getShadow(options.shadowStrength, options.shadowOpacity);
  
  // Gradient class for buttons/backgrounds when enabled
  const gradientClass = options.gradients 
    ? 'bg-gradient-to-br from-t-primary via-t-primary to-t-secondary' 
    : 'bg-t-primary';
  
  const gradientAccent = options.gradients 
    ? 'bg-gradient-to-br from-t-accent via-t-accent to-t-primary' 
    : 'bg-t-accent';
    
  const gradientSecondary = options.gradients 
    ? 'bg-gradient-to-br from-t-secondary via-t-secondary to-t-accent' 
    : 'bg-t-secondary';

  const heroOverlayClass = themeName === 'Dark' ? 'bg-black/60' : 'bg-white/70';

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="p-6 md:p-10 space-y-10 bg-t-bg min-h-full">
      
      {/* Hero Section with Background Image */}
      <section 
        className={`relative overflow-hidden ${rClass} ${sClass} p-8 md:p-12`}
        style={{
          backgroundImage: `url('/hero-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className={`absolute left-4 top-4 z-10 ${rClass} ${bClass} bg-t-card/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-t-text backdrop-blur`}>
          {themeName === 'Dark' ? 'Dark mode preview' : 'Light mode preview'}
        </div>

        {/* Solid Color Overlay */}
        <div className={`absolute inset-0 ${heroOverlayClass} pointer-events-none`} />
        
        {/* Content */}
        <div className="relative z-10 space-y-2">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-left leading-tight">
            <span className="text-t-text block">Taichi</span>
            <span className="text-t-primary block">Theme Generator</span>
          </h1>
          <p className="text-lg text-t-textMuted max-w-xl text-left pt-2">
            Generate balanced color palettes using the <strong className="text-t-primary">OKLCH color space</strong>, automatically create matching light and dark themes, and tune primary, secondary, accent, success, warning, and error colors across real UI components. Export CSS variables and share themes with your team.
          </p>
        </div>
        
        {/* Glass Edge */}
        <div className={`absolute inset-0 ${rClass} border border-white/10 pointer-events-none`} />
      </section>

      <section className={`${bClass} ${rClass} ${sClass} bg-t-card p-6 space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-t-textMuted">Quick Guide</p>
            <h2 className="text-lg font-bold text-t-text">Header Controls</h2>
          </div>
          <div className={`flex items-center gap-2 text-xs font-semibold ${rClass} bg-t-primary/10 text-t-primary px-3 py-1`}>
            <Menu size={14} />
            Top-right toolbar
          </div>
        </div>
        <p className="text-sm text-t-textMuted">
          Use the icons on the top-right header to toggle panels, load an image palette, and share or export the current theme. On mobile, the menu icon reveals the same actions.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-xs text-t-textMuted">
          <div className="flex items-center gap-2">
            <Palette size={14} className="text-t-primary" />
            <span>Palette: toggle swatches</span>
          </div>
          <div className="flex items-center gap-2">
            <Sliders size={14} className="text-t-primary" />
            <span>Options: open controls</span>
          </div>
          <div className="flex items-center gap-2">
            <History size={14} className="text-t-primary" />
            <span>History: past themes</span>
          </div>
          <div className="flex items-center gap-2">
            <ImageIcon size={14} className="text-t-primary" />
            <span>Image: extract palette</span>
          </div>
          <div className="flex items-center gap-2">
            <Download size={14} className="text-t-primary" />
            <span>Download: export JSON</span>
          </div>
          <div className="flex items-center gap-2">
            <Share2 size={14} className="text-t-primary" />
            <span>Share: copy URL</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-t-primary">
              <Sun size={14} />
              <Moon size={14} />
            </span>
            <span>Theme: toggle UI</span>
          </div>
          <div className="flex items-center gap-2">
            <Menu size={14} className="text-t-primary" />
            <span>Menu: mobile shortcuts</span>
          </div>
        </div>
        <div className="flex items-start gap-2 text-xs text-t-textMuted">
          <Lock size={14} className="text-t-primary mt-0.5" />
          <span>Lock options with the lock beside each slider, and lock colors using the lock icon in the swatch strip to keep them while generating.</span>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          {/* Generator Actions */}
          <section className="space-y-4">
            <button 
              onClick={() => toggleSection('start')}
              className={`w-full flex items-center justify-between p-4 ${bClass} ${rClass} ${sClass} bg-t-card hover:bg-t-card2 transition-colors`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${rClass} ${gradientClass} flex items-center justify-center text-t-textOnColor`}>
                  <Shuffle size={20} />
                </div>
                <div className="text-left">
                  <h2 className="font-bold text-t-text">Generator Actions</h2>
                  <p className="text-sm text-t-textMuted">Upload an image or press Space to randomize</p>
                </div>
              </div>
              <ChevronRight className={`text-t-textMuted transition-transform ${expandedSections.start ? 'rotate-90' : ''}`} />
            </button>
            
            {expandedSections.start && (
              <div className={`${bClass} ${rClass} ${sClass} bg-t-card p-6 space-y-4`}>
                <p className="text-sm text-t-textMuted">
                  Start by uploading an image to extract colors, or press <kbd className="px-2 py-1 bg-t-text/10 rounded text-t-text font-mono text-xs">Space</kbd> to generate a random harmonious palette.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => onOpenImagePicker?.()}
                    className={`${gradientAccent} text-t-textOnColor px-6 py-3 ${rClass} font-semibold ${sClass} transition-all hover:scale-105 active:scale-95 flex items-center gap-2`}
                  >
                    <Upload size={18} />
                    Upload Image
                  </button>
                  
                  <button className={`${gradientClass} text-t-textOnColor px-6 py-3 ${rClass} font-semibold ${sClass} transition-all hover:scale-105 active:scale-95 flex items-center gap-2`}>
                    <Shuffle size={18} />
                    Randomize
                    <span className="text-xs opacity-75 ml-1 bg-black/20 px-2 py-0.5 rounded">Space</span>
                  </button>
                </div>
                
                <div className={`p-4 ${rClass} bg-t-primary/10 border border-t-primary/30`}>
                  <p className="text-sm text-t-primary flex items-start gap-2">
                    <Sparkles size={16} className="shrink-0 mt-0.5" />
                    <span><strong>Pro tip:</strong> Lock colors or options you want to keep, then generate to only change the unlocked ones.</span>
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Palette Controls */}
          <section className="space-y-4">
            <button 
              onClick={() => toggleSection('adjust')}
              className={`w-full flex items-center justify-between p-4 ${bClass} ${rClass} ${sClass} bg-t-card hover:bg-t-card2 transition-colors`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${rClass} ${gradientSecondary} flex items-center justify-center text-t-textOnColor`}>
                  <Sliders size={20} />
                </div>
                <div className="text-left">
                  <h2 className="font-bold text-t-text">Palette Controls</h2>
                  <p className="text-sm text-t-textMuted">Fine-tune saturation, brightness, and contrast</p>
                </div>
              </div>
              <ChevronRight className={`text-t-textMuted transition-transform ${expandedSections.adjust ? 'rotate-90' : ''}`} />
            </button>
            
            {expandedSections.adjust && (
              <div className={`${bClass} ${rClass} ${sClass} bg-t-card p-6 space-y-6`}>
                <p className="text-sm text-t-textMuted">
                  These sliders affect how colors are generated. Changes apply in real-time.
                </p>
                
                {onUpdateOption ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ControlledSlider 
                      rClass={rClass}
                      label="Saturation" 
                      value={options.saturationLevel}
                      onChange={(v) => onUpdateOption('saturationLevel', v)}
                    />
                    <ControlledSlider 
                      rClass={rClass}
                      label="Brightness" 
                      value={options.brightnessLevel}
                      onChange={(v) => onUpdateOption('brightnessLevel', v)}
                    />
                    <ControlledSlider 
                      rClass={rClass}
                      label="Contrast" 
                      value={options.contrastLevel}
                      onChange={(v) => onUpdateOption('contrastLevel', v)}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-t-textMuted italic">Controls not available in this view</p>
                )}
                
                <div className="flex flex-wrap gap-6 pt-4 border-t border-t-border">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={options.darkFirst}
                      onChange={(e) => onUpdateOption?.('darkFirst', e.target.checked)}
                      className="w-5 h-5 accent-t-primary rounded cursor-pointer"
                    />
                    <div>
                      <span className="text-sm font-medium text-t-text group-hover:text-t-primary transition-colors">Dark First</span>
                      <p className="text-xs text-t-textMuted">Generate dark theme as primary</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={options.gradients}
                      onChange={(e) => onUpdateOption?.('gradients', e.target.checked)}
                      className="w-5 h-5 accent-t-primary rounded cursor-pointer"
                    />
                    <div>
                      <span className="text-sm font-medium text-t-text group-hover:text-t-primary transition-colors">Gradients</span>
                      <p className="text-xs text-t-textMuted">Apply gradients to colored elements</p>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          {/* Color Tokens */}
          <section className="space-y-4">
            <button 
              onClick={() => toggleSection('swatches')}
              className={`w-full flex items-center justify-between p-4 ${bClass} ${rClass} ${sClass} bg-t-card hover:bg-t-card2 transition-colors`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${rClass} bg-t-good flex items-center justify-center text-t-textOnColor`}>
                  <Palette size={20} />
                </div>
                <div className="text-left">
                  <h2 className="font-bold text-t-text">Color Tokens</h2>
                  <p className="text-sm text-t-textMuted">Click any token to copy its CSS variable</p>
                </div>
              </div>
              <ChevronRight className={`text-t-textMuted transition-transform ${expandedSections.swatches ? 'rotate-90' : ''}`} />
            </button>
            
            {expandedSections.swatches && (
              <div className={`${bClass} ${rClass} ${sClass} bg-t-card p-6 space-y-4`}>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  <ColorSwatch name="primary" colorClass="bg-t-primary" description="Main brand" rClass={rClass} />
                  <ColorSwatch name="secondary" colorClass="bg-t-secondary" description="Supporting" rClass={rClass} />
                  <ColorSwatch name="accent" colorClass="bg-t-accent" description="Highlight" rClass={rClass} />
                  <ColorSwatch name="bg" colorClass="bg-t-bg border border-t-border" description="Background" rClass={rClass} />
                  <ColorSwatch name="card" colorClass="bg-t-card border border-t-border" description="Cards" rClass={rClass} />
                  <ColorSwatch name="text" colorClass="bg-t-text" description="Primary text" rClass={rClass} />
                  <ColorSwatch name="textMuted" colorClass="bg-t-textMuted" description="Muted text" rClass={rClass} />
                  <ColorSwatch name="good" colorClass="bg-t-good" description="Success" rClass={rClass} />
                  <ColorSwatch name="warn" colorClass="bg-t-warn" description="Warning" rClass={rClass} />
                  <ColorSwatch name="bad" colorClass="bg-t-bad" description="Error" rClass={rClass} />
                </div>
              </div>
            )}
          </section>

          {/* Export & Share */}
          <section className="space-y-4">
            <button 
              onClick={() => toggleSection('export')}
              className={`w-full flex items-center justify-between p-4 ${bClass} ${rClass} ${sClass} bg-t-card hover:bg-t-card2 transition-colors`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${rClass} bg-t-text text-t-bg flex items-center justify-center`}>
                  <Download size={20} />
                </div>
                <div className="text-left">
                  <h2 className="font-bold text-t-text">Export & Share</h2>
                  <p className="text-sm text-t-textMuted">Download CSS or share via URL</p>
                </div>
              </div>
              <ChevronRight className={`text-t-textMuted transition-transform ${expandedSections.export ? 'rotate-90' : ''}`} />
            </button>
            
            {expandedSections.export && (
              <div className={`${bClass} ${rClass} ${sClass} bg-t-card p-6 space-y-4`}>
                <div className="flex flex-wrap gap-3">
                  <button className={`${gradientClass} text-t-textOnColor px-5 py-2.5 ${rClass} font-semibold ${sClass} transition-all hover:scale-105 active:scale-95 flex items-center gap-2`}>
                    <Download size={16} />
                    Download CSS
                  </button>
                  
                  <button className={`${gradientSecondary} text-t-textOnColor px-5 py-2.5 ${rClass} font-semibold ${sClass} transition-all hover:scale-105 active:scale-95 flex items-center gap-2`}>
                    <Share2 size={16} />
                    Share URL
                  </button>
                  
                  <button className={`bg-t-text/10 text-t-text px-5 py-2.5 ${rClass} font-medium ${bClass} ${sClass} transition-all hover:bg-t-text/20 active:scale-95 flex items-center gap-2`}>
                    <Copy size={16} />
                    Copy All Tokens
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-t-textMuted">Studio Snapshot</p>
            <h2 className="text-xl font-bold text-t-text">Live Workspace</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={`bg-t-text/10 text-t-text px-4 py-2 ${rClass} ${bClass} ${sClass} text-sm font-semibold flex items-center gap-2`}>
              <RefreshCw size={14} />
              Sync
            </button>
            <button className={`${gradientClass} text-t-textOnColor px-4 py-2 ${rClass} ${sClass} text-sm font-semibold flex items-center gap-2`}>
              <Sparkles size={14} />
              View Report
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className={`${bClass} ${rClass} ${sClass} bg-t-card p-4 space-y-1`}>
            <p className="text-[11px] uppercase tracking-wider text-t-textMuted">Projects</p>
            <p className="text-2xl font-black text-t-text">12</p>
            <p className="text-xs text-t-good">+3 this week</p>
          </div>
          <div className={`${bClass} ${rClass} ${sClass} bg-t-card p-4 space-y-1`}>
            <p className="text-[11px] uppercase tracking-wider text-t-textMuted">Reviews</p>
            <p className="text-2xl font-black text-t-text">28</p>
            <p className="text-xs text-t-primary">2 due today</p>
          </div>
          <div className={`${bClass} ${rClass} ${sClass} bg-t-card p-4 space-y-1`}>
            <p className="text-[11px] uppercase tracking-wider text-t-textMuted">Conversion</p>
            <p className="text-2xl font-black text-t-text">4.8%</p>
            <p className="text-xs text-t-secondary">Best month</p>
          </div>
          <div className={`${bClass} ${rClass} ${sClass} bg-t-card p-4 space-y-1`}>
            <p className="text-[11px] uppercase tracking-wider text-t-textMuted">Satisfaction</p>
            <p className="text-2xl font-black text-t-text">95</p>
            <p className="text-xs text-t-good">Team score</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className={`${bClass} ${rClass} ${sClass} bg-t-card p-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-t-textMuted">Pipeline</p>
                <h3 className="text-lg font-bold text-t-text">Active Projects</h3>
              </div>
              <button className={`text-xs font-semibold text-t-primary px-3 py-1 ${rClass} bg-t-primary/10 ${bClass}`}>
                View All
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-t border-t-border/40 pt-3">
                <div>
                  <p className="text-sm font-semibold text-t-text">Aria Mobile</p>
                  <p className="text-xs text-t-textMuted">Brand refresh</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold ${rClass} bg-t-good/15 text-t-good px-2 py-0.5`}>
                    On track
                  </span>
                  <p className="text-xs text-t-textMuted mt-1">72% complete</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-t-border/40 pt-3">
                <div>
                  <p className="text-sm font-semibold text-t-text">Nimbus Web</p>
                  <p className="text-xs text-t-textMuted">Landing redesign</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold ${rClass} bg-t-warn/15 text-t-warn px-2 py-0.5`}>
                    Needs review
                  </span>
                  <p className="text-xs text-t-textMuted mt-1">48% complete</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-t-border/40 pt-3">
                <div>
                  <p className="text-sm font-semibold text-t-text">Atlas App</p>
                  <p className="text-xs text-t-textMuted">Component audit</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold ${rClass} bg-t-secondary/15 text-t-secondary px-2 py-0.5`}>
                    In progress
                  </span>
                  <p className="text-xs text-t-textMuted mt-1">33% complete</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`${bClass} ${rClass} ${sClass} bg-t-card p-6 space-y-4`}>
            <div>
              <p className="text-xs uppercase tracking-wider text-t-textMuted">Quick Form</p>
              <h3 className="text-lg font-bold text-t-text">Schedule Review</h3>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-t-text">Client Email</label>
              <input 
                type="email"
                placeholder="team@bucaastudio.com"
                className={`w-full px-3 py-2 ${rClass} ${bClass} bg-t-bg text-t-text placeholder:text-t-textMuted/70 focus:outline-none focus:ring-2 focus:ring-t-primary/30`}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-t-text">Date</label>
                <input 
                  type="text"
                  placeholder="Aug 18"
                  className={`w-full px-3 py-2 ${rClass} ${bClass} bg-t-bg text-t-text placeholder:text-t-textMuted/70 focus:outline-none focus:ring-2 focus:ring-t-primary/30`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-t-text">Time</label>
                <input 
                  type="text"
                  placeholder="10:00 AM"
                  className={`w-full px-3 py-2 ${rClass} ${bClass} bg-t-bg text-t-text placeholder:text-t-textMuted/70 focus:outline-none focus:ring-2 focus:ring-t-primary/30`}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className={`${gradientClass} text-t-textOnColor px-4 py-2 ${rClass} ${sClass} text-sm font-semibold flex items-center gap-2`}>
                <Share2 size={14} />
                Send Invite
              </button>
              <button className={`bg-t-text/10 text-t-text px-4 py-2 ${rClass} ${bClass} text-sm font-semibold`}>
                Save Draft
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className={`${bClass} ${rClass} ${sClass} bg-t-card p-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-t-textMuted">Plan</p>
                <h3 className="text-lg font-bold text-t-text">Creator Pro</h3>
              </div>
              <span className={`text-xs font-semibold ${rClass} bg-t-primary/15 text-t-primary px-2 py-1`}>
                Popular
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-t-text">$24</span>
              <span className="text-xs text-t-textMuted">/month</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-t-text">
                <Check size={14} className="text-t-good" />
                <span>Unlimited palettes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-t-text">
                <Check size={14} className="text-t-good" />
                <span>Export tokens to CSS</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-t-text">
                <Check size={14} className="text-t-good" />
                <span>Priority reviews</span>
              </div>
            </div>
            <button className={`${gradientAccent} text-t-textOnColor px-4 py-2 ${rClass} ${sClass} text-sm font-semibold w-full`}>
              Upgrade Plan
            </button>
          </div>

          <div className={`${bClass} ${rClass} ${sClass} bg-t-card p-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-t-textMuted">Inbox</p>
                <h3 className="text-lg font-bold text-t-text">Client Notes</h3>
              </div>
              <span className={`text-xs font-semibold ${rClass} bg-t-secondary/15 text-t-secondary px-2 py-1`}>
                3 new
              </span>
            </div>
            <div className="space-y-3">
              <div className={`flex items-start gap-3 p-3 ${rClass} bg-t-card2`}>
                <div className={`w-10 h-10 ${rClass} ${gradientSecondary} flex items-center justify-center text-t-textOnColor text-xs font-bold`}>
                  LM
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-t-text">Lia Morales</p>
                  <p className="text-xs text-t-textMuted">Can we lighten the hero overlay?</p>
                </div>
                <span className="text-xs text-t-textMuted">2h</span>
              </div>
              <div className={`flex items-start gap-3 p-3 ${rClass} bg-t-card2`}>
                <div className={`w-10 h-10 ${rClass} ${gradientAccent} flex items-center justify-center text-t-textOnColor text-xs font-bold`}>
                  JT
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-t-text">Jae Tran</p>
                  <p className="text-xs text-t-textMuted">We need a share link for marketing.</p>
                </div>
                <span className="text-xs text-t-textMuted">5h</span>
              </div>
              <div className={`flex items-start gap-3 p-3 ${rClass} bg-t-card2`}>
                <div className={`w-10 h-10 ${rClass} bg-t-text/10 flex items-center justify-center text-t-text text-xs font-bold`}>
                  AR
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-t-text">Ari Reed</p>
                  <p className="text-xs text-t-textMuted">Loved the new gradient option.</p>
                </div>
                <span className="text-xs text-t-textMuted">1d</span>
              </div>
            </div>
            <button className={`bg-t-text/10 text-t-text px-4 py-2 ${rClass} ${bClass} text-sm font-semibold w-full`}>
              Open Inbox
            </button>
          </div>

          <div className={`${bClass} ${rClass} ${sClass} bg-t-card p-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-t-textMuted">Media</p>
                <h3 className="text-lg font-bold text-t-text">Moodboard</h3>
              </div>
              <ImageIcon size={18} className="text-t-accent" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className={`${rClass} ${gradientClass} h-16`} />
              <div className={`${rClass} bg-t-secondary/30 h-16`} />
              <div className={`${rClass} bg-t-accent/30 h-16`} />
            </div>
            <p className="text-sm text-t-textMuted">
              Capture the vibe with layered textures and bold highlights.
            </p>
            <button className={`${gradientClass} text-t-textOnColor px-4 py-2 ${rClass} ${sClass} text-sm font-semibold w-full`}>
              Add Assets
            </button>
          </div>
        </div>

        <div className={`${bClass} ${rClass} ${sClass} bg-t-card p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-t-textMuted">Queue</p>
              <h3 className="text-lg font-bold text-t-text">Delivery Timeline</h3>
            </div>
            <button className={`text-xs font-semibold text-t-text px-3 py-1 ${rClass} ${bClass} bg-t-text/10`}>
              Export CSV
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-t border-t-border/40 pt-3">
              <div>
                <p className="text-sm font-semibold text-t-text">Landing Page</p>
                <p className="text-xs text-t-textMuted">Final review</p>
              </div>
              <span className={`text-xs font-semibold ${rClass} bg-t-warn/15 text-t-warn px-2 py-0.5`}>
                Pending
              </span>
              <span className="text-xs font-mono text-t-textMuted">Today</span>
            </div>
            <div className="flex items-center justify-between border-t border-t-border/40 pt-3">
              <div>
                <p className="text-sm font-semibold text-t-text">Mobile UI Kit</p>
                <p className="text-xs text-t-textMuted">Component polish</p>
              </div>
              <span className={`text-xs font-semibold ${rClass} bg-t-good/15 text-t-good px-2 py-0.5`}>
                Ready
              </span>
              <span className="text-xs font-mono text-t-textMuted">Tue</span>
            </div>
            <div className="flex items-center justify-between border-t border-t-border/40 pt-3">
              <div>
                <p className="text-sm font-semibold text-t-text">Style Guide</p>
                <p className="text-xs text-t-textMuted">Token export</p>
              </div>
              <span className={`text-xs font-semibold ${rClass} bg-t-secondary/15 text-t-secondary px-2 py-0.5`}>
                In progress
              </span>
              <span className="text-xs font-mono text-t-textMuted">Fri</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-t-border text-sm text-t-textMuted">
        <p>
          Taichi Theme Generator © 2025 | Bucaa Studio. All Rights Reserved. v25.12.2
        </p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/BucaaStudio" target="_blank" rel="noopener noreferrer" className="hover:text-t-primary transition-colors">
            <Github size={18} />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default PreviewSection;
