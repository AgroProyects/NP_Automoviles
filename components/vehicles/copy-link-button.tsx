'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check } from 'lucide-react';

interface CopyLinkButtonProps {
  className?: string;
}

export function CopyLinkButton({ className }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      className={className}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 md:h-5 md:w-5 mr-2" />
          ¡Copiado!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 md:h-5 md:w-5 mr-2" />
          Copiar Link
        </>
      )}
    </Button>
  );
}
