'use client';

import React, { useState, useEffect } from 'react';
import { useClinic } from '@/lib/clinic-state';
import { ToothConditionEvent, PlannedTreatment } from '@/lib/types';
import { Info, Save, X, Edit3, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { useActiveEncounter } from '@/design-system/patient-context';

interface OdontogramChartProps {
  patientId: string;
  interactive: boolean;
  activeVisitId?: string | null;
  noCard?: boolean;
}

export const OdontogramChart: React.FC<OdontogramChartProps> = ({
  patientId,
  interactive,
  activeVisitId = null,
  noCard = false
}) => {
  const {
    patients,
    toothEvents,
    plannedTreatments,
    addToothEvent,
    togglePlannedTreatment,
    currentUser
  } = useClinic();

  const patient = patients.find(p => p.id === patientId);

  const encounterContext = useActiveEncounter();

  // Dentition selection: permanent, both, primary
  const [dentition, setDentition] = useState<'permanent' | 'both' | 'primary'>(() => {
    if (!patient) return 'permanent';
    const birthYear = new Date(patient.dateOfBirth).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    if (age >= 12) return 'permanent';
    if (age < 6) return 'primary';
    return 'both';
  });
  const [localSelectedTooth, setLocalSelectedTooth] = useState<string | null>(null);

  const selectedTooth = encounterContext ? encounterContext.selectedTooth : localSelectedTooth;
  const setSelectedTooth = (tooth: string | null) => {
    if (encounterContext) {
      encounterContext.setSelectedTooth(tooth);
    } else {
      setLocalSelectedTooth(tooth);
    }
  };

  // Tooth Editor Form States
  const [editorCondition, setEditorCondition] = useState<'H' | 'D' | 'F' | 'X' | 'C' | 'I'>('H');
  const [editorPlanned, setEditorPlanned] = useState<boolean>(false);
  const [editorPlannedDesc, setEditorPlannedDesc] = useState<string>('Surgical tooth extraction');
  const [editorNote, setEditorNote] = useState<string>('');

  if (!patient) return <div className="p-4 text-center text-gray-500">Patient not found</div>;

  // FDI Tooth Rows
  const upperPermanent = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'];
  const upperPrimary = ['55', '54', '53', '52', '51', '61', '62', '63', '64', '65'];
  const lowerPrimary = ['85', '84', '83', '82', '81', '71', '72', '73', '74', '75'];
  const lowerPermanent = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'];

  // Helper to get latest condition for a tooth
  const getToothCondition = (tooth: string): { code: 'H' | 'D' | 'F' | 'X' | 'C' | 'I'; note: string } => {
    const events = toothEvents
      .filter(e => e.patientId === patientId && e.toothNumber === tooth)
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());

    if (events.length > 0) {
      return { code: events[0].conditionCode, note: events[0].note || '' };
    }
    return { code: 'H', note: '' }; // default is Healthy
  };

  // Helper to get planned treatment for a tooth
  const getToothPlanned = (tooth: string): PlannedTreatment | undefined => {
    return plannedTreatments.find(pt => pt.patientId === patientId && pt.toothNumber === tooth && pt.status === 'planned');
  };

  const handleToothClick = (tooth: string) => {
    if (!interactive) return;
    const cond = getToothCondition(tooth);
    const planned = getToothPlanned(tooth);

    setSelectedTooth(tooth);
    setEditorCondition(cond.code);
    setEditorPlanned(!!planned);
    setEditorPlannedDesc(planned?.description || 'Surgical tooth extraction');
    setEditorNote(cond.note);
  };

  const handleSaveTooth = () => {
    if (!selectedTooth) return;

    // Save current condition event
    const oldCond = getToothCondition(selectedTooth);
    if (oldCond.code !== editorCondition || oldCond.note !== editorNote) {
      addToothEvent(patientId, selectedTooth, editorCondition, editorNote || `Updated condition to ${editorCondition}`);
    }

    // Save planned treatment
    const oldPlanned = getToothPlanned(selectedTooth);
    if (editorPlanned && !oldPlanned) {
      togglePlannedTreatment(patientId, selectedTooth, editorPlannedDesc, true);
    } else if (!editorPlanned && oldPlanned) {
      togglePlannedTreatment(patientId, selectedTooth, '', false);
    } else if (editorPlanned && oldPlanned && oldPlanned.description !== editorPlannedDesc) {
      // update treatment description by toggling off then on
      togglePlannedTreatment(patientId, selectedTooth, '', false);
      togglePlannedTreatment(patientId, selectedTooth, editorPlannedDesc, true);
    }

    setSelectedTooth(null);
  };

  // Color mappings based on condition
  const getConditionStyles = (code: 'H' | 'D' | 'F' | 'X' | 'C' | 'I') => {
    switch (code) {
      case 'H': // Healthy
        return 'bg-green-100 text-green-800 border-green-300';
      case 'D': // Decay
        return 'bg-red-100 text-red-800 border-red-300';
      case 'F': // Filled
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'X': // Extracted/missing
        return 'bg-gray-100 text-gray-500 border-dashed border-2 border-gray-300';
      case 'C': // Crown
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'I': // Implant
        return 'bg-teal-100 text-teal-800 border-teal-300';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const renderToothCell = (tooth: string) => {
    const isSelected = selectedTooth === tooth;
    const { code, note } = getToothCondition(tooth);
    const planned = getToothPlanned(tooth);
    const styles = getConditionStyles(code);

    return (
      <div
        key={tooth}
        id={`tooth-cell-${tooth}`}
        onClick={() => handleToothClick(tooth)}
        className={`relative flex flex-col items-center justify-center flex-1 aspect-[3/4] max-w-[3.5rem] sm:max-w-[4.5rem] lg:max-w-[5.5rem] min-w-[2rem] rounded-xl border shadow-sm transition-all select-none
          ${interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}
          ${styles}
          ${isSelected ? 'ring-4 ring-cyan-500 scale-105 border-cyan-500 z-10' : ''}
          ${planned ? 'ring-2 ring-amber-500 ring-offset-1' : ''}
        `}
        title={`Tooth ${tooth}: ${code} ${planned ? '(Planned: ' + planned.description + ')' : ''} ${note ? '- ' + note : ''}`}
      >
        {/* FDI Number at Top Left */}
        <span className="absolute top-1 left-1 lg:top-2 lg:left-2 text-[8px] sm:text-[9px] lg:text-[11px] font-mono tabular-nums font-semibold opacity-70">
          {tooth}
        </span>

        {/* Condition Letter Code in Center */}
        <span className="text-base sm:text-lg lg:text-2xl font-bold tracking-tight">
          {code}
        </span>

        {/* Planned Badge Overlay at Top Right (P) */}
        {planned && (
          <span className="absolute -top-1 -right-1 lg:top-1 lg:right-1 flex h-4 w-4 lg:h-5 lg:w-5 items-center justify-center rounded-full bg-amber-500 text-[9px] lg:text-[10px] font-bold text-white shadow-sm ring-1 ring-white">
            P
          </span>
        )}

        {/* Note indicator dot at the bottom if side note exists */}
        {note && (
          <span className="absolute bottom-1 lg:bottom-2 h-1 w-1 lg:h-1.5 lg:w-1.5 rounded-full bg-slate-500"></span>
        )}
      </div>
    );
  };

  return (
    <div id="odontogram-chart-container" className={noCard ? "flex flex-col w-full p-2" : "flex flex-col w-full bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm"}>
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-cyan-600" />
            Official PDA Odontogram (FDI Notation)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {interactive ? 'Tap any tooth cell to chart conditions, flag treatments, or add clinical notes.' : 'Visual clinical history chart. Touch is read-only.'}
          </p>
        </div>

        {/* Dentition Selector Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start">
          {(['permanent', 'both', 'primary'] as const).map(option => (
            <button
              key={option}
              id={`dentition-toggle-${option}`}
              onClick={() => setDentition(option)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all capitalize ${
                dentition === option
                  ? 'bg-white text-cyan-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {option === 'both' ? 'Both Jaws' : option}
            </button>
          ))}
        </div>
      </div>

      {/* ODONTOGRAM CHART STAGE */}
      <div className="w-full pb-4">
        <div className="w-full flex flex-col items-center gap-6 mx-auto">

          {/* UPPER JAW (Maxillary Arch) */}
          <div className="flex flex-col items-center gap-3 w-full">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Maxillary Arch (Upper Jaw)</span>

            {/* Upper Permanent Row (Quadrants 1 & 2) */}
            {(dentition === 'permanent' || dentition === 'both') && (
              <div className="flex w-full items-center justify-center gap-0.5 sm:gap-1 lg:gap-2">
                {upperPermanent.map((tooth, idx) => (
                  <React.Fragment key={tooth}>
                    {renderToothCell(tooth)}
                    {/* Midline gap separator between Quadrant 1 (left) and 2 (right) */}
                    {idx === 7 && <div className="w-2 sm:w-4 lg:w-8 border-l-2 border-dashed border-slate-300 h-16 mx-0.5 sm:mx-1"></div>}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Upper Primary/Deciduous Row (Quadrants 5 & 6) - nested inside */}
            {(dentition === 'primary' || dentition === 'both') && (
              <div className="flex w-full items-center justify-center gap-0.5 sm:gap-1 lg:gap-2 bg-slate-50/50 py-1.5 rounded-xl border border-slate-100">
                {upperPrimary.map((tooth, idx) => (
                  <React.Fragment key={tooth}>
                    {renderToothCell(tooth)}
                    {idx === 4 && <div className="w-2 sm:w-4 lg:w-8 border-l-2 border-dashed border-slate-300 h-16 mx-0.5 sm:mx-1"></div>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* INTERDENTAL OCCLUSAL MIDLINE */}
          <div className="w-full flex items-center justify-between border-t-2 border-slate-300 border-double my-1 relative">
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-0.5 text-[10px] font-bold text-slate-400 border border-slate-200 rounded-full uppercase tracking-widest">
              Occlusal line
            </span>
          </div>

          {/* LOWER JAW (Mandibular Arch) */}
          <div className="flex flex-col items-center gap-3 w-full">
            {/* Lower Primary/Deciduous Row (Quadrants 8 & 7) - nested inside */}
            {(dentition === 'primary' || dentition === 'both') && (
              <div className="flex w-full items-center justify-center gap-0.5 sm:gap-1 lg:gap-2 bg-slate-50/50 py-1.5 rounded-xl border border-slate-100">
                {lowerPrimary.map((tooth, idx) => (
                  <React.Fragment key={tooth}>
                    {renderToothCell(tooth)}
                    {idx === 4 && <div className="w-2 sm:w-4 lg:w-8 border-l-2 border-dashed border-slate-300 h-16 mx-0.5 sm:mx-1"></div>}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Lower Permanent Row (Quadrants 4 & 3) */}
            {(dentition === 'permanent' || dentition === 'both') && (
              <div className="flex w-full items-center justify-center gap-0.5 sm:gap-1 lg:gap-2">
                {lowerPermanent.map((tooth, idx) => (
                  <React.Fragment key={tooth}>
                    {renderToothCell(tooth)}
                    {idx === 7 && <div className="w-2 sm:w-4 lg:w-8 border-l-2 border-dashed border-slate-300 h-16 mx-0.5 sm:mx-1"></div>}
                  </React.Fragment>
                ))}
              </div>
            )}

            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase mt-1">Mandibular Arch (Lower Jaw)</span>
          </div>

        </div>
      </div>

      {/* CHART LEGEND */}
      <div className="mt-6 border-t border-slate-100 pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Grayscale-Safe Legend:</span>
        <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
          <span className="font-bold bg-green-200 text-green-800 rounded-xl px-1.5 py-0.5">H</span> Healthy
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
          <span className="font-bold bg-red-200 text-red-800 rounded-xl px-1.5 py-0.5">D</span> Decay (Cavity)
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          <span className="font-bold bg-blue-200 text-blue-800 rounded-xl px-1.5 py-0.5">F</span> Filled
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-gray-50 px-2.5 py-1 rounded-full border border-dashed border-gray-300">
          <span className="font-bold bg-gray-200 text-gray-500 rounded-xl px-1.5 py-0.5">X</span> Extracted
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
          <span className="font-bold bg-purple-200 text-purple-800 rounded-xl px-1.5 py-0.5">C</span> Crown
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
          <span className="font-bold bg-teal-200 text-teal-800 rounded-xl px-1.5 py-0.5">I</span> Implant
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300 ring-2 ring-amber-500">
          <span className="font-bold bg-amber-500 text-white rounded-full h-4 w-4 inline-flex items-center justify-center text-[9px]">P</span> Planned Work Overlay
        </div>
      </div>

      {/* BOTTOM SHEET EDITOR MODAL FOR CHAIRSIDE WORKFLOW */}
      <AnimatePresence>
        {selectedTooth && !noCard && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-end justify-center z-50 p-4" onClick={() => setSelectedTooth(null)}>
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-sm relative"
            >
              {/* Grab handle indicator for mobile bottom-sheet feel */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4"></div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-8 w-8 bg-cyan-100 text-cyan-800 flex items-center justify-center rounded-xl font-mono tabular-nums font-bold text-lg">
                    {selectedTooth}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-slate-800">Tooth Editor</h4>
                    <p className="text-xs text-slate-500">
                      FDI Location: {Number(selectedTooth) >= 50 ? 'Primary / Deciduous' : 'Permanent'} Tooth
                    </p>
                  </div>
                </div>
                <button
                  id="close-tooth-editor"
                  onClick={() => setSelectedTooth(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-5">
                {/* Condition Codes Choice */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Current Condition (Single-Select)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {([
                      { code: 'H', label: 'Healthy', styles: 'hover:bg-green-50 active:bg-green-100 border-green-200 text-green-700 bg-green-50/30' },
                      { code: 'D', label: 'Decay', styles: 'hover:bg-red-50 active:bg-red-100 border-red-200 text-red-700 bg-red-50/30' },
                      { code: 'F', label: 'Filled', styles: 'hover:bg-blue-50 active:bg-blue-100 border-blue-200 text-blue-700 bg-blue-50/30' },
                      { code: 'X', label: 'Missing', styles: 'hover:bg-slate-50 active:bg-slate-100 border-slate-200 text-slate-700 bg-slate-50/30' },
                      { code: 'C', label: 'Crown', styles: 'hover:bg-purple-50 active:bg-purple-100 border-purple-200 text-purple-700 bg-purple-50/30' },
                      { code: 'I', label: 'Implant', styles: 'hover:bg-teal-50 active:bg-teal-100 border-teal-200 text-teal-700 bg-teal-50/30' }
                    ] as const).map(item => {
                      const isChosen = editorCondition === item.code;
                      return (
                        <button
                          key={item.code}
                          id={`editor-condition-${item.code}`}
                          onClick={() => setEditorCondition(item.code)}
                          className={`flex flex-col items-center justify-center py-2 border rounded-xl font-semibold transition-all cursor-pointer h-14 ${item.styles}
                            ${isChosen ? 'ring-2 ring-cyan-500 ring-offset-1 border-cyan-500 font-bold bg-cyan-50 text-cyan-900 shadow-sm scale-105' : 'opacity-80'}
                          `}
                        >
                          <span className="text-base">{item.code}</span>
                          <span className="text-[10px] mt-0.5 opacity-90">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Planned Treatment (P Overlay) */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="editor-planned-checkbox"
                        checked={editorPlanned}
                        onChange={(e) => setEditorPlanned(e.target.checked)}
                        className="h-5 w-5 rounded-xl border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <label htmlFor="editor-planned-checkbox" className="text-sm font-bold text-slate-700 cursor-pointer">
                          Flag Planned Treatment (P Overlay)
                        </label>
                        <p className="text-xs text-slate-500">Planned work acts as an overlay and does not replace current condition.</p>
                      </div>
                    </div>
                    <span className="text-[10.5px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase">P-State</span>
                  </div>

                  {editorPlanned && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 bg-amber-50/40 border border-amber-200/60 p-3 rounded-xl space-y-2.5"
                    >
                      <label className="block text-xs font-semibold text-amber-800">
                        Select Planned Treatment Type:
                      </label>
                      <select
                        id="editor-planned-desc"
                        value={editorPlannedDesc}
                        onChange={(e) => setEditorPlannedDesc(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-2xl py-1.5 px-3 text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-slate-800 font-medium"
                      >
                        <option value="Surgical tooth extraction">Surgical tooth extraction</option>
                        <option value="Root canal treatment (RCT)">Root canal treatment (RCT)</option>
                        <option value="Composite filling restoration">Composite filling restoration</option>
                        <option value="Porcelain crown placement">Porcelain crown placement</option>
                        <option value="Titanium implant restoration">Titanium implant restoration</option>
                        <option value="Scaling and root planing">Scaling and root planing</option>
                      </select>
                    </motion.div>
                  )}
                </div>

                {/* Side Note */}
                <div className="border-t border-slate-100 pt-4">
                  <label htmlFor="editor-note" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Tooth Note / Diagnoses Side Note
                  </label>
                  <textarea
                    id="editor-note"
                    value={editorNote}
                    onChange={(e) => setEditorNote(e.target.value)}
                    placeholder="Enter clinical observations, sensitivity notes, or reference details..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 h-20 text-slate-800 font-medium"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    id="cancel-save-tooth"
                    onClick={() => setSelectedTooth(null)}
                    className="flex-1 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-bold text-sm text-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    id="save-tooth-changes"
                    onClick={handleSaveTooth}
                    className="flex-1 py-3 bg-cyan-700 hover:bg-cyan-800 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-sm hover:shadow-sm transition-all min-h-[44px]"
                  >
                    <Save className="h-4 w-4" />
                    Save Tooth State
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
