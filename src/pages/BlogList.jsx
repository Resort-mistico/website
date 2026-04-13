import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import SEO from '../components/SEO'
import { Search, Calendar, Tag, ArrowRight, BookOpen } from 'lucide-react'

function BlogCard({ post }) {
  const date = post.created_at
    ? new Date(post.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : ''

  const excerpt = post.excerpt ||
    (post.content
      ? post.content.replace(/<[^>]*>/g, '').slice(0, 130) + '...'
      : '')

  return (
    <article className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-metallic/30 transition-all duration-300 overflow-hidden flex flex-col">
      <Link to={`/blog/${post.slug}`} className="flex flex-col flex-1">
        {/* Cover */}
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            width="400"
            height="220"
            loading="lazy"
            decoding="async"
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary/90 to-primary flex items-center justify-center flex-shrink-0">
            <BookOpen size={36} className="text-metallic/60" />
          </div>
        )}

        <div className="p-6 flex flex-col flex-1">
          {/* Categoria */}
          {post.category && (
            <span className="inline-block text-[11px] font-bold text-metallic uppercase tracking-widest mb-3 bg-metallic/8 px-2 py-1 rounded w-fit">
              {post.category}
            </span>
          )}

          {/* Título */}
          <h2 className="font-heading text-lg text-dark font-semibold mb-3 leading-snug line-clamp-2 group-hover:text-metallic transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
            {excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar size={12} />
              <span>{date}</span>
            </div>
            <span className="text-metallic text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Ler mais <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function BlogList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
      setPosts(data || [])
      setLoading(false)
    }
    fetchPosts()
  }, [])

  // Categorias únicas extraídas dos posts
  const categories = useMemo(() => {
    const cats = posts.map((p) => p.category).filter(Boolean)
    return ['Todos', ...Array.from(new Set(cats))]
  }, [posts])

  // Posts filtrados por busca + categoria
  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch = search === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.excerpt || '').toLowerCase().includes(search.toLowerCase())
      const matchCat = activeCategory === 'Todos' || p.category === activeCategory
      return matchSearch && matchCat
    })
  }, [posts, search, activeCategory])

  return (
    <>
      <SEO
        title="Blog Jurídico"
        description="Artigos, análises e orientações sobre Direito Civil, Trabalhista, Leilões Judiciais e mais. Conteúdo produzido por Luís Felipe Advocacia."
        url="/blog"
      />

      {/* ── HEADER ── */}
      <section className="bg-primary pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="h-1 w-12 bg-metallic-gradient rounded mb-6" />
            <p className="text-metallic text-xs font-bold tracking-widest uppercase mb-3">
              Conteúdo Jurídico
            </p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              Blog &amp; Artigos
            </h1>
            <p className="text-white/50 text-base leading-relaxed">
              Orientações práticas, análises jurídicas e tudo que você precisa saber sobre seus direitos.
            </p>
          </div>
        </div>
      </section>

      {/* ── FILTROS ── */}
      <div className="bg-white border-b border-gray-100 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

          {/* Busca */}
          <div className="relative w-full sm:max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-metallic focus:ring-1 focus:ring-metallic/30 text-dark placeholder-gray-400 transition"
            />
          </div>

          {/* Categorias */}
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={13} className="text-gray-400 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-dark text-white border-dark'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-metallic hover:text-metallic'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── GRID DE POSTS ── */}
      <section className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-6">

          {/* Contagem */}
          {!loading && (
            <p className="text-xs text-gray-400 mb-8">
              {filtered.length === 0
                ? 'Nenhum artigo encontrado'
                : `${filtered.length} artigo${filtered.length > 1 ? 's' : ''} encontrado${filtered.length > 1 ? 's' : ''}`}
              {activeCategory !== 'Todos' && ` em "${activeCategory}"`}
              {search && ` para "${search}"`}
            </p>
          )}

          {loading ? (
            /* Skeleton */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <BookOpen size={40} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 font-medium mb-1">
                {search || activeCategory !== 'Todos'
                  ? 'Nenhum artigo encontrado para esse filtro.'
                  : 'Nenhum artigo publicado ainda.'}
              </p>
              {(search || activeCategory !== 'Todos') && (
                <button
                  onClick={() => { setSearch(''); setActiveCategory('Todos') }}
                  className="mt-4 text-sm text-metallic hover:underline font-semibold"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default BlogList
