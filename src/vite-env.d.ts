/// <reference types="vite/client" />

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.svg?react' {
  const component: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  export default component
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