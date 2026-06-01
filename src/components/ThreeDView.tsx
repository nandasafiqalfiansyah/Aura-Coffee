/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, Laptop, Sofa, Wind, UserCheck, ShieldClose, Info } from 'lucide-react';
import { FLOOR_SECTIONS, TABLES } from '../data';
import { FloorSection, TableStatus } from '../types';

interface ThreeDViewProps {
  selectedSection: string;
  onSelectSection: (sectionId: string) => void;
  selectedTable: number | null;
  onSelectTable: (tableId: number | null) => void;
}

export default function ThreeDView({
  selectedSection,
  onSelectSection,
  selectedTable,
  onSelectTable,
}: ThreeDViewProps) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [perspectiveStrength, setPerspectiveStrength] = useState({ rx: 20, ry: -10 });

  // Soft mouse-tracking parallax to create true 3D spatial tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) - 0.5; // -0.5 to 0.5
    const py = (y / rect.height) - 0.5;
    
    setPerspectiveStrength({
      rx: 20 + py * 12, // Tilt range
      ry: -10 + px * -12,
    });
  };

  const handleMouseLeave = () => {
    setPerspectiveStrength({ rx: 20, ry: -10 });
  };

  const currentSectionData = FLOOR_SECTIONS.find(s => s.id === selectedSection);

  // Icon selector
  const getSectionIcon = (iconName: string, active: boolean) => {
    const cls = `w-5 h-5 ${active ? 'text-[#d4a373]' : 'text-stone-400'}`;
    switch (iconName) {
      case 'Coffee':
        return <Coffee className={cls} />;
      case 'Laptop':
        return <Laptop className={cls} />;
      case 'Sofa':
        return <Sofa className={cls} />;
      case 'Wind':
        return <Wind className={cls} />;
      default:
        return <Coffee className={cls} />;
    }
  };

  return (
    <div id="interactive-3d-cafe" className="flex flex-col gap-6">
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-4 gap-4">
        <div>
          <span className="text-xs font-mono text-[#d4a373] uppercase tracking-widest font-bold">Interactive 3D Seating Map</span>
          <h2 className="font-sans font-bold text-2xl text-white tracking-tight mt-1 uppercase italic">Denah Ruang 3D Aura</h2>
          <p className="text-gray-300 text-sm mt-1">
            Pilih area kafe atau nomor meja untuk memesan hidangan langsung ke tempat duduk Anda.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-300 bg-white/5 p-2.5 rounded-xl border border-white/10 self-start backdrop-blur-sm">
          <Info className="w-4 h-4 text-[#d4a373] flex-shrink-0" />
          <span>Sapu mouse Anda di atas area untuk efek kedalaman 3D paralaks.</span>
        </div>
      </div>

      {/* Grid Layout containing 3D View and Details panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Interactive 3D Canvas Box */}
        <div 
          className="lg:col-span-7 bg-[#0c0908]/85 backdrop-blur-md border border-white/10 rounded-3xl relative overflow-hidden h-[380px] sm:h-[450px] shadow-2xl flex items-center justify-center cursor-all-scroll group"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: '1000px' }}
        >
          {/* Subtle Grid overlay representing blueprint lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(212,163,115,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,163,115,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Glowing Ambient light beam in the center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#d4a373]/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

          {/* Level indicators or legend inside the frame */}
          <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">LEVEL 01 / GROUND FLOOR</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono text-gray-400">Pemesanan Langsung Meja Aktif</span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-gray-500 flex flex-col items-end pointer-events-none">
            <span>AXIS ROTATION</span>
            <span>RX: {Math.round(perspectiveStrength.rx)}° | RY: {Math.round(perspectiveStrength.ry)}°</span>
          </div>

          {/* Perspective Container Wrapper */}
          <motion.div
            animate={{
              rotateX: perspectiveStrength.rx,
              rotateY: perspectiveStrength.ry,
              scale: 0.95,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 25, mass: 1 }}
            className="w-[320.6px] sm:w-[420px] aspect-square relative transform-gpu flex items-center justify-center origin-center"
          >
            {/* The Isometric Cafe Floor (Projected Cube base) */}
            <svg 
              viewBox="0 0 500 500" 
              className="w-full h-full drop-shadow-[0_25px_40px_rgba(0,0,0,0.8)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ground Shadow */}
              <polygon points="250,110 430,200 250,290 70,200" fill="rgba(0,0,0,0.4)" />

              {/* Cafe floor tiles - Isometric Projection */}
              {/* Outer boundary wall */}
              <polygon points="250,120 420,205 250,290 80,205" fill="#141110" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              
              {/* Ground Floor visual grid segments */}
              {/* Section 1: Brewbar (Left quadrant) */}
              <polygon 
                id="floor-brewbar"
                points="250,120 335,162 250,205 165,162" 
                className="transition-all duration-300 cursor-pointer"
                fill={selectedSection === 'brewbar' ? 'rgba(212, 163, 115, 0.25)' : hoveredSection === 'brewbar' ? 'rgba(212, 163, 115, 0.12)' : '#1B1715'} 
                stroke={selectedSection === 'brewbar' ? '#d4a373' : 'rgba(255,255,255,0.08)'} 
                strokeWidth="1.5"
                onClick={() => onSelectSection('brewbar')}
                onMouseEnter={() => setHoveredSection('brewbar')}
                onMouseLeave={() => setHoveredSection(null)}
              />

              {/* Section 2: Cozy Corner (Right quadrant) */}
              <polygon 
                id="floor-cozy"
                points="335,162 420,205 335,247 250,205" 
                className="transition-all duration-300 cursor-pointer"
                fill={selectedSection === 'cozy' ? 'rgba(176, 125, 98, 0.25)' : hoveredSection === 'cozy' ? 'rgba(176, 125, 98, 0.12)' : '#191513'} 
                stroke={selectedSection === 'cozy' ? '#b07d62' : 'rgba(255,255,255,0.08)'} 
                strokeWidth="1.5"
                onClick={() => onSelectSection('cozy')}
                onMouseEnter={() => setHoveredSection('cozy')}
                onMouseLeave={() => setHoveredSection(null)}
              />

              {/* Section 3: Central Lounge (Center quadrant) */}
              <polygon 
                id="floor-lounge"
                points="165,162 250,205 165,247 80,205" 
                className="transition-all duration-300 cursor-pointer"
                fill={selectedSection === 'lounge' ? 'rgba(16, 185, 129, 0.20)' : hoveredSection === 'lounge' ? 'rgba(16, 185, 129, 0.10)' : '#1a1816'} 
                stroke={selectedSection === 'lounge' ? '#10B981' : 'rgba(255,255,255,0.08)'}  
                strokeWidth="1.5"
                onClick={() => onSelectSection('lounge')}
                onMouseEnter={() => setHoveredSection('lounge')}
                onMouseLeave={() => setHoveredSection(null)}
              />

              {/* Section 4: Garden Veranda Canopy (Bottom quadrant) */}
              <polygon 
                id="floor-outdoor"
                points="250,205 335,247 250,290 165,247" 
                className="transition-all duration-300 cursor-pointer"
                fill={selectedSection === 'outdoor' ? 'rgba(59, 130, 246, 0.20)' : hoveredSection === 'outdoor' ? 'rgba(59, 130, 246, 0.10)' : '#111213'} 
                stroke={selectedSection === 'outdoor' ? '#3B82F6' : 'rgba(255,255,255,0.08)'} 
                strokeWidth="1.5"
                onClick={() => onSelectSection('outdoor')}
                onMouseEnter={() => setHoveredSection('outdoor')}
                onMouseLeave={() => setHoveredSection(null)}
              />

              {/* Visual 3D structures (isometric extruded cubes representing furniture and landmarks) */}
              
              {/* Brewery Counter Bench (Extruded box) */}
              {/* Front Facet */}
              <polygon points="210,130 250,150 250,170 210,150" fill="#201c1a" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
              {/* Side Facet */}
              <polygon points="250,150 280,135 280,155 250,170" fill="#141110" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
              {/* Top Bar surface */}
              <polygon points="210,130 250,110 280,135 250,150" fill="#d4a373" fillOpacity="0.85" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

              {/* Cozy divider book shelf */}
              <polygon points="360,180 380,190 380,215 360,205" fill="#3D2923" />
              <polygon points="380,190 395,182 395,207 380,215" fill="#2D1D19" />
              <polygon points="360,180 375,172 395,182 380,190" fill="#4E342C" />

              {/* Indoor Plants / green tubes */}
              <circle cx="120" cy="180" r="8" fill="#15803D" />
              <line x1="120" y1="180" x2="120" y2="165" stroke="#10b981" strokeWidth="2.5" />
              <circle cx="120" cy="165" r="5" fill="#34d399" />

              {/* Interactive Tables & Chairs projection (dynamic elements) */}
              
              {/* Table rendering on specific section nodes */}
              {/* 1. V60 Brew Bar stools */}
              <g className="cursor-pointer" onClick={() => onSelectSection('brewbar')}>
                {/* Custom glowing floating spot indicating active select */}
                {selectedSection === 'brewbar' && (
                  <ellipse cx="250" cy="190" rx="15" ry="8" fill="none" stroke="#d4a373" strokeWidth="2">
                    <animate attributeName="rx" values="10;18;10" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="ry" values="5;9;5" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
                  </ellipse>
                )}
                {/* Brewbar Coffee Cup sign */}
                <path d="M245,185 C245,180 255,180 255,185 L255,189 C255,191 245,191 245,189 Z" fill="#d4a373" />
                <path d="M255,184 A2,2 0 0,1 257,186 L257,187 A2,2 0 0,1 255,189" fill="none" stroke="#d4a373" strokeWidth="1" />
              </g>

              {/* 2. Cozy Nest (laptop glow area) */}
              <g className="cursor-pointer" onClick={() => onSelectSection('cozy')}>
                {selectedSection === 'cozy' && (
                  <ellipse cx="320" cy="200" rx="15" ry="8" fill="none" stroke="#b07d62" strokeWidth="2">
                    <animate attributeName="rx" values="10;18;10" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="ry" values="5;9;5" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
                  </ellipse>
                )}
                {/* Cute Laptop monitor glowing in projection */}
                <polygon points="315,198 325,193 325,197 315,202" fill="#b07d62" />
                <line x1="318" y1="195" x2="322" y2="190" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>

              {/* 3. Central lounge big tables */}
              <g className="cursor-pointer" onClick={() => onSelectSection('lounge')}>
                {selectedSection === 'lounge' && (
                  <ellipse cx="170" cy="210" rx="20" ry="10" fill="none" stroke="#10B981" strokeWidth="2">
                    <animate attributeName="rx" values="15;24;15" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="ry" values="7.5;12;7.5" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
                  </ellipse>
                )}
                {/* Large Circle Table */}
                <polygon points="155,208 185,193 185,205 155,220" fill="#047857" />
                <polygon points="155,208 185,193 195,198 165,213" fill="#10b981" />
              </g>

              {/* 4. Outdoor table with botanical vibes */}
              <g className="cursor-pointer" onClick={() => onSelectSection('outdoor')}>
                {selectedSection === 'outdoor' && (
                  <ellipse cx="250" cy="250" rx="18" ry="9" fill="none" stroke="#3B82F6" strokeWidth="2">
                    <animate attributeName="rx" values="12;22;12" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="ry" values="6;11;6" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
                  </ellipse>
                )}
                {/* Parasol canopy table outline */}
                <line x1="250" y1="250" x2="250" y2="230" stroke="#3B82F6" strokeWidth="1.5" />
                <ellipse cx="250" cy="230" rx="12" ry="6" fill="#1d4ed8" fillOpacity="0.8" />
              </g>
              
              {/* Dynamic Table Numbers labels overlay floating */}
              <foreignObject x="210" y="115" width="80" height="30" className="pointer-events-none">
                <div className={`text-[8px] font-mono select-none px-1 py-0.5 rounded text-center transition-all ${selectedSection === 'brewbar' ? 'bg-[#d4a373] text-black font-bold scale-110 shadow-lg' : 'bg-black/70 text-gray-300'}`}>
                  Bar Seduh
                </div>
              </foreignObject>

              <foreignObject x="320" y="145" width="80" height="30" className="pointer-events-none">
                <div className={`text-[8px] font-mono select-none px-1 py-0.5 rounded text-center transition-all ${selectedSection === 'cozy' ? 'bg-[#d4a373]/90 text-black font-bold scale-110 shadow-lg' : 'bg-black/70 text-gray-300'}`}>
                  Sudut Tenang
                </div>
              </foreignObject>

              <foreignObject x="100" y="145" width="85" height="30" className="pointer-events-none">
                <div className={`text-[8px] font-mono select-none px-1 py-0.5 rounded text-center transition-all ${selectedSection === 'lounge' ? 'bg-emerald-500 text-black font-bold scale-110 shadow-lg' : 'bg-black/70 text-gray-300'}`}>
                  Ruang Tengah
                </div>
              </foreignObject>

              <foreignObject x="210" y="260" width="80" height="30" className="pointer-events-none">
                <div className={`text-[8px] font-mono select-none px-1 py-0.5 rounded text-center transition-all ${selectedSection === 'outdoor' ? 'bg-blue-500 text-black font-bold scale-110 shadow-lg' : 'bg-black/70 text-gray-300'}`}>
                  Veranda Outdoor
                </div>
              </foreignObject>
            </svg>
          </motion.div>

          {/* Controls overlay */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            {FLOOR_SECTIONS.map((section) => (
              <button
                key={section.id}
                id={`btn-3d-${section.id}`}
                onClick={() => onSelectSection(section.id)}
                className={`p-2 rounded-xl border text-xs transition-all flex items-center gap-1.5 backdrop-blur-sm ${
                  selectedSection === section.id
                    ? 'bg-[#d4a373] text-black border-[#d4a373] font-bold shadow-md'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {getSectionIcon(section.icon, selectedSection === section.id)}
                <span className="hidden sm:inline">{section.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Details & Seating Selection Sidepanel */}
        <div id="section-details-panel" className="lg:col-span-5 flex flex-col gap-5 backdrop-blur-md bg-white/5 p-5 sm:p-6 rounded-[28px] border border-white/10 justify-between shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSection}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-4"
            >
              {/* Section Tag */}
              <div className="flex items-center justify-between">
                <span 
                  className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold tracking-widest border"
                  style={{ 
                    color: currentSectionData?.color, 
                    borderColor: `${currentSectionData?.color}50`,
                    backgroundColor: `${currentSectionData?.color}15`,
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  {currentSectionData?.name}
                </span>
                <span className="text-xs font-mono text-gray-500">Zone Coordinates: ACTIVE</span>
              </div>

              {/* Title & Description of Room */}
              <div>
                <h3 className="font-sans text-xl text-white font-bold tracking-tight">
                  {currentSectionData?.indonesianName}
                </h3>
                <p className="text-gray-200 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  {currentSectionData?.indonesianDescription}
                </p>
                <p className="text-gray-400 text-xs italic mt-1 leading-normal">
                  "{currentSectionData?.description}"
                </p>
              </div>

              {/* Digital Seating Grid inside the Section */}
              <div className="border-t border-white/10 pt-4 mt-1">
                <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-3">
                  PILIH MEJA DUDUK (*Maksimal 1 meja)
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {TABLES.filter(t => t.sectionId === selectedSection).map((table) => {
                    const isSelected = selectedTable === table.id;
                    const isOccupied = table.status === 'occupied';
                    return (
                      <button
                        key={table.id}
                        id={`btn-table-${table.id}`}
                        disabled={isOccupied}
                        onClick={() => {
                          if (isSelected) {
                            onSelectTable(null); // Deselect
                          } else {
                            onSelectTable(table.id);
                          }
                        }}
                        className={`p-3 rounded-2xl border transition-all text-left flex flex-col gap-1 relative overflow-hidden group ${
                          isSelected
                            ? 'bg-[#d4a373]/20 border-[#d4a373] text-white shadow-lg shadow-[#d4a373]/10'
                            : isOccupied
                            ? 'bg-black/30 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                        }`}
                      >
                        {/* Selected golden subtle beam */}
                        {isSelected && (
                          <div className="absolute top-0 right-0 w-1.5 h-full bg-[#d4a373]" />
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold font-mono">Meja #{table.id}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                            isSelected 
                              ? 'bg-[#d4a373] text-black font-bold'
                              : isOccupied 
                              ? 'bg-white/10 text-gray-500' 
                              : 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {isSelected ? 'DIPILIH' : isOccupied ? 'TERISI' : 'KOSONG'}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 font-mono">
                          Kapasitas: {table.seats} Kursi
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Check-in Footer */}
          <div className="border-t border-white/10 pt-4 mt-2 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-gray-500 block">Status Duduk Anda:</span>
              <span className={`font-semibold ${selectedTable ? 'text-[#d4a373]' : 'text-gray-400'}`}>
                {selectedTable ? `Terdaftar di Meja #${selectedTable}` : 'Belum Memilih Meja (Takeaway)'}
              </span>
            </div>
            {selectedTable && (
              <button
                id="btn-remove-table"
                onClick={() => onSelectTable(null)}
                className="text-[10px] text-red-400 hover:text-red-300 border border-red-500/20 bg-red-950/20 px-2.5 py-1 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ShieldClose className="w-3.5 h-3.5" />
                <span>Batal Duduk</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
