import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import CommentForm from '../components/CommentForm'
import CommentList from '../components/CommentList'
import SEO from '../components/SEO'
import { ArrowLeft, ThumbsUp } from 'lucide-react'

function BlogArticle() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [reacted, setReacted] = useState(false)
  const [reacting, setReacting] = useState(false)

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()
      if (data) setPost(data)
    }
    fetchPost()
  }, [slug])

  // Fetch approved comments
  useEffect(() => {
    if (!post) return
    const fetchComments = async () => {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', post.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: true })
      setComments(data || [])
    }
    fetchComments()
  }, [post])

  // Reaction — check localStorage to prevent double-react
  useEffect(() => {
    if (post) {
      const key = `reacted_${post.id}`
      setReacted(localStorage.getItem(key) === 'true')
    }
  }, [post])

  const handleReaction = async () => {
    if (!post || reacted || reacting) return
    setReacting(true)
    try {
      await supabase
        .from('posts')
        .update({ reactions: (post.reactions || 0) + 1 })
        .eq('id', post.id)
      setReacted(true)
      setPost((p) => ({ ...p, reactions: (p.reactions || 0) + 1 }))
      localStorage.setItem(`reacted_${post.id}`, 'true')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Erro ao reagir:', e)
    }
    setReacting(false)
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando artigo...</p>
      </div>
    )
  }

  const date = post.created_at
    ? new Date(post.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : ''

  const reactions = post.reactions || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={post.title}
        description={post.excerpt || post.content.replace(/<[^>]+>/g, '').substring(0, 160)}
        article={true}
        image={post.cover_image}
        url={`/blog/${post.slug}`}
        datePublished={post.created_at}
      />

      {/* Back link */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <Link to="/blog" className="text-metallic text-sm font-semibold hover:text-metallic-dark transition-colors inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Voltar ao Blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="container mx-auto px-6 py-12 max-w-3xl">
        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full rounded-xl mb-8"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        )}

        {post.category && (
          <span className="text-xs font-semibold text-metallic uppercase tracking-wider">
            {post.category}
          </span>
        )}

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark mt-3 mb-4">
          {post.title}
        </h1>

        <div className="flex items-center justify-between text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
          <span>{date}</span>
          <button
            onClick={handleReaction}
            disabled={reacted || reacting}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              reacted
                ? 'bg-metallic/10 border-metallic text-metallic'
                : 'border-gray-200 hover:border-metallic/50 hover:text-metallic'
            }`}
          >
            <ThumbsUp size={16} />
            <span>{reactions}</span>
          </button>
        </div>

        {/* Content */}
        <div
          className="blog-article-content mb-12"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />

        {/* Comments section */}
        <div className="border-t border-gray-200 pt-10">
          <h3 className="font-heading text-xl font-semibold text-dark mb-6">
            Coment&aacute;rios ({comments.length})
          </h3>
          <CommentList comments={comments} />
          <div className="mt-8 bg-gray-50 rounded-xl p-6">
            <h4 className="font-semibold text-dark mb-4">Deixe seu coment&aacute;rio</h4>
            <CommentForm postId={post.id} />
          </div>
        </div>
      </article>
    </div>
  )
}

export default BlogArticle
