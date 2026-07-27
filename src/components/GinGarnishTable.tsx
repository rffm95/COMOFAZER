import { GinGarnish } from '../types';
import { Leaf, Bottle as BottleIcon } from 'lucide-react';

interface GinGarnishTableProps {
  data: GinGarnish[];
  searchQuery: string;
}

export default function GinGarnishTable({ data, searchQuery }: GinGarnishTableProps) {
  const filtered = data.filter(item => 
    item.gin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tonica.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.garnish.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Gin Premium</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tónica</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Garnish Recomendado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="font-black text-white uppercase italic tracking-tight group-hover:text-amber-500 transition-colors">{item.gin}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                      item.tonica === '1724' 
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.tonica}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></div>
                      {item.garnish}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center text-slate-600 italic uppercase tracking-widest text-sm font-bold">
                    Nenhum gin encontrado para "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-start gap-4">
        <div className="mt-0.5 text-amber-500/50">
          <InfoIcon size={20} />
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed uppercase tracking-wider font-bold">
          <span className="text-amber-500">Política de Serviço:</span> Em todos os casos onde a receita indicava "Fever Tree", a mesma foi atualizada para <span className="text-white">"1724"</span> para garantir o padrão de qualidade Cheers.
        </p>
      </div>
    </div>
  );
}

function InfoIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  );
}
