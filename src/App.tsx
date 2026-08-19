import { useCallback, useRef, useState } from 'react';
import { FileText, Download, Image as ImageIcon, Loader2, LayoutTemplate, Edit3, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CVForm from '@/components/CVForm';
import CVPreview, { type CVPreviewHandle } from '@/components/CVPreview';
import { themes, themeOrder } from '@/themes';
import { emptyCV, type CVData, type TemplateId } from '@/types/types';

const MM_TO_PX = 96 / 25.4;

export default function App() {
  const [data, setData] = useState<CVData>(emptyCV);
  const [template, setTemplate] = useState<TemplateId>('modern');
  const [busy, setBusy] = useState<'pdf' | 'png' | null>(null);
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');

  const previewRef = useRef<CVPreviewHandle>(null);
  const captureRef = useRef<CVPreviewHandle>(null);

  const theme = themes[template];

  const captureCanvas = useCallback(async () => {
    const el = captureRef.current?.getPageEl();
    if (!el) throw new Error('Aperçu indisponible');
    return html2canvas(el, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#FFFFFF',
      windowWidth: Math.round(210 * MM_TO_PX),
      windowHeight: Math.round(297 * MM_TO_PX),
    });
  }, []);

  const handlePDF = useCallback(async () => {
    setBusy('pdf');
    try {
      const canvas = await captureCanvas();
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297, undefined, 'FAST');
      pdf.save('mon-cv.pdf');
    } catch (e) {
      console.error(e);
      alert('La génération du PDF a échoué.');
    } finally {
      setBusy(null);
    }
  }, [captureCanvas]);

  const handlePNG = useCallback(async () => {
    setBusy('png');
    try {
      const canvas = await captureCanvas();
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'mon-cv.png';
      link.click();
    } catch (e) {
      console.error(e);
      alert('La génération du PNG a échoué.');
    } finally {
      setBusy(null);
    }
  }, [captureCanvas]);

  return (
    <div className="h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Top bar */}
      <header className="no-print shrink-0 bg-white border-b border-slate-200">
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div className="leading-tight">
              <h1 className="text-sm font-bold tracking-tight">CV Studio</h1>
              <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">Générateur de CV — format A4</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Template switcher */}
            <div className="hidden sm:flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              {themeOrder.map((id) => (
                <button
                  key={id}
                  onClick={() => setTemplate(id)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition flex items-center gap-1.5 ${
                    template === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LayoutTemplate className="w-3.5 h-3.5" />
                  {themes[id].name}
                </button>
              ))}
            </div>

            <div className="w-px h-6 bg-slate-200 hidden sm:block" />

            <button
              onClick={handlePNG}
              disabled={busy !== null}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {busy === 'png' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">PNG</span>
            </button>
            <button
              onClick={handlePDF}
              disabled={busy !== null}
              className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {busy === 'pdf' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              PDF
            </button>
          </div>
        </div>

        {/* Mobile template switcher */}
        <div className="sm:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
          {themeOrder.map((id) => (
            <button
              key={id}
              onClick={() => setTemplate(id)}
              className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded-md transition ${
                template === id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {themes[id].name}
            </button>
          ))}
        </div>
      </header>

      {/* Mobile view toggle */}
      <div className="no-print sm:hidden shrink-0 flex border-b border-slate-200 bg-white">
        <button
          onClick={() => setMobileView('edit')}
          className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 ${mobileView === 'edit' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400'}`}
        >
          <Edit3 className="w-3.5 h-3.5" /> Éditer
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 ${mobileView === 'preview' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400'}`}
        >
          <Eye className="w-3.5 h-3.5" /> Aperçu
        </button>
      </div>

      {/* Main split */}
      <div className="flex-1 min-h-0 flex">
        {/* Editor */}
        <aside
          className={`no-print w-full sm:w-[440px] sm:shrink-0 border-r border-slate-200 bg-white overflow-y-auto ${
            mobileView === 'edit' ? 'block' : 'hidden sm:block'
          }`}
        >
          <div className="p-5">
            <CVForm data={data} onChange={setData} />
            <div className="h-8" />
          </div>
        </aside>

        {/* Preview */}
        <main className={`flex-1 min-w-0 ${mobileView === 'preview' ? 'block' : 'hidden sm:block'}`}>
          <CVPreview ref={previewRef} data={data} template={template} />
        </main>
      </div>

      {/* Hidden full-size A4 for capture (no fit scaling, pure 210x297mm) */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: '-99999px',
          top: 0,
          width: `${210}mm`,
          height: `${297}mm`,
          pointerEvents: 'none',
          opacity: 0,
        }}
      >
        <CVPreview ref={captureRef} data={data} template={template} captureMode />
      </div>
    </div>
  );
}
