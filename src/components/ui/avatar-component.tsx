import React from 'react'
import Image from 'next/image'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
}

const AvatarComponent: React.FC<AvatarProps> = ({ src, alt, fallback }) => {
  return (
    <div className="relative inline-block">
      {src ? (
        <div className="relative h-10 w-10">
          <Image
            src={src}
            alt={alt || ''}
            fill
            className="rounded-full object-cover"
            sizes="40px"
          />
        </div>
      ) : (
        <div className="h-10 w-10 flex items-center justify-center bg-gray-300 rounded-full">
          <span className="text-gray-500">{fallback || '?'}</span>
        </div>
      )}
    </div>
  )
}

export default AvatarComponent 