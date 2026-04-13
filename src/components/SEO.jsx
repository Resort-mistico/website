import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://luisfelipeadvocacia.com.br'
const SITE_TITLE = 'Advogado em Governador Valadares | Luís Felipe Advocacia'
const DEFAULT_DESCRIPTION = 'Procurando Advogado em Governador Valadares? Oferecemos assessoria jurídica especializada e atuação em Leilões Judiciais de Imóveis.'

export default function SEO({ title, description, url, image, article, datePublished, authorName }) {
  const fullTitle = title ? `${title} | ${SITE_TITLE}` : SITE_TITLE
  const metaDescription = description || DEFAULT_DESCRIPTION
  const currUrl = url ? `${SITE_URL}${url}` : SITE_URL
  const ogImage = image || `${SITE_URL}/logob.webp`

  // Structured Data (JSON-LD)
  const schemaOrgJSONLD = [
    {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      url: SITE_URL,
      name: 'Luís Felipe Advocacia',
      description: DEFAULT_DESCRIPTION,
      telephone: '+55-33-99830-2939',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Rua São Paulo, 176 - Centro',
        addressLocality: 'Governador Valadares',
        addressRegion: 'MG',
        postalCode: '35010-200',
        addressCountry: 'BR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -18.8647,
        longitude: -41.9453,
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      sameAs: [],
    },
  ]

  if (article) {
    schemaOrgJSONLD.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      image: image ? [image] : [],
      datePublished: datePublished || '',
      author: {
        '@type': 'Person',
        name: authorName || 'Luís Felipe',
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_TITLE,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logob.webp`,
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
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Luís Felipe Advocacia" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>
    </Helmet>
  )
}
