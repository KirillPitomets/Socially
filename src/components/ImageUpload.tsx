"use client"

import { UploadDropzone } from "@/lib/uploadthing"
import { CloudCog, Files, XIcon } from "lucide-react"


interface ImageUploadProps {
  onChange: (url: string) => void
  value: string
  endpoint: "imageUploader";
}

const ImageUpload = ({ endpoint, onChange, value, }: ImageUploadProps) => {
  if (value) {
    return (
      <div className="relative size-40">
        <img src={value} alt="Upload" className="rounded-mb size-40 object-cover" />
        <button
          onClick={() => { onChange("") }}
          className="absolute top-0 right-0 p-1 bg-red-500 rounded-full shadow-sm"
          type="button"
        >
          <XIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={res => {
        onChange(res?.[0].url)
      }}

      onUploadError={(err: Error) => {
        alert(`Error! ${err.message}`)
      }}
    />
  )
}

export default ImageUpload;