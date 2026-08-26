/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORMSPREE_FORM_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.svg?url' {
  const content: string
  export default content
}

declare module '*.jpeg?url' {
  const content: string
  export default content
}

declare module '*.jpg?url' {
  const content: string
  export default content
}

declare module '*.png?url' {
  const content: string
  export default content
}
