import { Link } from 'react-router-dom'
import { MapPin, ArrowRight, ArrowLeft, Mountain, Droplets, Music, Church, Star } from 'lucide-react'
import SEO from '../components/SEO'

const WHATSAPP = 'https://wa.me/5531987954136?text=Olá!%20Vi%20o%20guia%20de%20Coroaci%20e%20gostaria%20de%20reservar%20uma%20suíte.'

function SectionIcon({ icon: Icon }) {
  return (
    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary mr-3 shrink-0">
      <Icon size={18} />
    </span>
  )
}

export default function CoroaciGuide() {
  return (
    <>
      <SEO
        title="O que fazer em Coroaci-MG: guia completo de turismo"
        description="Descubra o que fazer em Coroaci, MG: Morro do Cruzeiro, cachoeiras, cultura mineira, festas tradicionais e muito mais. Fique no Hotel Club Resort Místico e aproveite tudo!"
        url="/o-que-fazer-em-coroaci-mg"
      />

      {/* Hero da página */}
      <div className="relative bg-[#050c04] text-white pt-36 pb-20">
        <div className="absolute inset-0 bg-[url('/coroaci.webp')] bg-cover bg-top opacity-15" />
        <div className="relative z-10 container mx-auto px-6 max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-white/70 text-sm hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Voltar para a página inicial
          </Link>
          <div className="flex items-center gap-1.5 text-white/50 text-[10px] tracking-widest uppercase mb-6">
            <MapPin size={12} />
            Coroaci · Minas Gerais · Vale do Rio Doce
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            O que fazer em Coroaci-MG:<br />
            <span className="text-metallic-gradient italic">guia para a sua viagem</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Coroaci fica no Vale do Rio Doce, a cerca de 350 km de Belo Horizonte e pertinho de Governador Valadares. É uma cidade de natureza generosa, com cachoeiras, mirantes e aquele aconchego do interior mineiro. Hospedado no Hotel Club Resort Místico, você tem a base perfeita para conhecer tudo isso com calma.
          </p>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="bg-white">
        <div className="container mx-auto px-6 py-16 max-w-3xl">

          {/* Morro do Cruzeiro */}
          <article className="mb-14">
            <h2 className="font-heading text-2xl md:text-3xl text-primary font-bold flex items-center">
              <SectionIcon icon={Mountain} />
              Morro do Cruzeiro
            </h2>
            <p className="text-gray-600 leading-relaxed text-base">
              A poucos quilômetros do centro, o Morro do Cruzeiro recompensa quem sobe com uma vista panorâmica de toda a cidade e do verde ao redor. No alto há uma capela de Nossa Senhora Aparecida — ponto de fé e de fotos inesquecíveis ao pôr do sol.
            </p>
          </article>

          {/* Cachoeiras */}
          <article className="mb-14">
            <h2 className="font-heading text-2xl md:text-3xl text-primary font-bold flex items-center">
              <SectionIcon icon={Droplets} />
              Cachoeiras e cantos de natureza
            </h2>
            <p className="text-gray-600 leading-relaxed text-base">
              A região guarda cachoeiras e corredeiras procuradas por quem quer se refrescar e relaxar. Um convite para passar o dia ao ar livre, em contato com a natureza preservada do Vale do Rio Doce.
            </p>
          </article>

          {/* Conceição de Tronqueiras */}
          <article className="mb-14">
            <h2 className="font-heading text-2xl md:text-3xl text-primary font-bold flex items-center">
              <SectionIcon icon={Music} />
              Conceição de Tronqueiras
            </h2>
            <p className="text-gray-600 leading-relaxed text-base">
              O distrito é conhecido pela atmosfera tranquila e pelas tradições culturais, como a marujada e as apresentações folclóricas. Um passeio para quem quer sentir a alma mineira de perto.
            </p>
          </article>

          {/* Cultura e história */}
          <article className="mb-14">
            <h2 className="font-heading text-2xl md:text-3xl text-primary font-bold flex items-center">
              <SectionIcon icon={Church} />
              Cultura e história
            </h2>
            <p className="text-gray-600 leading-relaxed text-base">
              A Igreja Matriz de Sant'Ana, o casarão cultural e o pequeno museu da cidade contam a história de Coroaci e rendem boas caminhadas pelo centro.
            </p>
          </article>

          {/* Festas tradicionais */}
          <article className="mb-14">
            <h2 className="font-heading text-2xl md:text-3xl text-primary font-bold flex items-center">
              <SectionIcon icon={Star} />
              Festas tradicionais de Coroaci
            </h2>
            <p className="text-gray-600 leading-relaxed text-base">
              Se a sua viagem coincidir com uma das festas da cidade — como a FESCANA, o Coroaci Folia ou o Tronqueirense Ausente —, prepare-se para música, comida boa e o acolhimento típico do interior. São as épocas mais movimentadas: reserve sua suíte com antecedência.
            </p>
          </article>

          {/* Onde ficar */}
          <article className="mb-14">
            <h2 className="font-heading text-2xl md:text-3xl text-primary font-bold flex items-center">
              <SectionIcon icon={MapPin} />
              Onde ficar em Coroaci
            </h2>
            <p className="text-gray-600 leading-relaxed text-base">
              Para aproveitar tudo isso com conforto, o Hotel Club Resort Místico oferece suítes para casal, solteiro e família, piscina, churrasqueira e café da manhã, em meio à natureza. O lugar certo para descansar depois de um dia de passeios.
            </p>
          </article>
        </div>

        {/* CTA */}
        <div className="bg-[#050c04] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/coroaci.webp')] bg-cover bg-center opacity-10" />
          <div className="relative z-10 container mx-auto px-6 py-20 max-w-3xl text-center">
            <p className="text-metallic-gradient text-[10px] font-bold tracking-widest uppercase mb-4 inline-flex items-center gap-2">
              Hotel Club Resort Místico · Coroaci, MG
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Pronto para conhecer<br />
              <span className="text-metallic-gradient italic">Coroaci de verdade?</span>
            </h2>
            <p className="text-white/60 text-base mb-10 leading-relaxed">
              Reserve sua hospedagem no Hotel Club Resort Místico e chegue descansado para aproveitar cada cantinho da cidade.
            </p>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine inline-flex items-center gap-2 bg-[#A67D15] hover:bg-[#8B6B10] text-white font-semibold px-10 py-4 rounded transition-all text-base shadow-lg"
            >
              Reserve pelo WhatsApp <ArrowRight size={18} />
            </a>
            <div className="mt-8">
              <Link to="/" className="text-white/40 text-sm hover:text-white/70 transition-colors">
                ← Voltar para a página inicial
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
