'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, FileText, Trash2, Check, AlertCircle } from 'lucide-react'
import {
  FaRobot, FaFire, FaBrain, FaHammer, FaRocket, FaGlobe,
  FaShieldAlt, FaCode, FaBook, FaFlask, FaGamepad, FaMagic,
  FaHeart, FaMusic, FaPalette, FaCamera, FaLeaf, FaStar,
  FaLightbulb, FaAtom, FaDna, FaMicroscope, FaChartLine, FaLock
} from 'react-icons/fa'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'

interface FileItem {
  id: string
  name: string
  size: number
  content: string
  type: string
  progress: number
  uploaded: boolean
}

interface CustomAIModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (aiId: string) => void
  editingAI?: any
}

const AI_ICONS = [
  { icon: FaRobot, name: 'Robot', color: '#4ECDC4' },
  { icon: FaFire, name: 'Fire', color: '#E85A4F' },
  { icon: FaBrain, name: 'Brain', color: '#A8E6CF' },
  { icon: FaHammer, name: 'Hammer', color: '#FFD93D' },
  { icon: FaRocket, name: 'Rocket', color: '#6BCF7F' },
  { icon: FaGlobe, name: 'Globe', color: '#4D9DE0' },
  { icon: FaShieldAlt, name: 'Shield', color: '#E15554' },
  { icon: FaCode, name: 'Code', color: '#3BB273' },
  { icon: FaBook, name: 'Book', color: '#F7931E' },
  { icon: FaFlask, name: 'Flask', color: '#9B59B6' },
  { icon: FaGamepad, name: 'Game', color: '#FF6B9D' },
  { icon: FaMagic, name: 'Magic', color: '#8E44AD' },
  { icon: FaHeart, name: 'Heart', color: '#E74C3C' },
  { icon: FaMusic, name: 'Music', color: '#1ABC9C' },
  { icon: FaPalette, name: 'Palette', color: '#E67E22' },
  { icon: FaCamera, name: 'Camera', color: '#34495E' },
  { icon: FaLeaf, name: 'Leaf', color: '#27AE60' },
  { icon: FaStar, name: 'Star', color: '#F39C12' },
  { icon: FaLightbulb, name: 'Lightbulb', color: '#F1C40F' },
  { icon: FaAtom, name: 'Atom', color: '#3498DB' },
  { icon: FaDna, name: 'DNA', color: '#9B59B6' },
  { icon: FaMicroscope, name: 'Microscope', color: '#2ECC71' },
  { icon: FaChartLine, name: 'Chart', color: '#E74C3C' },
  { icon: FaLock, name: 'Lock', color: '#95A5A6' }
]

const PROCESSING_STEPS = [
  "Analyzing uploaded files",
  "Extracting knowledge content",
  "Building knowledge graph",
  "Creating entity relationships",
  "Generating embeddings",
  "Optimizing for retrieval",
  "Finalizing AI assistant"
]

