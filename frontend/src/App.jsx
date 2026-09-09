import { useEffect, useRef } from 'react';
import { animate, motion } from 'motion/react';
import { gsap } from 'gsap';

const examples = [
  { name: 'Botânica Tropical', technique: 'Serigrafia', status: 'Publicado', colors: ['#F4B942', '#E76F51', '#2A9D8F'] },
  { name: 'Geometria Solar', technique: 'Digital', status: 'Em revisão', colors: ['#101828', '#F4B942', '#F8F4E3'] },
  { name: 'Maré Gráfica', technique: 'Aquarela', status: 'Rascunho', colors: ['#457B9D', '#A8DADC', '#F1FAEE'] }
];

export function App() {
  const titleRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(titleRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
  }, []);

  return (
    <main className="shell">
      <nav className="nav"><span className="brand-mark">PB</span><span>PatternBase</span><span className="nav-caption">FATEC SJC · Programação Web</span></nav>
      <section className="hero">
        <div>
          <p className="eyebrow">ACERVO DE ESTAMPAS</p>
          <h1 ref={titleRef}>Ideias que viram <em>padrão.</em></h1>
          <p className="hero-copy">Um espaço para organizar, explorar e dar vida a estampas autorais.</p>
          <motion.button className="primary-button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => animate(window, { scrollY: 560 }, { duration: 0.6 })}>Explorar acervo <span>↗</span></motion.button>
        </div>
        <div className="hero-art" aria-label="Composição abstrata de formas e cores" role="img"><span className="shape shape-one" /><span className="shape shape-two" /><span className="shape shape-three" /><span className="shape shape-four" /></div>
      </section>
      <section className="section-heading"><div><p className="eyebrow">DESTAQUES</p><h2>Estampas recentes</h2></div><button className="ghost-button">+ Nova estampa</button></section>
      <section className="cards" aria-label="Estampas recentes">{examples.map((item) => <article className="card" key={item.name}><div className="card-art" style={{ '--c1': item.colors[0], '--c2': item.colors[1], '--c3': item.colors[2] }}><span>✳</span></div><div className="card-content"><div className="card-meta"><span>{item.technique}</span><span className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span></div><h3>{item.name}</h3><p>Paleta {item.colors.length} cores · coleção experimental</p></div></article>)}</section>
    </main>
  );
}

