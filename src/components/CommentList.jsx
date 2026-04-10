function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-6">
        Nenhum comentário ainda. Seja o primeiro!
      </p>
    )
  }

  const formatDate = (ts) => {
    if (!ts) return ''
    return new Date(ts).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      {comments.map((c) => (
        <div key={c.id} className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-metallic/20 rounded-full flex items-center justify-center text-metallic text-xs font-bold">
              {c.author_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-dark">{c.author_name}</p>
              <p className="text-xs text-gray-400">{formatDate(c.created_at)}</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed ml-11">{c.content}</p>
        </div>
      ))}
    </div>
  )
}

export default CommentList
