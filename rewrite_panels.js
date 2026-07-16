const fs = require('fs');
const file = 'components/workspace-panels.tsx';
let content = fs.readFileSync(file, 'utf8');

const demoStart = content.indexOf('export function PatientDemographicsPanel() {');
const medStart = content.indexOf('export function MedicalHistoryPanel() {');
const legalStart = content.indexOf('export function LegalConsentPanel() {');
const encHistoryStart = content.indexOf('export function EncounterHistoryPanel() {');

// Extract chunks based on these known starts.
let newContent = content.substring(0, demoStart);

newContent += `export function PatientDemographicsPanel() {
  const { patients } = useClinic();
  const { activePatientId } = useActivePatient();
  const patient = patients.find(p => p.id === activePatientId);

  if (!patient) return null;

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Demographic Records</h4>
      </div>
      <div className="p-4 space-y-2 text-sm text-slate-700 flex-1 overflow-y-auto">
        <div><span className="font-semibold text-slate-500 w-24 inline-block">Record ID:</span> {patient.id}</div>
        <div><span className="font-semibold text-slate-500 w-24 inline-block">Full Name:</span> {patient.name}</div>
        <div><span className="font-semibold text-slate-500 w-24 inline-block">Birth Date:</span> {patient.dateOfBirth}</div>
        <div><span className="font-semibold text-slate-500 w-24 inline-block">Sex:</span> {patient.sex}</div>
        <div><span className="font-semibold text-slate-500 w-24 inline-block">Contact:</span> {patient.contact}</div>
        <div><span className="font-semibold text-slate-500 w-24 inline-block">Address:</span> {patient.address}</div>
      </div>
    </div>
  );
}

`;

newContent += `export function MedicalHistoryPanel() {
  const { medicalAnswers, allergies } = useClinic();
  const { activePatientId } = useActivePatient();

  const answers = medicalAnswers.filter(a => a.patientId === activePatientId && a.answer);
  const patientAllergies = allergies.filter(a => a.patientId === activePatientId);

  if (!activePatientId) return null;

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Medical & Allergy Logs</h4>
      </div>
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {patientAllergies.length > 0 && (
          <div className="text-red-700 text-sm font-bold bg-red-50 p-3 rounded border border-red-100">
            Allergies: {patientAllergies.map(a => a.substance).join(', ')}
          </div>
        )}
        <div className="space-y-2 text-sm text-slate-700">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Medical History</span>
          {answers.length > 0 ? answers.map(a => (
            <div key={a.questionId}>⚠️ {a.notes || 'Condition noted'}</div>
          )) : "No significant medical history reported."}
        </div>
      </div>
    </div>
  );
}

`;

// Keep everything after LegalConsentPanel as is, except maybe replacing it too? Let's just replace LegalConsentPanel as well.
newContent += `export function LegalConsentPanel() {
  const { consents } = useClinic();
  const { activePatientId } = useActivePatient();
  const patientConsents = consents.filter(c => c.patientId === activePatientId);

  if (!activePatientId) return null;

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Legal Consents</h4>
      </div>
      <div className="p-4 space-y-3 flex-1 overflow-y-auto text-sm">
        {patientConsents.map(c => (
          <div key={c.type} className="flex items-center gap-2 text-emerald-700 font-medium bg-emerald-50 p-2 rounded">
            <CheckCircle className="h-4 w-4" /> {c.type.replace('_', ' ')}
          </div>
        ))}
      </div>
    </div>
  );
}

`;

newContent += content.substring(encHistoryStart);

fs.writeFileSync(file, newContent);
console.log('Successfully rewrote panels.');
