import { type Plugin } from 'vite'

export function nextImageStub(): Plugin {
  return {
    name: 'next-image-stub',
    transform(code, id) {
      if (id.includes('next/image')) {
        return `
          import { forwardRef } from 'react'
          
          const Image = forwardRef((props, ref) => {
            const { src, alt, width, height, ...rest } = props
            return React.createElement('img', {
              ref,
              src: typeof src === 'string' ? src : src?.src || '',
              alt: alt || '',
              width,
              height,
              ...rest
            })
          })
          
          Image.displayName = 'Image'
          export default Image
        `
      }
    }
  }
}