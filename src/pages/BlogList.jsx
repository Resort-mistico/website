import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import BlogCard from '../components/BlogCard'
import SEO from '../components/SEO'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function BlogList() {
  const ref = useRef(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.blog-card-wrapper', { y: 50, opacity: 0, scale: 0.95 })
      gsap.to('.blog-card-wrapper', {
        y: 0, opacity: 1, scale: 1,
        duration: 0.7, stagger: 0.1,
        ease: 'back.out(1.4)',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
      setPosts(data || [])
      setLoading(false)
    }
    fetchPosts()
  }, [])

  return (
    <>
      <SEO 
        title="Blog" 
        description="Acompanhe nossos artigos e últimas notícias da área jurídica." 
        url="/blog" 
      />
      <section ref={ref} className="py-20 md:py-28 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-metallic text-xs font-bold tracking-widest uppercase mb-3">Blog</p>
          <h2 className="font-heading text-2xl md:text-4xl text-dark font-bold">
            Artigos &amp; Not&iacute;cias
          </h2>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20">Carregando artigos...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 py-20">Nenhum artigo publicado ainda.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {posts.map((post) => (
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