const CustomAIModal: React.FC<CustomAIModalProps> = ({ isOpen, onClose, onSuccess, editingAI }) => {
  const {user} = useAuth()
  const [aiName, setAiName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedIcon, setSelectedIcon] = useState(AI_ICONS[0])
  const [files, setFiles] = useState<FileItem[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [totalSize, setTotalSize] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [processingDots, setProcessingDots] = useState(1)
  const [error, setError] = useState('')
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [processingProgress, setProcessingProgress] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragRef = useRef<HTMLDivElement>(null)

  const MAX_SIZE = 150 * 1024 * 1024 // 150MB

  useEffect(() => {
    if (editingAI) {
      setAiName(editingAI.name)
      setDescription(editingAI.description || '')
      const iconData = AI_ICONS.find(icon => icon.name === editingAI.icon) || AI_ICONS[0]
      setSelectedIcon(iconData)

      if (editingAI.knowledgeFiles) {
        const existingFiles = editingAI.knowledgeFiles.map((file: any, index: number) => ({
          id: `existing-${index}`,
          name: file.filename || `File ${index + 1}`,
          size: file.size || 0,
          content: file.content || '',
          type: file.type || 'text',
          progress: 100,
          uploaded: true
        }))
        setFiles(existingFiles)
        setTotalSize(existingFiles.reduce((sum: number, file: { size: number }) => sum + file.size, 0))
      }
    }
  }, [editingAI])

  useEffect(() => {
    const total = files.reduce((sum, file) => sum + file.size, 0)
    setTotalSize(total)
  }, [files])

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProcessingDots(prev => (prev % 3) + 1)
      }, 500)
      return () => clearInterval(interval)
    }
  }, [isProcessing])

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProcessingStep(prev => (prev + 1) % PROCESSING_STEPS.length)
        setProcessingProgress(prev => Math.min(prev + (100 / PROCESSING_STEPS.length), 95))
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isProcessing])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }

  const processFiles = async (fileList: File[]) => {
    const validTypes = ['text/plain', 'application/pdf', 'application/json', 'text/markdown', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

    for (const file of fileList) {
      if (!validTypes.includes(file.type) && !file.name.match(/\.(txt|md|json|pdf|docx)$/i)) {
        setError(`File type not supported: ${file.name}`)
        continue
      }

      if (totalSize + file.size > MAX_SIZE) {
        setError(`File too large. Total size would exceed 150MB limit.`)
        continue
      }

      const fileId = `file-${Date.now()}-${Math.random()}`
      const newFile: FileItem = {
        id: fileId,
        name: file.name,
        size: file.size,
        content: '',
        type: file.type,
        progress: 0,
        uploaded: false
      }

      setFiles(prev => [...prev, newFile])

      const reader = new FileReader()

      reader.onload = (e) => {
        const content = e.target?.result as string
        setFiles(prev => prev.map(f =>
            f.id === fileId
                ? {...f, content, progress: 100, uploaded: true}
                : f
        ))
      }

      reader.onerror = () => {
        setFiles(prev => prev.filter(f => f.id !== fileId))
        setError(`Failed to read file: ${file.name}`)
      }

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100
          setFiles(prev => prev.map(f =>
              f.id === fileId
                  ? {...f, progress}
                  : f
          ))
        }
      }

      if (file.type === 'application/pdf') {
        reader.readAsArrayBuffer(file)
      } else {
        reader.readAsText(file)
      }
    }
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const calculateEstimatedTime = () => {
    const totalChars = files.reduce((sum, file) => sum + file.content.length, 0)
    return Math.ceil(totalChars / 3000) * 30
  }

  const handleCreateAI = async () => {
    if (!aiName.trim() || files.length === 0) {
      setError('Please provide a name and upload at least one file')
      return
    }

    setIsProcessing(true)
    setError('')
    setProcessingProgress(0)
    setEstimatedTime(calculateEstimatedTime())

    try {
      const fileData = files
          .filter(f => f.uploaded && f.content)
          .map(file => {
            const blob = new Blob([file.content], {type: file.type})
            return new File([blob], file.name, {type: file.type})
          })

      if (fileData.length === 0) {
        throw new Error('No valid files to upload')
      }

      setProcessingStep(0)
      await apiClient.uploadFiles(fileData)
      setProcessingProgress(20)

      setProcessingStep(1)
      const result = await apiClient.createCustomAI(aiName, description)
      setProcessingProgress(60)

      setProcessingStep(4)
      await new Promise(resolve => setTimeout(resolve, 2000))
      setProcessingProgress(90)

      setProcessingStep(6)
      setProcessingProgress(100)

      setTimeout(() => {
        setIsProcessing(false)
        onClose()
        setFiles([])
        setAiName('')
        setDescription('')
        window.location.href = `/chat/custom/${result.ai_id}`
      }, 1000)

    } catch (err: any) {
      console.error('Custom AI creation failed:', err)
      setError(err.message || 'Failed to create AI. Please try again.')
      setIsProcessing(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getProcessingText = () => {
    const step = PROCESSING_STEPS[processingStep]
    return step + '.'.repeat(processingDots)
  }

  if (!isOpen) return null

  return (
      <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 p-6">
              <motion.div
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]"
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  exit={{opacity: 0}}
                  onClick={onClose}
              />

              <motion.div
                  className="relative mx-auto w-full max-w-4xl bg-bg-secondary/90 backdrop-blur-xl border border-neon-pink/20 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                  initial={{opacity: 0, scale: 0.9, y: 20}}
                  animate={{opacity: 1, scale: 1, y: 0}}
                  exit={{opacity: 0, scale: 0.9, y: 20}}
                  transition={{duration: 0.3}}
              >
                <div className="flex items-center justify-between p-6 border-b border-neon-pink/20">
                  <h2 className="text-2xl font-bold text-soft-cream">
                    {editingAI ? 'Edit Custom AI' : 'Create Custom AI'}
                  </h2>
                  <button
                      onClick={onClose}
                      className="p-2 hover:bg-neon-pink/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-soft-warmGray"/>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="bg-bg-tertiary/50 rounded-xl p-4 border border-neon-blue/20">
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{backgroundColor: selectedIcon.color + '20'}}
                      >
                        <selectedIcon.icon
                            className="w-6 h-6"
                            style={{color: selectedIcon.color}}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-soft-cream">
                          {aiName || 'Your Custom AI'}
                        </h3>
                        <p className="text-sm text-soft-warmGray">
                          {description || 'AI assistant description'}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-soft-warmGray">
                      Knowledge: {formatFileSize(totalSize)} • {files.length} files
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-soft-cream mb-2">
                        AI Name *
                      </label>
                      <input
                          type="text"
                          value={aiName}
                          onChange={(e) => setAiName(e.target.value)}
                          className="w-full px-4 py-3 bg-bg-tertiary/50 border border-neon-blue/20 rounded-xl text-soft-cream placeholder-soft-warmGray focus:border-neon-pink/50 focus:outline-none transition-colors"
                          placeholder="Enter AI name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-soft-cream mb-2">
                        Description
                      </label>
                      <input
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-4 py-3 bg-bg-tertiary/50 border border-neon-blue/20 rounded-xl text-soft-cream placeholder-soft-warmGray focus:border-neon-pink/50 focus:outline-none transition-colors"
                          placeholder="Brief description"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-cream mb-4">
                      Choose Icon
                    </label>
                    <div className="grid grid-cols-8 gap-3">
                      {AI_ICONS.map((iconData, index) => (
                          <button
                              key={index}
                              onClick={() => setSelectedIcon(iconData)}
                              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                                  selectedIcon.name === iconData.name
                                      ? 'bg-neon-pink/20 border-2 border-neon-pink/50 scale-110'
                                      : 'bg-bg-tertiary/50 border border-neon-blue/20 hover:border-neon-pink/30 hover:scale-105'
                              }`}
                          >
                            <iconData.icon
                                className="w-6 h-6"
                                style={{color: iconData.color}}
                            />
                          </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-cream mb-4">
                      Upload Knowledge Files
                    </label>

                    <div
                        ref={dragRef}
                        className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                            dragActive
                                ? 'border-neon-pink/50 bg-neon-pink/10'
                                : 'border-neon-blue/30 bg-bg-tertiary/20'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-neon-blue mx-auto mb-4"/>
                        <p className="text-lg font-medium text-soft-cream mb-2">
                          Drop files here or click to browse
                        </p>
                        <p className="text-sm text-soft-warmGray">
                          Supports .txt, .md, .json, .pdf, .docx
                        </p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-4 px-6 py-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue/30 transition-colors"
                        >
                          Browse Files
                        </button>
                      </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".txt,.md,.json,.pdf,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                  </div>

                  {files.length > 0 && (
                      <div className="bg-bg-tertiary/50 rounded-xl p-4 border border-neon-blue/20">
                        <h4 className="text-sm font-medium text-soft-cream mb-4">
                          Uploaded Files ({files.length})
                        </h4>
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                          {files.map((file, index) => (
                              <div key={file.id} className="flex items-center space-x-3">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                            <span className="text-xs text-soft-warmGray w-6">
                              {index + 1}
                            </span>
                                      <FileText className="w-4 h-4 text-neon-blue"/>
                                      <span className="text-sm text-soft-cream">
                              {file.name}
                            </span>
                                      <span className="text-xs text-soft-warmGray">
                              {formatFileSize(file.size)}
                            </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {file.uploaded && (
                                          <Check className="w-4 h-4 text-green-400"/>
                                      )}
                                      <button
                                          onClick={() => removeFile(file.id)}
                                          className="p-1 hover:bg-red-500/20 rounded"
                                      >
                                        <Trash2 className="w-3 h-3 text-red-400"/>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="mt-1 bg-bg-primary/50 rounded-full h-1">
                                    <div
                                        className="h-1 bg-neon-blue rounded-full transition-all duration-200"
                                        style={{width: `${file.progress}%`}}
                                    />
                                  </div>
                                </div>
                              </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-neon-blue/20">
                          <div className="flex justify-between text-sm">
                            <span className="text-soft-warmGray">Total Size:</span>
                            <span className="text-soft-cream">
                      {formatFileSize(totalSize)} / {formatFileSize(MAX_SIZE)}
                    </span>
                          </div>
                        </div>
                      </div>
                  )}

                  {isProcessing && (
                      <div className="bg-bg-tertiary/50 rounded-xl p-6 border border-neon-pink/20">
                        <div className="flex items-center space-x-3 mb-4">
                          <div
                              className="w-8 h-8 border-2 border-neon-pink border-t-transparent rounded-full animate-spin"/>
                          <div>
                            <h4 className="text-lg font-medium text-soft-cream">
                              Creating Your AI Assistant
                            </h4>
                            <p className="text-sm text-soft-warmGray">
                              {getProcessingText()}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-soft-warmGray">Progress</span>
                            <span className="text-soft-cream">{Math.round(processingProgress)}%</span>
                          </div>
                          <div className="bg-bg-primary/50 rounded-full h-2">
                            <div
                                className="h-2 bg-gradient-to-r from-neon-pink to-neon-blue rounded-full transition-all duration-500"
                                style={{width: `${processingProgress}%`}}
                            />
                          </div>
                          <div className="text-xs text-soft-warmGray">
                            Estimated
                            time: {Math.max(0, estimatedTime - Math.round(processingProgress / 100 * estimatedTime))}s
                            remaining
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-bg-primary/30 rounded-lg">
                          <p className="text-xs text-soft-warmGray">
                            💡 <strong>Pro tip:</strong> You can close this tab and come back in 5-10 minutes.
                            Your AI will be ready! Or upload fewer files to speed up the process.
                          </p>
                        </div>
                      </div>
                  )}

                  {error && (
                      <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-5 h-5 text-red-400"/>
                          <div>
                            <p className="text-red-400 font-medium">{error}</p>
                            <p className="text-xs text-red-300 mt-1">
                              Need help? Contact aliabdykaimov@gmail.com
                            </p>
                          </div>
                        </div>
                      </div>
                  )}
                </div>

                <div className="sticky bottom-0 bg-bg-secondary/95 backdrop-blur-sm border-t border-neon-pink/20 p-3">
                  <div className="flex justify-between items-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-soft-warmGray hover:text-soft-cream transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                        onClick={handleCreateAI}
                        disabled={!aiName.trim() || files.length === 0 || isProcessing}
                        className="px-4 py-2.5 bg-gradient-to-r from-neon-pink to-neon-blue text-soft-cream rounded-xl font-medium hover:shadow-lg hover:shadow-neon-pink/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isProcessing ? 'Creating...' : editingAI ? 'Update AI' : 'Create AI'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
        )}
      </AnimatePresence>
  )
}

export default CustomAIModal