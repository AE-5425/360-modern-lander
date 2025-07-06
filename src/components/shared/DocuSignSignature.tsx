// src/components/shared/DocuSignSignature.tsx - Enhanced with Drawing & Handwritten Fonts
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Check, X, RotateCcw, Shield, Pen, Type, Trash2 } from 'lucide-react';

interface DocuSignSignatureProps {
  value: string;
  onChange: (signature: string) => void;
  error?: { message?: string };
  fullName?: string;
  required?: boolean;
}

export const DocuSignSignature: React.FC<DocuSignSignatureProps> = ({
  value,
  onChange,
  error,
  fullName = '',
  required = false
}) => {
  const [isEditing, setIsEditing] = useState(!value);
  const [tempSignature, setTempSignature] = useState(value || fullName);
  const [signatureMode, setSignatureMode] = useState<'type' | 'draw'>('type');
  const [isDrawing, setIsDrawing] = useState(false);
  const [handwrittenFont, setHandwrittenFont] = useState('Caveat');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSignature, setCanvasSignature] = useState<string>('');

  // Handwritten font options
  const handwrittenFonts = [
    { name: 'Caveat', label: 'Elegant Script' },
    { name: 'Dancing Script', label: 'Dancing Script' },
    { name: 'Kaushan Script', label: 'Modern Cursive' },
    { name: 'Satisfy', label: 'Classic Signature' },
    { name: 'Allura', label: 'Formal Script' }
  ];

  useEffect(() => {
    // Load Google Fonts dynamically
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Dancing+Script:wght@400;700&family=Kaushan+Script&family=Satisfy&family=Allura&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasEvent>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = '#4338ca';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!canvasRef.current) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    setCanvasSignature(dataURL);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setCanvasSignature('');
  };

  const handleSave = () => {
    if (signatureMode === 'type' && tempSignature.trim()) {
      onChange(tempSignature.trim());
      setIsEditing(false);
    } else if (signatureMode === 'draw' && canvasSignature) {
      onChange(canvasSignature);
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    // Smart signature mode detection and cleanup
    const isCurrentlyDrawn = value && value.startsWith('data:image');
    
    if (isCurrentlyDrawn) {
      // If current signature is drawn, switch to draw mode and clear typed signature
      setSignatureMode('draw');
      setTempSignature(fullName);
      setCanvasSignature(value);
    } else {
      // If current signature is typed, switch to type mode
      setSignatureMode('type');
      setTempSignature(value || fullName);
      setCanvasSignature('');
    }
    
    setIsEditing(true);
    setTimeout(() => {
      if (signatureMode === 'type' && !isCurrentlyDrawn) {
        inputRef.current?.focus();
      }
    }, 100);
  };

  const handleCancel = () => {
    setTempSignature(value || fullName);
    setIsEditing(false);
    clearCanvas();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const isValidSignature = signatureMode === 'type' ? tempSignature.trim().length >= 2 : !!canvasSignature;
  const isDrawnSignature = value && value.startsWith('data:image');

  return (
    <div className="space-y-3">
      <label className="block text-lg font-semibold text-gray-700 flex items-center">
        <Edit3 className="w-5 h-5 mr-3 text-purple-500" />
        Digital Signature
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className={`bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 overflow-hidden ${
        error ? 'border-red-300' : 'border-purple-200'
      }`}>
        {/* Signature Display/Edit Area */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Mode Selection */}
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <motion.button
                    type="button"
                    onClick={() => {
                      setSignatureMode('type');
                      // Clear canvas when switching to type mode
                      clearCanvas();
                      setCanvasSignature('');
                      // Reset typed signature to user's name if switching from draw mode
                      if (signatureMode === 'draw') {
                        setTempSignature(fullName);
                      }
                    }}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      signatureMode === 'type'
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Type Signature
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => {
                      setSignatureMode('draw');
                      // Clear typed signature when switching to draw mode
                      setTempSignature('');
                      // Clear any existing canvas
                      clearCanvas();
                    }}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      signatureMode === 'draw'
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Pen className="w-4 h-4 mr-2" />
                    Draw Signature
                  </motion.button>
                </div>

                {/* Type Mode */}
                {signatureMode === 'type' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type your full legal name
                      </label>
                      <input
                        ref={inputRef}
                        type="text"
                        value={tempSignature}
                        onChange={(e) => setTempSignature(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Enter your full legal name"
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all bg-white ${
                          error 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500/20'
                        } focus:outline-none focus:ring-4`}
                        style={{ 
                          fontSize: '18px',
                          fontFamily: handwrittenFont
                        }}
                      />
                    </div>

                    {/* Font Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose handwriting style
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {handwrittenFonts.map((font) => (
                          <motion.button
                            key={font.name}
                            type="button"
                            onClick={() => setHandwrittenFont(font.name)}
                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                              handwrittenFont === font.name
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div 
                              className="text-lg text-purple-700"
                              style={{ fontFamily: font.name }}
                            >
                              {tempSignature || 'Sample Text'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{font.label}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    {tempSignature && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-sm text-gray-600 mb-2">Preview:</div>
                        <div className="border-b-2 border-gray-300 pb-2">
                          <div 
                            className="text-2xl text-purple-700 font-semibold"
                            style={{ 
                              fontFamily: handwrittenFont,
                              transform: 'rotate(-1deg)',
                              display: 'inline-block'
                            }}
                          >
                            {tempSignature}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Draw Mode */}
                {signatureMode === 'draw' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sign with your mouse or finger
                      </label>
                      <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
                        <canvas
                          ref={canvasRef}
                          width={400}
                          height={150}
                          className="w-full h-32 border border-gray-200 rounded cursor-crosshair touch-none"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                          style={{ touchAction: 'none' }}
                        />
                        <div className="flex justify-between items-center mt-3">
                          <p className="text-sm text-gray-600">Sign above</p>
                          <motion.button
                            type="button"
                            onClick={clearCanvas}
                            className="flex items-center px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Clear
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <motion.button
                    type="button"
                    onClick={handleSave}
                    disabled={!isValidSignature}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      isValidSignature
                        ? 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    whileHover={isValidSignature ? { scale: 1.05 } : {}}
                    whileTap={isValidSignature ? { scale: 0.95 } : {}}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Save Signature
                  </motion.button>
                  
                  {value && (
                    <motion.button
                      type="button"
                      onClick={handleCancel}
                      className="flex items-center px-4 py-2 rounded-lg font-medium bg-gray-500 text-white hover:bg-gray-600 transition-all shadow-md hover:shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="display"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {value ? (
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600">Digital Signature:</span>
                        <motion.button
                          type="button"
                          onClick={handleEdit}
                          className="flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit
                        </motion.button>
                      </div>
                      
                      <div className="border-b-2 border-gray-300 pb-2 mb-4">
                        {isDrawnSignature ? (
                          <img 
                            src={value} 
                            alt="Digital signature" 
                            className="max-h-16 w-auto"
                            style={{ transform: 'rotate(-1deg)' }}
                          />
                        ) : (
                          <div 
                            className="text-2xl text-purple-700 font-semibold"
                            style={{ 
                              fontFamily: handwrittenFont,
                              transform: 'rotate(-1deg)',
                              display: 'inline-block'
                            }}
                          >
                            {value}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Signed on {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} at {new Date().toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    <div className="flex items-center text-green-600 bg-green-50 rounded-lg p-3">
                      <Check className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        Signature captured successfully
                      </span>
                    </div>
                  </div>
                ) : (
                  <motion.button
                    type="button"
                    onClick={handleEdit}
                    className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50/30 transition-all group"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="text-center">
                      <Edit3 className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-3 transition-colors" />
                      <p className="text-gray-600 group-hover:text-purple-700 font-medium transition-colors">
                        Click to add your digital signature
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Type or draw your signature
                      </p>
                    </div>
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security Footer */}
        <div className="bg-purple-100/50 px-6 py-3 border-t border-purple-200">
          <div className="flex items-center text-sm text-purple-700">
            <Shield className="w-4 h-4 mr-2" />
            <span className="font-medium">
              By providing your signature, you are providing a legal electronic signature
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error?.message && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};