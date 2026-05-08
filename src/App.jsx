import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase } from './lib/supabase'
import {
  Shield, Scale, Building2, FileText, Users, Briefcase, Home,
  CheckCircle2, MapPin, Phone, Mail, ArrowRight, Gavel, Target, Zap, Award,
  Star, ChevronLeft, ChevronRight, Plus, Minus, ChevronDown
} from 'lucide-react'
import BlogCard from './components/BlogCard'
import { PrivateRoute } from './components/PrivateRoute'
import SEO from './components/SEO'

const BlogList = React.lazy(() => import('./pages/BlogList'))
const BlogArticle = React.lazy(() => import('./pages/BlogArticle'))
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'))

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen w-full bg-primary text-metallic">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallic"></div>
  </div>
)

gsap.registerPlugin(ScrollTrigger)

/* ========================================
   SCROLL TO TOP ON ROUTE CHANGE
   ======================================== */
function useScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
}

/* ========================================
   NAVBAR
   ======================================== */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const blogPaths = ['/blog', '/admin', '/blog/']
  const isBlogRoute = blogPaths.some((p) => location.pathname.startsWith(p))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = useMemo(() => [
    { label: 'Sobre', href: '#sobre' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contato', href: '#contato' },
  ], [])

  const isHomePage = location.pathname === '/'

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled || isBlogRoute
            ? 'bg-[#01060b]/95 backdrop-blur-sm shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          {isHomePage ? (
            <a href="#hero" className="flex items-center gap-3">
              <img src="/logob.webp" alt="LFC" width="32" height="32" className="h-8 w-auto" />
              <span className="font-heading text-lg font-bold text-white">
                Lu&iacute;s Felipe Advocacia
              </span>
            </a>
          ) : (
            <Link to="/" className="flex items-center gap-3">
              <img src="/logob.webp" alt="LFC" width="32" height="32" className="h-8 w-auto" />
              <span className="font-heading text-lg font-bold text-white">
                Lu&iacute;s Felipe Advocacia
              </span>
            </Link>
          )}

          <ul className="hidden lg:flex items-center gap-7 ml-auto">
            {links.map((l) => (
              <li key={l.href + l.label}>
                {l.href.startsWith('#') ? (
                  <a
                    href={isHomePage ? l.href : `/${l.href}`}
                    className="text-sm tracking-tight transition-colors hover:text-metallic font-medium text-white/80"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    to={l.href}
                    className={`text-sm tracking-tight transition-colors hover:text-metallic font-medium text-white/80 ${
                      location.pathname === l.href ? 'text-metallic' : ''
                    }`}
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-primary flex flex-col items-center justify-center gap-8 lg:hidden">
          {links.map((l) => (
            l.href.startsWith('#') ? (
              <a
                key={l.label}
                href={isHomePage ? l.href : `/${l.href}`}
                className="text-2xl text-white hover:text-metallic transition-colors font-heading"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                to={l.href}
                className="text-2xl text-white hover:text-metallic transition-colors font-heading"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            )
          ))}
        </div>
      )}
    </>
  )
}

/* ========================================
   HERO
   ======================================== */
function Hero() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-el', {
        y: 30, opacity: 0, duration: 0.9, stagger: 0.12,
        ease: 'power2.out',
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex items-end lg:items-center bg-primary overflow-hidden">
      <div className="absolute inset-0 bg-hero-img bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative z-10 w-full pt-20 pb-10 lg:pt-0 lg:pb-0">
        <div className="w-full flex justify-center lg:justify-start" style={{ paddingLeft: 'max(24px, calc(50% - 650px))' }}>
          <div className="h-1 w-20 bg-metallic-gradient rounded" />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <p className="hero-el text-white/60 text-[10px] lg:text-sm tracking-widest uppercase mb-6 font-medium">
              Advocacia e Assessoria Jur&iacute;dica &bull; OAB/MG
            </p>
            <h1 className="hero-el font-heading text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-6 text-white">
              Servi&ccedil;os Jur&iacute;dicos e<br />
              Assessoria em <span className="text-metallic-gradient">Leil&otilde;es</span>
            </h1>
            <p className="hero-el text-white/60 text-base max-w-xl mb-10 leading-relaxed">
              Atua&ccedil;&atilde;o em diversas &aacute;reas do Direito com experi&ecirc;ncia em leil&otilde;es judiciais de im&oacute;veis em todo o Brasil.
            </p>
            <div className="hero-el flex flex-col sm:flex-row items-start gap-4">
              <a
                href="https://wa.me/5533998302939?text=Olá, Dr. Luís Felipe. Gostaria de solicitar contato."
                target="_blank" rel="noopener noreferrer"
                className="group bg-transparent text-white font-semibold px-8 py-4 rounded border border-white/20 hover:border-metallic transition-all flex items-center gap-2 text-base"
              >
                Entre em contato
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
            <p className="hero-el text-white/40 text-sm mt-8 tracking-wide">
              OAB/MG | 10 anos de atua&ccedil;&atilde;o
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========================================
   ABOUT
   ======================================== */
function About() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-item', {
        y: 30, opacity: 0, duration: 0.7, stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="sobre" ref={ref} className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
          <div className="about-item max-w-sm mx-auto md:mx-0">
            <div className="w-full aspect-[3/4] relative rounded-lg overflow-hidden shadow-2xl border border-metallic/20 group">
              <img
                src="/luis5.webp"
                alt="Dr. Luís Felipe, advogado em Governador Valadares"
                width="384"
                height="512"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
            </div>
          </div>
          <div>
            <p className="about-item text-metallic text-xs font-bold tracking-widest uppercase mb-3">Apresenta&ccedil;&atilde;o</p>
            <h2 className="about-item font-heading text-2xl md:text-3xl lg:text-4xl text-dark font-bold leading-tight mb-6">
              Sobre o <span className="text-metallic italic">profissional</span>
            </h2>
            <p className="about-item text-gray-600 mb-4 leading-relaxed">
              Advogado inscrito na OAB/MG, com atua&ccedil;&atilde;o h&aacute; 10 anos nas &aacute;reas c&iacute;vel, criminal, fam&iacute;lia, trabalhista, previdenci&aacute;ria, consumidor e imobili&aacute;ria.
            </p>
            <p className="about-item text-gray-600 mb-4 leading-relaxed">
              S&oacute;cio de escrit&oacute;rio de advocacia sediado em Governador Valadares/MG, com atendimento presencial e remoto para clientes em todo o territ&oacute;rio nacional.
            </p>
            <p className="about-item text-gray-600 mb-8 leading-relaxed">
              Experi&ecirc;ncia espec&iacute;fica em leil&otilde;es judiciais de im&oacute;veis, com presta&ccedil;&atilde;o de servi&ccedil;os que abrangem an&aacute;lise de editais, orienta&ccedil;&atilde;o sobre procedimentos e acompanhamento de regulariza&ccedil;&atilde;o de bens arrematados.
            </p>
            <a
              href="#contato"
              className="about-item inline-block border-2 border-dark text-dark font-semibold px-6 py-3 rounded hover:bg-dark hover:text-white transition-colors"
            >
              Conheça meu trabalho
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========================================
   DIFERENCIAIS
   ======================================== */
function DiffCards() {
  const ref = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.diff-card-wrapper', { y: 60, opacity: 0, scale: 0.92, rotationX: -15 })
      gsap.to('.diff-card-wrapper', {
        y: 0, opacity: 1, scale: 1, rotationX: 0,
        duration: 0.8, stagger: 0.15, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e, card) => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -10
    const rotateY = ((x - centerX) / centerX) * 10
    card.style.transition = 'none'
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transition = 'transform 0.5s ease'
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  const items = [
    {
      icon: <Target size={28} />,
      title: 'Atuação Estratégica, Não Operacional',
      desc: 'Não trabalho apenas com o processo. Trabalho com a solução. Cada caso recebe análise técnica aprofundada e condução objetiva rumo ao melhor resultado possível.',
    },
    {
      icon: <Zap size={28} />,
      title: 'Resposta Rápida e Comunicação Clara',
      desc: 'Transparência total. Você sempre saberá o que está acontecendo, quais são as opções e qual o próximo passo.',
    },
    {
      icon: <Award size={28} />,
      title: 'Experiência Consolidada em Casos Complexos',
      desc: '10 anos resolvendo conflitos judiciais e extrajudiciais em áreas diversas: cível, criminal, família, trabalhista, previdenciário, imobiliário e consumidor.',
    },
    {
      icon: <Building2 size={28} />,
      title: 'Referência Nacional em Leilões Judiciais',
      desc: 'Assessoria completa do edital à escritura: análise de riscos, estratégia de arrematação e regularização do imóvel adquirido.',
    },
  ]

  return (
    <section id="diferenciais" ref={ref} className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-metallic text-xs font-bold tracking-widest uppercase mb-3">Diferenciais</p>
          <h2 className="font-heading text-2xl md:text-4xl text-dark font-bold">
            Por que escolher Dr. Lu&iacute;s Felipe
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {items.map((item, i) => (
            <div key={i} className="diff-card-wrapper" ref={(el) => (cardRefs.current[i] = el)}>
              <div
                className="diff-card h-full p-8 rounded-xl border relative overflow-hidden cursor-pointer shadow-md transition-shadow duration-300 bg-white border-gray-100 hover:shadow-xl hover:border-metallic/40"
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-metallic/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="mb-5 inline-flex p-3 rounded-lg transition-transform duration-300 hover:scale-110 hover:rotate-6 bg-metallic/10 text-metallic">
                    {item.icon}
                  </div>
                  <h3 className="font-heading text-lg lg:text-xl font-bold leading-snug mb-3 transition-colors duration-300 text-dark hover:text-metallic">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ========================================
   SERVIÇOS
   ======================================== */
function Services() {
  const ref = useRef(null)
  const svcRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.svc-wrapper', { y: 60, opacity: 0, scale: 0.92, rotationX: -15 })
      gsap.to('.svc-wrapper', {
        y: 0, opacity: 1, scale: 1, rotationX: 0,
        duration: 0.8, stagger: 0.12, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e, card) => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -10
    const rotateY = ((x - centerX) / centerX) * 10
    card.style.transition = 'none'
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transition = 'transform 0.5s ease'
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  const services = [
    { icon: <Scale size={24} />, title: 'Direito Cível e do Consumidor', desc: 'Indenizações, contratos, cobranças, conflitos patrimoniais e defesa de direitos do consumidor.', highlight: false },
    { icon: <FileText size={24} />, title: 'Execuções e Recuperação de Crédito', desc: 'Cobrança judicial e extrajudicial, bloqueios via SISBAJUD, localização de bens e satisfação do crédito.', highlight: false },
    { icon: <Users size={24} />, title: 'Direito de Família e Sucessões', desc: 'Divórcios, pensão alimentícia, guarda, inventários, partilhas e planejamento sucessório estratégico.', highlight: false },
    { icon: <Briefcase size={24} />, title: 'Direito Trabalhista e Previdenciário', desc: 'Representação em reclamações trabalhistas, defesas, revisões de benefícios, pensões e aposentadorias no INSS.', highlight: false },
    { icon: <Shield size={24} />, title: 'Direito Criminal', desc: 'Defesas, atuação em inquéritos policiais, acompanhamento em delegacias e tribunais.', highlight: false },
    { icon: <Gavel size={24} />, title: 'Direito Imobiliário e Leilões Judiciais', desc: 'Assessoria completa em leilões de imóveis em todo o Brasil: análise de edital, identificação de riscos ocultos, estratégia de lance e regularização pós-compra.', highlight: true },
  ]

  return (
    <section id="servicos" ref={ref} className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-metallic text-xs font-bold tracking-widest uppercase mb-3">Serviços</p>
          <h2 className="font-heading text-2xl md:text-4xl text-dark font-bold">Áreas de Atuação</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((s, i) => (
            <div key={i} className="svc-wrapper" ref={(el) => (svcRefs.current[i] = el)}>
              <div
                className={`svc-card h-full p-8 rounded-xl border relative overflow-hidden cursor-pointer shadow-md transition-shadow duration-300 ${
                  s.highlight
                    ? 'bg-dark border-dark/80 hover:shadow-xl hover:border-metallic'
                    : 'bg-white border-gray-100 hover:shadow-xl hover:border-metallic/40'
                }`}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                onMouseLeave={handleMouseLeave}
              >
                {s.highlight && (
                  <div className="absolute top-0 right-0 bg-metallic text-dark text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                    Destaque
                  </div>
                )}
                <div className="relative z-10">
                  <div className={`mb-5 inline-flex p-3 rounded-lg transition-transform duration-300 hover:scale-110 hover:rotate-6 ${
                    s.highlight ? 'bg-metallic/20 text-metallic' : 'bg-metallic/10 text-metallic'
                  }`}>
                    {s.icon}
                  </div>
                  <h3 className={`font-heading text-lg lg:text-xl font-bold leading-snug mb-3 transition-colors duration-300 ${
                    s.highlight ? 'text-white hover:text-metallic' : 'text-dark hover:text-metallic'
                  }`}>
                    {s.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${s.highlight ? 'text-white/70' : 'text-gray-600'}`}>
                    {s.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ========================================
   LEILÕES
   ======================================== */
function Auctions() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.leilao-el', {
        y: 30, opacity: 0, duration: 0.7, stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="leiloes" ref={ref} className="py-20 md:py-28 text-white relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/bgbl.jpg')] bg-cover bg-center bg-fixed" />
      <div className="absolute inset-0 bg-[#01050a]/15" />
      <div className="relative z-10 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="lg:col-span-2 text-left">
            <p className="leilao-el text-metallic text-xs font-bold tracking-widest uppercase mb-3">Leil&otilde;es Judiciais</p>
            <h2 className="leilao-el font-heading text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6">
              Assessoria em <span className="text-metallic italic">leil&otilde;es judiciais de im&oacute;veis</span>
            </h2>
            <p className="leilao-el text-white/70 mb-6 text-lg leading-relaxed">
              A arremata&ccedil;&atilde;o de im&oacute;veis em leil&otilde;es judiciais envolve aspectos jur&iacute;dicos espec&iacute;ficos que exigem an&aacute;lise t&eacute;cnica adequada.
            </p>
            <h3 className="leilao-el font-heading text-lg text-metallic font-semibold mb-4">Servi&ccedil;os prestados nesta &aacute;rea:</h3>
            <ul className="leilao-el space-y-3 mb-8">
              {[
                'Análise de editais e documentação processual',
                'Verificação de ônus, gravames e pendências sobre o imóvel',
                'Orientação sobre procedimentos de arrematação',
                'Acompanhamento do processo de regularização documental',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/90">
                  <CheckCircle2 size={20} className="text-metallic shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="leilao-el text-white/50 italic mb-8">
              Atendimento dispon&iacute;vel para leil&otilde;es realizados em qualquer comarca do Brasil.
            </p>
            <a
              href="https://wa.me/5533998302939?text=Olá, Dr. Luís Felipe. Tenho interesse em assessoria para leilões judiciais."
              target="_blank" rel="noopener noreferrer"
              className="leilao-el inline-flex items-center gap-2 bg-metallic text-white font-semibold px-8 py-4 rounded-lg hover:bg-metallic-dark transition-all hover:scale-105 shadow-lg shadow-metallic/20 text-base"
            >
              Quero assessoria em leil&otilde;es <ArrowRight size={18} />
            </a>
          </div>
          <div className="space-y-5">
            {[
              { val: 'OAB/MG', label: '' },
              { val: '10+', label: 'Anos de experiência' },
              { val: 'Brasil', label: 'Atuação em todo o território' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-metallic/30 rounded-xl p-8 text-center hover:border-metallic/60 hover:bg-[#111]/90 transition-all shadow-2xl">
                <p className="font-heading text-5xl font-bold mb-3 text-metallic-gradient inline-block">
                  {stat.val}
                </p>
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========================================
   BLOG PREVIEW (home)
   ======================================== */
function BlogPreview() {
  const ref = useRef(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6)
      setPosts(data || [])
      setLoading(false)
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.blog-preview-wrapper', { y: 40, opacity: 0 })
      gsap.to('.blog-preview-wrapper', {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-metallic text-xs font-bold tracking-widest uppercase mb-3">Blog / Material T&eacute;cnico</p>
          <h2 className="font-heading text-2xl md:text-4xl text-dark font-bold">
            Artigos, dicas e estudos de caso
          </h2>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-16">Carregando materiais...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 py-16 max-w-lg mx-auto opacity-70">
            <p className="text-xl font-bold mb-2">Em breve</p>
            <p className="text-sm">Espaço reservado para publicações (como por exemplo: Como funciona um leilão judicial de imóveis? | Os principais riscos e como evitá-los | Assessoria jurídica: o barato que economiza o caro).</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {posts.map((post, i) => (
              <div key={post.id} className="blog-preview-wrapper">
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 border-2 border-metallic text-metallic font-semibold px-8 py-3 rounded-lg hover:bg-metallic hover:text-white transition-all"
          >
            Ver todos os artigos <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ========================================
   DEPOIMENTOS
   ======================================== */
function Testimonials() {
  const reviews = [
    { id: 1, image: "/review1.webp" },
    { id: 2, image: "/review2.webp" },
    { id: 3, image: "/review3.webp" },
    { id: 4, image: "/review4.webp" },
    { id: 5, image: "/review5.webp" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = reviews.length;
  const maxIndex = Math.max(0, totalSlides - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  return (
    <section id="depoimentos" className="py-20 md:py-28 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
             <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width="20" height="20" loading="lazy" decoding="async" className="w-5 h-5" />
             <p className="text-metallic text-xs font-bold tracking-widest uppercase">Avaliações no Google</p>
          </div>
          <h2 className="font-heading text-2xl md:text-4xl text-dark font-bold">
            O que nossos clientes dizem
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 md:px-12">
           {/* Controls */}
           <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 z-10 transition-colors">
              <ChevronLeft size={24} className="text-dark" />
           </button>
           <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 z-10 transition-colors">
              <ChevronRight size={24} className="text-dark" />
           </button>

           {/* Carousel Track */}
           <div className="overflow-hidden bg-transparent py-4">
               <div 
                 className="flex transition-transform duration-500 ease-in-out"
                 style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
               >
                 {reviews.map((review) => (
                    <div 
                      key={review.id} 
                      className="flex-shrink-0 px-2 lg:px-4"
                      style={{ width: `${100 / itemsPerView}%` }}
                    >
                       <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden h-full flex pt-2">
                         <img
                           src={review.image}
                           alt={`Avaliação Google ${review.id}`}
                           width="400"
                           height="200"
                           loading="lazy"
                           decoding="async"
                           className="w-full object-contain scale-[1.02]"
                           onError={(e) => {
                             e.target.style.display = 'none';
                             e.target.parentElement.innerHTML = `<div class="p-8 text-center text-gray-500">Salve a imagem como <strong>${review.image.replace('/', '')}</strong> na pasta <br /><code>public/</code></div>`
                           }}
                         />
                       </div>
                    </div>
                 ))}
               </div>
           </div>
           
           {/* Dots */}
           <div className="flex justify-center gap-2 mt-8">
              {[...Array(maxIndex + 1)].map((_, i) => (
                 <button 
                   key={`dot-${i}`}
                   onClick={() => setCurrentIndex(i)}
                   className={`w-2.5 h-2.5 rounded-full transition-colors ${
                     i === currentIndex ? 'bg-metallic' : 'bg-gray-300 hover:bg-gray-400'
                   }`}
                   aria-label={`Ir para grupo de depoimento ${i + 1}`}
                 />
              ))}
           </div>
        </div>
      </div>
    </section>
  )
}

/* ========================================
   FAQ
   ======================================== */
function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const ref = useRef(null)

  const faqs = [
    {
      q: "Como funciona o primeiro contato com o escritório?",
      a: "O primeiro contato pode ser feito via WhatsApp ou e-mail. Agendamos uma consulta (online ou presencial) para entender seu caso em detalhes e propor a melhor estratégia jurídica."
    },
    {
      q: "O Dr. Luís Felipe atende causas fora de Minas Gerais?",
      a: "Sim. O escritório possui atuação nacional, com foco especial em leilões judiciais em todo o território brasileiro e processos digitais em diversos tribunais do país."
    },
    {
      q: "É seguro investir em leilões de imóveis?",
      a: "Sim, desde que haja uma análise jurídica criteriosa do edital e do processo. Minha assessoria mapeia todos os riscos (dívidas, ocupação, prazos) para garantir uma arrematação lucrativa e segura."
    },
    {
      q: "Quais são os custos envolvidos em uma assessoria jurídica?",
      a: "Os honorários variam conforme a complexidade do caso ou do leilão. Trabalhamos com total transparência, apresentando um orçamento detalhado após a análise inicial da demanda."
    },
    {
      q: "Como acompanho o andamento do meu caso?",
      a: "Prezamos pela comunicação direta. Além de relatórios periódicos, nossos clientes têm canal aberto via WhatsApp para esclarecer dúvidas sobre o andamento processual a qualquer momento."
    }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.faq-el', {
        y: 20, opacity: 0, duration: 0.6, stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="faq" ref={ref} className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-14">
          <p className="text-metallic text-xs font-bold tracking-widest uppercase mb-3 text-center">D&uacute;vidas</p>
          <h2 className="font-heading text-3xl md:text-4xl text-dark font-bold">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className={`border rounded-xl transition-all duration-300 ${
                  isOpen ? 'border-metallic shadow-md' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                >
                  <span className={`font-semibold md:text-lg ${isOpen ? 'text-metallic' : 'text-dark'}`}>
                    {item.q}
                  </span>
                  <div className={`shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? (
                      <Minus size={20} className="text-metallic" />
                    ) : (
                      <Plus size={20} className="text-dark/40" />
                    )}
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-5 md:p-6 pt-0 text-dark/70 leading-relaxed border-t border-gray-50">
                    {item.a}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ========================================
   CTA / CONTATO
   ======================================== */
function ContactCTA() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-el', {
        y: 25, opacity: 0, duration: 0.6, stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="contato" ref={ref} className="py-20 md:py-28 bg-gray-50 text-dark overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Coluna de Texto */}
          <div className="text-left">
            <h2 className="cta-el font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-dark leading-tight">
              Atendimento
            </h2>
            <p className="cta-el text-dark/70 text-lg mb-10 leading-relaxed max-w-xl">
              O escrit&oacute;rio atende em Governador Valadares/MG e, mediante agendamento pr&eacute;vio, realiza atendimento remoto para clientes de outras localidades.
            </p>
            
            <div className="cta-el flex flex-col gap-6 mb-8">
              <div className="flex items-center gap-4 text-dark/80 group">
                <div className="shrink-0 w-10 h-10 rounded-full bg-metallic/10 flex items-center justify-center text-metallic group-hover:bg-metallic group-hover:text-white transition-all duration-300">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-metallic uppercase tracking-wider">Telefone/WhatsApp</span>
                  <a href="https://wa.me/5533998302939" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-dark hover:text-metallic transition-colors">(33) 9 9830-2939</a>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-dark/80 group">
                <div className="shrink-0 w-10 h-10 rounded-full bg-metallic/10 flex items-center justify-center text-metallic group-hover:bg-metallic group-hover:text-white transition-all duration-300">
                  <Mail size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-metallic uppercase tracking-wider">E-mail</span>
                  <a href="mailto:juridico@luisf.com.br" className="text-lg font-semibold text-dark hover:text-metallic transition-colors">juridico@luisf.com.br</a>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-dark/80 group">
                <div className="shrink-0 w-10 h-10 rounded-full bg-metallic/10 flex items-center justify-center text-metallic group-hover:bg-metallic group-hover:text-white transition-all duration-300">
                  <MapPin size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-metallic uppercase tracking-wider">Endere&ccedil;o</span>
                  <span className="text-lg font-semibold text-dark leading-snug">Rua São Paulo, 176, Centro<br/><span className="text-sm font-normal text-dark/60 uppercase">Governador Valadares/MG</span></span>
                </div>
              </div>
            </div>

            <div className="cta-el pt-2">
              <a
                href="https://wa.me/5533998302939?text=Olá, Dr. Luís Felipe. Gostaria de entrar em contato."
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-metallic text-white font-bold px-10 py-5 rounded-lg hover:bg-metallic-dark shadow-xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto text-center text-base md:text-lg uppercase tracking-wide"
              >
                ENTRE EM CONTATO <ArrowRight size={20} className="inline" />
              </a>
            </div>
          </div>

          {/* Coluna do Mapa */}
          <div className="cta-el relative">
            <div className="absolute -inset-4 bg-metallic/5 rounded-[2rem] blur-2xl pointer-events-none" />
            <div className="relative z-10 w-full h-[450px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl border-4 border-white">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.234673891784!2d-41.9453!3d-18.8647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xb1a6e9a6e60b09%3A0xe5a3c0c0e7c0c0e5!2sR.%20S%C3%A3o%20Paulo%2C%20176%20-%20Centro%2C%20Governador%20Valadares%20-%20MG%2C%2035010-200!5e0!3m2!1spt-BR!2sbr!4v1712693000000!5m2!1spt-BR!2sbr" 
                className="w-full h-full grayscale-[0.3] hover:grayscale-0 transition-all duration-700 contrast-[1.1]"
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {/* Overlay sutil para indicar o local no escritorio */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[90%] bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 hidden md:flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-metallic uppercase tracking-widest mb-1">Visite-nos</p>
                <p className="text-sm text-dark font-medium leading-tight">Rua São Paulo, 176 - Centro</p>
              </div>
              <a 
                href="https://maps.app.goo.gl/uP9f6j9Z5T9Z5T9Z5"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-dark text-white px-4 py-2 rounded-lg font-bold hover:bg-metallic transition-colors"
              >
                Como Chegar
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========================================
   FOOTER
   ======================================== */
function Footer() {
  return (
    <footer className="footer-dark bg-primary text-white/60 py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12">
          {/* Logo e Descrição */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logob.webp" alt="Luís Felipe Advocacia" width="40" height="40" loading="lazy" decoding="async" className="h-10 w-auto opacity-90" />
              <span className="font-heading text-xl md:text-2xl font-bold text-white">
                Lu&iacute;s Felipe Advocacia
              </span>
            </div>
            <p className="text-white/60 text-sm max-w-sm">
              Tradi&ccedil;&atilde;o, &eacute;tica e seguran&ccedil;a em solu&ccedil;&otilde;es jur&iacute;dicas especializadas e assessoria completa em leil&otilde;es judiciais em todo o Brasil.
            </p>
          </div>
          
          {/* Links Rápidos */}
          <div className="flex flex-col items-center md:items-end text-sm space-y-3">
             <p className="text-white font-bold mb-2 uppercase tracking-wide text-xs">Navega&ccedil;&atilde;o</p>
             <a href="#sobre" className="hover:text-metallic transition-colors">Apresenta&ccedil;&atilde;o</a>
             <a href="#servicos" className="hover:text-metallic transition-colors">&Aacute;reas de Atua&ccedil;&atilde;o</a>
             <a href="#leiloes" className="hover:text-metallic transition-colors">Leil&otilde;es Judiciais</a>
             <a href="#contato" className="hover:text-metallic transition-colors">Contato</a>
          </div>
        </div>

        {/* Informações Finais e Direitos */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-center md:text-left">
          <p className="text-white/80 font-medium tracking-wide">
            OAB/MG | Atua&ccedil;&atilde;o em todo o Brasil
          </p>
          <p className="text-white/40">
            &copy; {new Date().getFullYear()} Lu&iacute;s Felipe Advocacia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ========================================
   WHATSAPP FLOAT
   ======================================== */
function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/5533998302939?text=Olá, Dr. Luís Felipe. Gostaria de uma orientação jurídica."
      target="_blank" rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25d366] rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-all duration-300"
      aria-label="WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  )
}

/* ========================================
   LANDING PAGE (home)
   ======================================== */
function LandingPage() {
  return (
    <div className="bg-white">
      <SEO />
      <Hero />
      <About />
      <DiffCards />
      <Services />
      <Auctions />
      <BlogPreview />
      <Testimonials />
      <ContactCTA />
      <FAQ />
    </div>
  )
}

/* ========================================
   APP — ROUTES
   ======================================== */
function App() {
  useScrollToTop()

  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </Suspense>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}

export default App
