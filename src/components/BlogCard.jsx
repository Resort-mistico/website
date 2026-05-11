import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'

function BlogCard({ post }) {
  const handleMouseMove = (e, card) => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -6
    const rotateY = ((x - centerX) / centerX) * 6
    card.style.transition = 'none'
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transition = 'transform 0.5s ease'
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  const date = post.created_at
    ? new Date(post.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : ''

  const excerpt = post.content
    ? post.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...'
    : ''

  return (
    <div className="blog-card-wrapper">
      <article
        className="h-full bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:border-metallic/40 transition-shadow duration-300 cursor-pointer relative"
        onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
        onMouseLeave={handleMouseLeave}
      >
        <Link to={`/blog/${post.slug}`} className="block h-full group">
          {post.cover_image ? (
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextSibling.style.display = 'flex'
              }}
            />
          ) : null}
          <div
            className="w-full h-48 bg-gray-100 flex items-center justify-center"
            style={{ display: post.cover_image ? 'none' : 'flex' }}
          >
            <span className="text-gray-400 text-sm">Imagem do artigo</span>
          </div>
        <div className="p-6">
          {post.category && (
            <span className="text-xs font-semibold text-metallic uppercase tracking-wider">
              {post.category}
            </span>
          )}
          <h3 className="font-heading text-lg text-dark font-semibold mt-2 mb-3 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{excerpt}</p>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Calendar size={14} />
            <span>{date}</span>
          </div>
          <div className="mt-auto">
            <span
              className="text-metallic text-sm font-semibold group-hover:text-metallic-dark transition-colors inline-flex items-center gap-1"
            >
              Ler mais &rarr;
            </span>
          </div>
        </div>
        </Link>
      </article>
    </div>
  )
}

export default BlogCard
