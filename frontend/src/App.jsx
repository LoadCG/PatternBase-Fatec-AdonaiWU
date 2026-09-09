import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';
const emptyForm = { name: '', description: '', technique: 'Digital', collection: '', colors: '', tags: '', status: 'Rascunho', image: null };

const colorFor = (item) => ({ '--c1': item.colors?.[0] || '#101828', '--c2': item.colors?.[1] || '#F4B942', '--c3': item.colors?.[2] || '#E76F51' });

export function App() {
  const [prints, setPrints] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const titleRef = useRef(null);
  const heroSvgRef = useRef(null);

  const loadPrints = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/prints`);
      if (!response.ok) throw new Error('Não foi possível carregar o acervo.');
      setPrints(await response.json());
      setError('');
    } catch (err) { setError(`${err.message} Verifique se a API está ligada.`); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    loadPrints();
    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reducedMotion) {
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro.fromTo(titleRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 });
        intro.fromTo('.hero-svg-frame', { scale: 0.86, opacity: 0, rotate: -6 }, { scale: 1, opacity: 1, rotate: 0, duration: 1 }, '-=0.55');
        gsap.to('.hero-orbit', { rotation: 360, transformOrigin: 'center', duration: 22, repeat: -1, ease: 'none' });
        gsap.to('.hero-float-a', { y: -12, x: 8, rotation: 8, duration: 3.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to('.hero-float-b', { y: 10, x: -7, rotation: -7, duration: 4.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to('.hero-spark', { scale: 0.7, opacity: 0.45, duration: 1.6, yoyo: true, repeat: -1, stagger: 0.25, transformOrigin: 'center' });
      } else {
        gsap.set([titleRef.current, '.hero-svg-frame'], { opacity: 1 });
      }
    }, heroSvgRef);
    return () => context.revert();
  }, []);

  const focusForm = () => document.getElementById('formulario').scrollIntoView({ behavior: 'smooth' });
  const updateField = (event) => { const { name, value, files } = event.target; setForm((current) => ({ ...current, [name]: files ? files[0] : value })); };
  const resetForm = () => { setEditingId(null); setForm(emptyForm); };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return setError('Informe um nome para a estampa.');
    setSaving(true); setError(''); setNotice('');
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'image' && !value) return;
        if (key === 'colors' || key === 'tags') payload.append(key, JSON.stringify(value.split(',').map((item) => item.trim()).filter(Boolean)));
        else payload.append(key, value);
      });
      const response = await fetch(editingId ? `${API_URL}/prints/${editingId}` : `${API_URL}/prints`, {
        method: editingId ? 'PUT' : 'POST',
        body: editingId ? JSON.stringify(Object.fromEntries(payload.entries())) : payload,
        headers: editingId ? { 'Content-Type': 'application/json' } : undefined
      });
      if (!response.ok) throw new Error('Não foi possível salvar a estampa.');
      resetForm(); await loadPrints(); setNotice(editingId ? 'Estampa atualizada com sucesso.' : 'Estampa cadastrada com sucesso.');
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const edit = (item) => { setEditingId(item._id); setForm({ ...item, colors: (item.colors || []).join(', '), tags: (item.tags || []).join(', '), image: null }); focusForm(); };
  const remove = async (id) => {
    if (!window.confirm('Excluir esta estampa? Essa ação não pode ser desfeita.')) return;
    setError(''); setNotice('Excluindo estampa...');
    const response = await fetch(`${API_URL}/prints/${id}`, { method: 'DELETE' });
    if (response.ok) { await loadPrints(); setNotice('Estampa excluída.'); } else { setError('Não foi possível excluir a estampa.'); setNotice(''); }
  };

  return <main className="shell">
    <nav className="nav" aria-label="Navegação principal"><span className="brand-mark">PB</span><span>PatternBase</span><span className="nav-caption">FATEC SJC · Programação Web</span></nav>
    <section className="hero"><div><p className="eyebrow">ACERVO DE ESTAMPAS</p><h1 ref={titleRef}>Ideias que viram <em>padrão.</em></h1><p className="hero-copy">Um espaço para organizar, explorar e dar vida a estampas autorais.</p><motion.button className="primary-button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={focusForm}>Nova estampa <span>↗</span></motion.button></div><div className="hero-art" ref={heroSvgRef}><svg className="hero-svg-frame" viewBox="0 0 520 420" role="img" aria-labelledby="hero-svg-title hero-svg-desc"><title id="hero-svg-title">Forma amarela inspirada em uma estampa</title><desc id="hero-svg-desc">Uma forma orgânica amarela com dois detalhes coloridos.</desc><path className="hero-yellow-shape" d="M78 112C105 43 198 28 285 54c92 27 164 4 190 73 28 75-24 172-94 218-67 43-177 48-248 4-74-45-83-157-55-237Z" fill="#F4B942"/><path className="hero-orbit" d="M112 226c54-86 184-124 292-38" fill="none" stroke="#F8F4E9" strokeWidth="2" opacity=".7"/><g className="hero-float-a"><circle cx="146" cy="132" r="64" fill="#E76F51"/><circle cx="146" cy="132" r="26" fill="#F8F4E9" opacity=".8"/></g><g className="hero-float-b"><circle cx="384" cy="174" r="54" fill="#2A9D8F"/><path d="M356 174h56M384 146v56" stroke="#F8F4E9" strokeWidth="9" strokeLinecap="round" opacity=".85"/></g><path className="hero-spark" d="M214 330c25-30 58-31 83-5-23 25-55 28-83 5Z" fill="#101828"/></svg></div></section>
    <section className="section-heading"><div><p className="eyebrow">ACERVO · {prints.length}</p><h2>Estampas recentes</h2></div><button className="ghost-button" onClick={focusForm}>+ Nova estampa</button></section>
    <div className="feedback" aria-live="polite">{notice && <p className="notice">{notice}</p>}{error && <p className="error" role="alert">{error}</p>}</div>
    <section className="cards" aria-label="Estampas recentes">{loading ? <p className="empty">Carregando acervo...</p> : prints.length === 0 ? <div className="empty-state"><p className="empty">Nenhuma estampa cadastrada ainda.</p><button className="ghost-button" onClick={focusForm}>Cadastrar a primeira</button></div> : prints.map((item) => <article className="card" key={item._id}><div className="card-art" style={colorFor(item)}>{item.imageUrl ? <img src={`${API_URL.replace('/api', '')}${item.imageUrl}`} alt={`Prévia da estampa ${item.name}`} /> : <span aria-hidden="true">✳</span>}</div><div className="card-content"><div className="card-meta"><span>{item.technique}</span><span className="status">{item.status}</span></div><h3>{item.name}</h3><p>{item.collection || 'Sem coleção'} · {(item.colors || []).length} cores</p><div className="card-actions"><button onClick={() => edit(item)} aria-label={`Editar ${item.name}`}>Editar</button><button onClick={() => remove(item._id)} aria-label={`Excluir ${item.name}`}>Excluir</button></div></div></article>)}</section>
    <section id="formulario" className="form-section"><p className="eyebrow">{editingId ? 'EDIÇÃO' : 'CADASTRO'}</p><h2>{editingId ? 'Atualizar estampa' : 'Adicionar ao acervo'}</h2><p className="form-help">Campos com * são obrigatórios. Separe cores e tags por vírgula.</p><form onSubmit={submit} className="print-form"><label>Nome da estampa *<input name="name" value={form.name} onChange={updateField} placeholder="Ex.: Botânica Tropical" required /></label><label>Descrição<textarea name="description" value={form.description} onChange={updateField} placeholder="Conte brevemente a ideia da estampa" rows="3" /></label><div className="form-grid"><label>Técnica<input name="technique" value={form.technique} onChange={updateField} placeholder="Ex.: Serigrafia" /></label><label>Coleção<input name="collection" value={form.collection} onChange={updateField} placeholder="Ex.: Verão 2026" /></label></div><div className="form-grid"><label>Cores<input name="colors" value={form.colors} onChange={updateField} placeholder="#101828, #F4B942" /></label><label>Tags<input name="tags" value={form.tags} onChange={updateField} placeholder="floral, verão" /></label></div><div className="form-grid"><label>Status<select name="status" value={form.status} onChange={updateField}><option>Rascunho</option><option>Em revisão</option><option>Publicado</option></select></label><label>Imagem · padrão 1080×1440 px<input name="image" type="file" accept="image/*" onChange={updateField} /></label></div><div className="form-buttons"><button className="primary-button" disabled={saving}>{saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Cadastrar estampa'}</button>{editingId && <button type="button" className="ghost-button" onClick={resetForm}>Cancelar edição</button>}</div></form></section>
    <footer className="footer"><div className="footer-about"><p className="eyebrow">SOBRE O PROJETO</p><h2>PatternBase</h2><p>Projeto acadêmico desenvolvido por <strong>Cauan Gabriel da Silva Resende Nascimento</strong>.</p><p className="footer-muted">Tecnologia em Análise e Desenvolvimento de Sistemas · 4º Semestre</p></div><div><p className="footer-title">Formação</p><p>FATEC São José dos Campos<br />Prof. Jessen Vidal</p><p>Programação Web · 2026<br />Prof. Carlos Henrique Loureiro Feichas</p></div><div><p className="footer-title">Contato e redes</p><div className="social-links"><a href="https://github.com/LoadCG" target="_blank" rel="noreferrer">GitHub</a><a href="https://linkedin.com/in/cauangabrielsrn" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://instagram.com/cauangabrielresende" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.behance.net/cauansilva1" target="_blank" rel="noreferrer">Behance</a><a href="https://cauangabriel.com.br/" target="_blank" rel="noreferrer">Portfólio</a></div><a className="footer-email" href="mailto:cauangabrielfac@gmail.com">cauangabrielfac@gmail.com</a><a className="footer-email" href="mailto:cauan.nascimento@aluno.cps.sp.gov.br">E-mail acadêmico</a></div></footer>
  </main>;
}
