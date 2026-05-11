import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { LogOut, Plus, Edit2, Trash2, Eye, Check, X, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react'
import Editor, {
  BtnBold, BtnItalic, BtnUnderline, BtnStrikeThrough,
  BtnNumberedList, BtnBulletList, BtnLink, BtnClearFormatting,
  BtnUndo, BtnRedo,
  HtmlButton, Separator, BtnStyles, Toolbar, EditorProvider,
  createButton,
} from 'react-simple-wysiwyg'

// Botões de alinhamento criados fora do componente (não recriam a cada render)
const BtnAlignLeft    = createButton('Alinhar à esquerda', <AlignLeft size={14} />,    'justifyLeft')
const BtnAlignCenter  = createButton('Centralizar',         <AlignCenter size={14} />,  'justifyCenter')
const BtnAlignRight   = createButton('Alinhar à direita',   <AlignRight size={14} />,   'justifyRight')
const BtnAlignJustify = createButton('Justificar',           <AlignJustify size={14} />, 'justifyFull')

function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [pendingComments, setPendingComments] = useState([])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [status, setStatus] = useState('draft')
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState('')
  const [coverStoredUrl, setCoverStoredUrl] = useState('') // URL real salva no banco (não blob)
  const [saving, setSaving] = useState(false)
  const titleRef = useRef(null)

  // Auth guard
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/admin', { replace: true })
      } else {
        setUser(session.user)
      }
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/admin', { replace: true })
      else setUser(session.user)
    })
    return () => subscription.unsubscribe()
  }, [navigate])

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      setPosts(data || [])
    }
    fetchPosts()
  }, [])

  // Fetch all comments for moderation
  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })
      setPendingComments(data || [])
    }
    fetchComments()

    // Subscribe to comment changes
    const channel = supabase
      .channel('comments-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments' },
        () => fetchComments()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Slug generation
  const handleTitleChange = (val) => {
    setTitle(val)
    setSlug(val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const resetForm = () => {
    setEditing(null)
    setTitle('')
    setSlug('')
    setCategory('')
    setContent('')
    setExcerpt('')
    setStatus('draft')
    setCoverFile(null)
    setCoverPreview('')
    setCoverStoredUrl('')
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return
    setSaving(true)
    try {
      // Começa com a URL real já salva no banco (nunca usa blob URL)
      let coverUrl = coverStoredUrl
      if (coverFile) {
        // Sanitiza o nome do arquivo removendo caracteres especiais, acentos e espaços
        const safeName = coverFile.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9._-]/g, '-')
          .toLowerCase()
        const filePath = `covers/${Date.now()}-${safeName}`
        const { data, error } = await supabase.storage
          .from('covers')
          .upload(filePath, coverFile, { upsert: false })
        if (error) {
          // eslint-disable-next-line no-console
          console.error('[Storage] Erro ao fazer upload da capa:', error)
          alert('Erro ao fazer upload da imagem: ' + error.message)
          setSaving(false)
          return // Aborta para não salvar URL inválida no banco
        }
        const { data: urlData } = supabase.storage
          .from('covers')
          .getPublicUrl(data.path)
        coverUrl = urlData.publicUrl
        setCoverStoredUrl(coverUrl)
      }

      const postData = {
        title: title.trim(),
        slug: slug.trim() || `${Date.now()}`,
        category: category.trim(),
        content,
        excerpt,
        status,
        cover_image: coverUrl,
        updated_at: new Date().toISOString(),
      }

      if (editing) {
        await supabase.from('posts').update(postData).eq('id', editing)
      } else {
        postData.created_at = new Date().toISOString()
        postData.reactions = 0
        await supabase.from('posts').insert([postData])
      }
      resetForm()
      setShowForm(false)
      // Refresh posts
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
      setPosts(data || [])
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
    setSaving(false)
  }

  const handleEdit = (post) => {
    setEditing(post.id)
    setShowForm(true)
    setTitle(post.title)
    setSlug(post.slug || '')
    setCategory(post.category || '')
    setContent(post.content || '')
    setExcerpt(post.excerpt || '')
    setStatus(post.status || 'draft')
    setCoverFile(null)
    setCoverPreview(post.cover_image || '')
    setCoverStoredUrl(post.cover_image || '') // URL real do banco
    titleRef.current?.focus()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este artigo?')) return
    await supabase.from('posts').delete().eq('id', id)
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleCommentAction = async (commentId, action) => {
    await supabase.from('comments').update({ status: action }).eq('id', commentId)
    setPendingComments((prev) =>
      prev.map((c) => c.id === commentId ? { ...c, status: action } : c)
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  if (!user) return null

  const pendingCount = pendingComments.filter((c) => c.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold text-dark">Painel Admin</h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Pending comments alert */}
        {pendingCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-amber-800 font-medium text-sm mb-3">
              {pendingCount} coment&aacute;rio(s) pendente(s) de aprova&ccedil;&atilde;o
            </p>
            <div className="space-y-3">
              {pendingComments.filter((c) => c.status === 'pending').map((c) => (
                <div key={c.id} className="bg-white rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dark">{c.author_name} <span className="text-gray-400 font-normal">({c.author_email})</span></p>
                    <p className="text-sm text-gray-600 mt-1">{c.content}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleCommentAction(c.id, 'approved')}
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      title="Aprovar"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleCommentAction(c.id, 'rejected')}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      title="Rejeitar"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New article button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-lg font-semibold text-dark">Artigos ({posts.length})</h2>
          <button
            onClick={() => { 
                console.log("Abrindo form...")
                resetForm()
                setShowForm(true)
            }}
            className="inline-flex items-center gap-2 bg-metallic text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-metallic-dark transition-colors text-sm"
          >
            <Plus size={16} /> Novo Artigo
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="font-heading text-lg font-semibold text-dark mb-4">
              {editing ? 'Editar Artigo' : 'Novo Artigo'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">T&iacute;tulo</label>
                <input
                  ref={titleRef}
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-metallic"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">URL do Artigo</label>
                <div className="flex bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:border-metallic">
                  <span className="px-4 py-2.5 text-sm text-gray-500 border-r border-gray-200 bg-gray-100 flex-shrink-0 flex items-center">
                    {window.location.host}/blog/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    className="w-full px-4 py-2.5 text-sm focus:outline-none focus:bg-white bg-transparent"
                    placeholder="meu-artigo-legal"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Categoria</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ex: Leil&otilde;es, Direito Civil..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-metallic"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Imagem de Capa</label>
                <input type="file" accept="image/*" onChange={handleCoverChange} className="text-sm" />
                {coverPreview && (
                  <img src={coverPreview} alt="Preview" className="w-full max-w-xs h-32 object-cover rounded-lg mt-2" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Conte&uacute;do</label>
                <EditorProvider>
                  <Editor
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    containerProps={{ style: { minHeight: '350px', backgroundColor: 'white', borderRadius: '0.5rem', borderColor: '#e5e7eb' } }}
                  >
                    <Toolbar>
                      <BtnUndo />
                      <BtnRedo />
                      <Separator />
                      <BtnBold />
                      <BtnItalic />
                      <BtnUnderline />
                      <BtnStrikeThrough />
                      <Separator />
                      <BtnAlignLeft />
                      <BtnAlignCenter />
                      <BtnAlignRight />
                      <BtnAlignJustify />
                      <Separator />
                      <BtnNumberedList />
                      <BtnBulletList />
                      <Separator />
                      <BtnLink />
                      <BtnClearFormatting />
                      <HtmlButton />
                      <Separator />
                      <BtnStyles />
                    </Toolbar>
                  </Editor>
                </EditorProvider>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Resumo SEO (Google)</label>
                <textarea
                  rows="2"
                  maxLength="160"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-metallic"
                  placeholder="Máximo 160 caracteres. Resumo atrativo para os buscadores..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-2">Status</label>
                <div className="flex gap-4">
                  {['draft', 'published'].map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={s}
                        checked={status === s}
                        onChange={() => setStatus(s)}
                      />
                      <span className="text-sm">{s === 'draft' ? 'Rascunho' : 'Publicado'}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-metallic text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-metallic-dark transition-colors disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={() => { resetForm(); setShowForm(false); }}
                  className="border border-gray-200 text-gray-600 font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts list */}
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="bg-white rounded-lg border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-dark truncate">{p.title}</p>
                <div className="flex gap-2 text-xs text-gray-400 mt-1">
                  <span className={`px-2 py-0.5 rounded ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                  {p.category && <span>{p.category}</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => navigate(`/blog/${p.slug || p.id}`)}
                  className="p-2 text-gray-400 hover:text-metallic transition-colors"
                  title="Visualizar"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleEdit(p)}
                  className="p-2 text-gray-400 hover:text-metallic transition-colors"
                  title="Editar"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-center text-gray-500 py-8">Nenhum artigo criado ainda.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
