"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useHabitStore } from "@/stores/habit-store"
import { Camera, Trash2, AlertCircle, Upload } from "lucide-react"
import { resizeImage, validateImageFile } from "@/utils/image-utils"
import { useToast } from "@/components/ui/use-toast"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AvatarPanelProps {
  level: number
}

export default function AvatarPanel({ level }: AvatarPanelProps) {
  const { avatarUrl, setAvatarUrl } = useHabitStore()
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Determine default avatar based on level
  const getDefaultAvatarSrc = () => {
    if (level >= 20) return "/placeholder.svg?height=200&width=200"
    if (level >= 10) return "/placeholder.svg?height=200&width=200"
    return "/placeholder.svg?height=200&width=200"
  }

  // Use custom avatar or fall back to default
  const getAvatarSrc = () => {
    return avatarUrl || getDefaultAvatarSrc()
  }

  // Determine rank based on level
  const getRank = () => {
    if (level >= 30) return "Shadow Monarch"
    if (level >= 20) return "S-Rank Hunter"
    if (level >= 10) return "A-Rank Hunter"
    if (level >= 5) return "B-Rank Hunter"
    return "E-Rank Hunter"
  }
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setIsUploading(true)
    setUploadError(null)
    
    try {
      // Validate the file
      const isValid = await validateImageFile(file)
      if (!isValid) {
        setUploadError("Invalid image file. Please use JPG, PNG, GIF, or WebP format, max 5MB.")
        toast({
          title: "Invalid image",
          description: "Please use JPG, PNG, GIF, or WebP format, max 5MB.",
          variant: "destructive",
        })
        setIsUploading(false)
        return
      }
      
      // Read the file and convert it to a data URL
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const dataUrl = e.target?.result as string
          
          // Resize the image to a perfect square (1:1 aspect ratio)
          const resizedImage = await resizeImage(dataUrl, { 
            maxWidth: 400, 
            maxHeight: 400, 
            quality: 0.9 
          })
          
          // Save to store
          setAvatarUrl(resizedImage)
          toast({
            title: "Avatar updated",
            description: "Your profile picture has been cropped to a 1:1 ratio.",
            variant: "default",
          })
        } catch (error) {
          setUploadError("Failed to process image")
          toast({
            title: "Upload failed",
            description: "Failed to process the image. Please try a different one.",
            variant: "destructive",
          })
          console.error("Error processing image:", error)
        } finally {
          setIsUploading(false)
        }
      }
      
      reader.onerror = () => {
        setUploadError("Error reading file")
        toast({
          title: "Upload failed",
          description: "Failed to read the image. Please try a different one.",
          variant: "destructive",
        })
        setIsUploading(false)
      }
      
      reader.readAsDataURL(file)
    } catch (error) {
      setUploadError("Error processing file")
      setIsUploading(false)
    }
    
    // Reset the input so the same file can be selected again
    event.target.value = ""
  }
  
  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }
  
  const handleRemoveAvatar = () => {
    setAvatarUrl(null)
    setIsDeleteDialogOpen(false)
    toast({
      title: "Avatar removed",
      description: "Your custom avatar has been removed.",
      variant: "default",
    })
  }

  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4 text-cyan-400">Your Avatar</h2>

        <motion.div whileHover={{ scale: 1.05 }} className="relative w-40 h-40 mb-4">
          <div className="absolute inset-0 bg-cyan-500 rounded-full opacity-20 animate-pulse" />
          <div className="relative">
            <Image
              src={getAvatarSrc()}
              alt="Player Avatar"
              width={160}
              height={160}
              className={`rounded-full border-4 border-cyan-600 object-cover w-40 h-40 ${isUploading ? 'opacity-50' : ''}`}
              unoptimized={!!avatarUrl} // Skip optimization for custom avatars
              style={{ aspectRatio: "1/1" }} // Ensure 1:1 aspect ratio
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Upload overlay - show on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200">
              <Upload className="h-6 w-6 text-white mb-2" />
              <span className="text-white text-xs font-medium">Upload 1:1 Image</span>
            </div>
          </div>
          
          <motion.div
            className="absolute -bottom-2 -right-2 bg-cyan-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {level}
          </motion.div>
          
          {/* Hidden file input */}
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          
          {/* Make the entire avatar clickable for upload */}
          <Button 
            onClick={handleClickUpload} 
            size="sm" 
            variant="ghost" 
            className="absolute inset-0 rounded-full opacity-0 cursor-pointer"
            disabled={isUploading}
          >
            <span className="sr-only">Upload avatar</span>
          </Button>
          
          {/* Remove button */}
          {avatarUrl && (
            <Button 
              onClick={() => setIsDeleteDialogOpen(true)} 
              size="sm" 
              variant="ghost" 
              className="absolute top-0 left-0 rounded-full p-2 bg-gray-800 opacity-80 hover:opacity-100"
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          )}
        </motion.div>

        <Button
          onClick={handleClickUpload}
          variant="outline"
          size="sm"
          className="mb-3 border-cyan-600 text-cyan-400 hover:bg-cyan-900 hover:text-cyan-300"
          disabled={isUploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {avatarUrl ? "Change Avatar" : "Upload Avatar"}
        </Button>
        
        <div className="text-center">
          <h3 className="text-lg font-bold">{getRank()}</h3>
          <p className="text-gray-400 text-sm">Continue completing quests to evolve!</p>
        </div>
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Remove Avatar</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to remove your custom avatar? This will restore the default avatar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveAvatar} className="bg-red-600 hover:bg-red-700">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
