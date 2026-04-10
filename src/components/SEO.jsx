import { Helmet } from 'react-helmet-async'

export default function SEO({ title, description, url, image, article, datePublished, authorName }) {
  const siteTitle = 'Seu Escritório | Advocacia e Consultoria'
  const siteUrl = 'https://seudominio.com.br' // Troque depois para o domínio final
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const metaDescription = description || 'Acompanhe nossos artigos e últimas notícias da área jurídica.'
  const currUrl = url ? `${siteUrl}${url}` : siteUrl

  // Structured Data (JSON-LD)
  const schemaOrgJSONLD = [
    {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      url: siteUrl,
      name: siteTitle,
    },
  ]

  if (article) {
    schemaOrgJSONLD.push({
      '@context': 'http://schema.org',
      '@type': 'Article',
      headline: title,
      image: image ? [image] : [],
      datePublished: datePublished || '',
      author: {
        '@type': 'Person',
        name: authorName || 'Equipe Editorial',
      },
      publisher: {
        '@type': 'Organization',
        name: siteTitle,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`,
        },
      },
      description: metaDescription,
    })
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={currUrl} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:url" content={currUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}

      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>
    </Helmet>
  )
}
