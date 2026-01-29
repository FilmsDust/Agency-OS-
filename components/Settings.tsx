
import React, { useState } from 'react';
import { AgencySettings } from '../types';

const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<AgencySettings>(() => {
    const saved = localStorage.getItem('ag_settings');
    return saved ? JSON.parse(saved) : {
      name: 'Adverts Gen',
      tagline: 'Creative Agency',
      phone: '03005422109',
      email: 'billing@advertsgen.com',
      address: 'Islamabad, Pakistan',
      bankDetails: 'Meezan Bank G 8 Islamabad - Title: Digital Adverts Gen SMC Pvt Ltd. - A/C: 0319 010 7212 176',
      gstNumber: 'GST-99221-A'
    };
  });

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ag_settings', JSON.stringify(settings));
    alert("AGENCY CORE SETTINGS SYNCHRONIZED");
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex items-center gap-6">
         <div className="w-1.5 h-16 bg-[#202124]"></div>
         <div>
           <h1 className="text-4xl font-serif font-black tracking-tighter uppercase text-[#202124]">Global Configuration</h1>
           <p className="text-[10px] font-bold text-[#5f6368] uppercase tracking-[0.4em] mt-1">Agency Identity & Rules</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#dadce0] p-10 shadow-sm">
          <form onSubmit={saveSettings} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#5f6368]">Agency Name</label>
                <input className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-xl font-bold text-xs uppercase outline-none focus:border-[#4285F4]" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#5f6368]">Tagline/Niche</label>
                <input className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-xl font-bold text-xs uppercase outline-none focus:border-[#4285F4]" value={settings.tagline} onChange={e => setSettings({...settings, tagline: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#5f6368]">Official Contact</label>
                <input className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-xl font-bold text-xs outline-none focus:border-[#4285F4]" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#5f6368]">Finance Email</label>
                <input className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-xl font-bold text-xs outline-none focus:border-[#4285F4]" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#5f6368]">Bank Settlement Instructions</label>
              <textarea rows={3} className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-xl font-bold text-xs outline-none focus:border-[#4285F4]" value={settings.bankDetails} onChange={e => setSettings({...settings, bankDetails: e.target.value})} />
            </div>

            <div className="flex justify-end pt-6">
              <button type="submit" className="bg-[#202124] text-white px-12 py-5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all active:scale-95">Update Configuration</button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
           <div className="bg-[#f8f9fa] p-8 rounded-3xl border border-[#dadce0]">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 text-[#202124]">Quick Settings</h4>
              <div className="space-y-4">
                 {['Invoice Template Settings', 'Payment Mode Settings', 'Currency & Locale', 'Data Export / CSV'].map((s, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#dadce0] cursor-pointer hover:border-[#4285F4] transition-all group">
                     <span className="text-[10px] font-bold text-[#5f6368] uppercase group-hover:text-[#4285F4]">{s}</span>
                     <svg className="w-4 h-4 text-[#dadce0]" fill="currentColor" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-[#EA4335]/5 p-8 rounded-3xl border border-[#EA4335]/20">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-[#EA4335]">Danger Zone</h4>
              <button className="w-full text-left p-4 bg-white text-[#EA4335] border border-[#EA4335]/20 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#EA4335] hover:text-white transition-all">Clear All Financial Records</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
