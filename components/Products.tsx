
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductsViewProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductsView: React.FC<ProductsViewProps> = ({ products, setProducts }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: 'CREATIVE' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      basePrice: parseFloat(formData.price) || 0,
      category: formData.category
    };
    setProducts([newProd, ...products]);
    setShowModal(false);
    setFormData({ name: '', price: '', category: 'CREATIVE' });
  };

  const deleteProduct = (id: string) => {
    if (window.confirm("Remove this service from catalog?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
           <div className="w-1.5 h-16 bg-[#4285F4]"></div>
           <div>
             <h1 className="text-4xl font-serif font-black tracking-tighter uppercase text-[#202124]">Price List</h1>
             <p className="text-[10px] font-bold text-[#5f6368] uppercase tracking-[0.4em] mt-1">Operational OS / Services</p>
           </div>
        </div>
        <button onClick={() => setShowModal(true)} className="w-full md:w-auto bg-[#4285F4] text-white px-10 py-5 rounded-sm font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#1967d2] transition-all transform active:scale-95">Add Service</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.length === 0 ? (
          <div className="col-span-full py-32 text-center text-[#bdc1c6] font-bold uppercase tracking-[0.5em] text-xs">Service catalog is currently empty</div>
        ) : (
          products.map(p => (
            <div key={p.id} className="bg-white p-8 border border-[#dadce0] rounded-xl hover:shadow-lg transition-all group">
               <div className="flex justify-between items-start mb-6">
                  <span className="text-[9px] font-black uppercase text-[#4285F4] tracking-widest bg-blue-50 px-3 py-1 rounded">{p.category}</span>
                  <button onClick={() => deleteProduct(p.id)} className="text-red-300 hover:text-[#EA4335] opacity-0 group-hover:opacity-100 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
               </div>
               <h3 className="text-xl font-bold text-[#202124] uppercase tracking-tight mb-4">{p.name}</h3>
               <div className="flex justify-between items-end pt-6 border-t border-[#f1f3f4]">
                  <div>
                    <p className="text-[9px] font-bold text-[#bdc1c6] uppercase tracking-widest">Base Rate (PKR)</p>
                    <p className="text-2xl font-black text-[#202124]">{p.basePrice.toLocaleString()}</p>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#202124]/90 backdrop-blur-md z-[500] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg p-12 rounded-lg shadow-2xl animate-in zoom-in duration-300">
             <h3 className="text-3xl font-serif font-black uppercase text-[#202124] mb-8">Define Service</h3>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#5f6368]">Service Title</label>
                  <input required className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded font-bold text-xs uppercase outline-none focus:border-[#4285F4]" placeholder="E.G. LOGO BRANDING" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#5f6368]">Standard Price</label>
                    <input required type="number" className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded font-bold text-xs outline-none focus:border-[#4285F4]" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#5f6368]">Group</label>
                    <select className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded font-bold text-xs outline-none focus:border-[#4285F4]" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="CREATIVE">CREATIVE</option>
                      <option value="STRATEGY">STRATEGY</option>
                      <option value="TECH">TECH/WEB</option>
                      <option value="MEDIA">MEDIA BUYING</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-[#5f6368] hover:bg-slate-50 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-[#4285F4] text-white text-[10px] font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all">Publish to Catalog</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsView;
