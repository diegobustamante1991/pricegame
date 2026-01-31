import { APP } from '../content'

function setMetaTag(name: string, content: string, isProperty = false) {
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
  let tag = document.querySelector(selector) as HTMLMetaElement | null
  if (!tag) {
    tag = document.createElement('meta')
    if (isProperty) {
      tag.setAttribute('property', name)
    } else {
      tag.setAttribute('name', name)
    }
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export function applyAppMeta() {
  const title = APP.name
  const description = APP.tagline
  document.title = title
  setMetaTag('description', description)
  setMetaTag('og:title', title, true)
  setMetaTag('og:description', description, true)
  setMetaTag('twitter:title', title)
  setMetaTag('twitter:description', description)
}
