'use client';

import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import { OpportunityFormData } from '../NewOpportunityWizard';

export default function RfpLinksForm() {
  const [newLink, setNewLink] = useState('');
  const { watch, setValue } = useFormContext<OpportunityFormData>();
  
  const rfpLinks = watch('rfpLinks') || [];

  const addLink = () => {
    if (!newLink.trim() || !isValidUrl(newLink)) return;
    
    setValue('rfpLinks', [...rfpLinks, newLink]);
    setNewLink('');
  };

  const removeLink = (index: number) => {
    const updatedLinks = [...rfpLinks];
    updatedLinks.splice(index, 1);
    setValue('rfpLinks', updatedLinks);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">RFP Links</h3>
      <p className="text-sm text-gray-500">
        Add relevant links to RFP documents or websites (optional).
      </p>

      <div className="flex space-x-2">
        <Input
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          placeholder="Enter URL"
          className="flex-1"
        />
        <Button 
          type="button" 
          variant="secondary" 
          onClick={addLink}
          disabled={!newLink.trim() || !isValidUrl(newLink)}
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Add
        </Button>
      </div>

      <div className="space-y-2 mt-4">
        {rfpLinks.length === 0 ? (
          <div className="text-sm text-gray-500 italic">
            No RFP links added yet. This field is optional.
          </div>
        ) : (
          <div className="space-y-2">
            {rfpLinks.map((link, index) => (
              <div key={index} className="flex items-center justify-between bg-secondary/20 p-2 rounded-md">
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline truncate max-w-[400px]"
                >
                  {link}
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLink(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 