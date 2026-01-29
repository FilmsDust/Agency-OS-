
import React, { useState } from 'react';
import { Project, Client } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  clients: Client[];
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, setProjects, clients }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ clientId: '', title: '', budget: '', deadline: '' });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === formData.clientId);
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: formData.clientId,
      clientName: client?.name || 'Unknown',
      title: formData.title,
      budget: parseFloat(formData.budget) || 0,
      status: 'PLANNING',
      progress: 0,
      deadline: formData.deadline
    };
    setProjects([newProject, ...projects]);
    setShowModal(false);
    setFormData({ clientId: '', title: '', budget: '', deadline: '' });
  };

  const updateProgress = (id: string, progress: number) => {
    setProjects(projects.map(p => p.id === id ? { ...p, progress, status: progress === 100 ? 'COMPLETED' : 'ACTIVE' } : p));
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="bg-white p-10 rounded-3xl border border-[#dadce0] shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
           <h2 className="text-4xl font-serif font-black text-[#202124] uppercase tracking-tighter leading-none">Projects</h2>
           <p className="text-[#4285F4] font-bold text-xs uppercase tracking-[0.4em] mt-3">Active Operational Workload</p>
        </div>
        <button onClick={() => setShowModal(true)} className="w-full md:w-auto bg-[#4285F4] text-white px-10 py-5 rounded-xl font-bold uppercase text-xs tracking-widest shadow-xl hover:bg-[#1967d2] transition-all">Initiate Project</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.length === 0 ? (
          <div className="col-span-full py-48 text-center text-[#bdc1c6] font-bold uppercase tracking-[1em] text-xs">No Active Campaigns</div>
        ) : (
          projects.map(project => (
            <div key={project.id} className="bg-white p-10 rounded-3xl border border-[#dadce0] shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
               <div className={`absolute top-0 left-0 w-2 h-full ${project.status === 'COMPLETED' ? 'bg-[#34A853]' : 'bg-[#4285F4]'}`}></div>
               
               <div className="flex justify-between items-start mb-8">
                  <span className="text-[10px] font-black text-[#4285F4] uppercase tracking-widest">{project.status}</span>
                  <span className="text-[10px] font-bold text-[#bdc1c6] uppercase">{project.deadline}</span>
               </div>

               <h3 className="text-3xl font-serif font-black text-[#202124] uppercase tracking-tighter leading-none mb-4 group-hover:text-[#4285F4] transition-colors">{project.title}</h3>
               <p className="text-[11px] font-bold text-[#5f6368] uppercase tracking-widest mb-10">{project.clientName}</p>

               <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                     <span className="text-[#bdc1c6]">Completion State</span>
                     <span className="text-[#202124]">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-[#f1f3f4] h-3 rounded-full overflow-hidden">
                     <div className="bg-[#4285F4] h-full rounded-full transition-all duration-700" style={{ width: `${project.progress}%` }}></div>
                  </div>
               </div>

               <div className="flex gap-2 mt-10 opacity-0 group-hover:opacity-100 transition-all">
                  {[25, 50, 75, 100].map(val => (
                    <button key={val} onClick={() => updateProgress(project.id, val)} className="flex-1 py-2 bg-slate-50 border border-[#dadce0] rounded-lg text-[9px] font-black text-[#5f6368] hover:bg-[#4285F4] hover:text-white transition-all">{val}%</button>
                  ))}
               </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#202124]/90 backdrop-blur-xl z-[500] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg p-12 rounded-[2.5rem] shadow-2xl border-t-[16px] border-[#4285F4] animate-in zoom-in duration-300">
             <h3 className="text-4xl font-serif font-black text-[#202124] uppercase tracking-tighter mb-10">Project Initiation</h3>
             <form onSubmit={handleAddProject} className="space-y-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-[#5f6368] uppercase tracking-widest">Partner Selection</label>
                   <select required className="w-full p-5 bg-[#f8f9fa] border-2 border-[#dadce0] font-black text-sm uppercase outline-none focus:border-[#4285F4] rounded-2xl transition-all" value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
                     <option value="">Select Partner...</option>
                     {clients.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                   </select>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-[#5f6368] uppercase tracking-widest">Project Title</label>
                   <input required className="w-full p-5 bg-[#f8f9fa] border-2 border-[#dadce0] font-black text-sm uppercase outline-none focus:border-[#4285F4] rounded-2xl transition-all" placeholder="E.G. Q4 SOCIAL STRATEGY" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-[#5f6368] uppercase tracking-widest">Budget (PKR)</label>
                     <input required type="number" className="w-full p-5 bg-[#f8f9fa] border-2 border-[#dadce0] font-black text-sm outline-none focus:border-[#4285F4] rounded-2xl transition-all" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-[#5f6368] uppercase tracking-widest">Delivery Deadline</label>
                     <input required type="date" className="w-full p-5 bg-[#f8f9fa] border-2 border-[#dadce0] font-black text-sm outline-none focus:border-[#4285F4] rounded-2xl transition-all" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-4 pt-8">
                   <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 font-black text-[#5f6368] uppercase text-xs tracking-widest hover:bg-[#f8f9fa] rounded-xl transition-all">Discard</button>
                   <button type="submit" className="flex-1 bg-[#202124] text-white py-5 font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-black rounded-xl transition-all">Seal & Initiate</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsView;
