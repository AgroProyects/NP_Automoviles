'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { VehicleImage } from '@/lib/types';
import { ChevronLeft, ChevronRight, Play, Pause, Video, Volume2, VolumeX, X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageCarouselProps {
  images: VehicleImage[];
  alt: string;
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg bg-gray-200">
        <div className="flex h-full items-center justify-center text-gray-400">
          Sin imágenes disponibles
        </div>
      </div>
    );
  }

  const currentMedia = images[currentIndex];
  const isVideo = currentMedia.media_type === 'video';

  const goToPrevious = () => {
    setIsPlaying(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToImage = (index: number) => {
    setIsPlaying(false);
    setCurrentIndex(index);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.muted = !isMuted;
    }
  };

  const openFullscreen = () => {
    if (!isVideo) {
      setIsFullscreen(true);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = 'unset';
  };

  // Handle escape key to close fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeFullscreen();
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isFullscreen]);

  // Handle arrow keys for navigation in fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'ArrowLeft') {
          goToPrevious();
        } else if (e.key === 'ArrowRight') {
          goToNext();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, images.length]);

  return (
    <>
      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-in fade-in duration-200">
          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 z-50 bg-black/50 rounded-full px-4 py-2 text-white text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-16">
            {currentMedia.media_type === 'video' ? (
              <div className="relative max-w-full max-h-full">
                <video
                  ref={fullscreenVideoRef}
                  src={currentMedia.url}
                  className="max-w-full max-h-[90vh] object-contain"
                  muted={isMuted}
                  playsInline
                  loop
                  controls
                  autoPlay
                />
              </div>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={currentMedia.url}
                  alt={`${alt} - Imagen ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
              >
                <ChevronLeft className="h-8 w-8 text-white" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
              >
                <ChevronRight className="h-8 w-8 text-white" />
              </button>
            </>
          )}

          {/* Thumbnails at bottom */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 max-w-[90vw] overflow-x-auto p-2 bg-black/50 rounded-lg">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => goToImage(index)}
                  className={`relative w-16 h-16 shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? 'border-white ring-2 ring-white'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {image.media_type === 'video' ? (
                    <div className="relative w-full h-full bg-gray-900">
                      <video
                        src={image.url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-4 w-4 text-white fill-white" />
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={image.url}
                      alt={`Miniatura ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    <div className="space-y-4">
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg bg-gray-100">
        {isVideo ? (
          <div className="relative w-full h-full bg-black">
            <video
              ref={videoRef}
              src={currentMedia.url}
              className="w-full h-full object-contain"
              muted={isMuted}
              playsInline
              loop
              onEnded={() => setIsPlaying(false)}
              onClick={togglePlay}
            />
            {/* Video Controls Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="bg-black/60 hover:bg-black/80 rounded-full p-4 transition-all transform hover:scale-110"
                >
                  <Play className="h-12 w-12 text-white fill-white" />
                </button>
              )}
            </div>
            {/* Video Badge */}
            <div className="absolute top-4 right-4 bg-purple-600 rounded-full px-3 py-1 shadow-lg">
              <div className="flex items-center gap-1">
                <Video className="h-4 w-4 text-white" />
                <span className="text-sm font-bold text-white">Video</span>
              </div>
            </div>
            {/* Video Controls */}
            {isPlaying && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={toggleMute}
                  className="bg-black/60 hover:bg-black/80 rounded-full p-2 transition-all"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5 text-white" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-white" />
                  )}
                </button>
                <button
                  onClick={togglePlay}
                  className="bg-black/60 hover:bg-black/80 rounded-full p-2 transition-all"
                >
                  <Pause className="h-5 w-5 text-white" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={openFullscreen}
            className="relative w-full h-full cursor-zoom-in group"
          >
            <Image
              src={currentMedia.url}
              alt={`${alt} - Imagen ${currentIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority={currentIndex === 0}
            />
            {/* Zoom indicator on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-black/60 rounded-full p-3">
                <ZoomIn className="h-6 w-6 text-white" />
              </div>
            </div>
          </button>
        )}

        {images.length > 1 && (
          <>
            {/* Navigation arrows - only visible on desktop */}
            <div className="hidden md:block">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToImage(index)}
              className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                index === currentIndex
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              {image.media_type === 'video' ? (
                <div className="relative w-full h-full bg-gray-900">
                  <video
                    src={image.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/60 rounded-full p-1">
                      <Play className="h-3 w-3 text-white fill-white" />
                    </div>
                  </div>
                </div>
              ) : (
                <Image
                  src={image.url}
                  alt={`${alt} - Miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
