import { useState } from 'react'
import { supabase } from '../lib/supabase'

function CommentForm({ postId, onSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !content.trim()) return
    setSending(true)
    try {
      const { error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: postId,
            author_name: name.trim(),
            author_email: email.trim(),
            content: content.trim(),
            status: 'pending',
          },
        ])
      if (!error) {
        setSent(true)
        setName('')
        setEmail('')
        setContent('')
        if (onSuccess) onSuccess()
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Erro ao enviar comentário:', err)
    }
    setSending(false)
  }

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-700 font-medium">Comentário enviado!</p>
        <p className="text-green-600 text-sm mt-1">Após aprovação do administrador, ele aparecerá aqui.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-metallic"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-metallic"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-dark mb-1">Comentário</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-metallic resize-none"
          required
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="bg-metallic text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-metallic-dark transition-colors text-sm disabled:opacity-50"
      >
        {sending ? 'Enviando...' : 'Enviar comentário'}
      </button>
    </form>
  )
}

export default CommentForm
