  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-2">Add a New Poem</h2>
        <div className="space-y-4">
          {/* Existing title input */}
          
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Content</label>
            <div className="flex gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormatting(prev => ({ ...prev, isBold: !prev.isBold }))}
                className={cn(formatting.isBold && "bg-accent")}
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormatting(prev => ({ ...prev, isItalic: !prev.isItalic }))}
                className={cn(formatting.isItalic && "bg-accent")}
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormatting(prev => ({ ...prev, alignment: 'left' }))}
                className={cn(formatting.alignment === 'left' && "bg-accent")}
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormatting(prev => ({ ...prev, alignment: 'center' }))}
                className={cn(formatting.alignment === 'center' && "bg-accent")}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormatting(prev => ({ ...prev, alignment: 'right' }))}
                className={cn(formatting.alignment === 'right' && "bg-accent")}
              >
                <AlignRight className="w-4 h-4" />
              </Button>
              <select
                className="px-2 py-1 border rounded"
                value={formatting.fontSize}
                onChange={(e) => setFormatting(prev => ({ ...prev, fontSize: e.target.value }))}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={cn(
                "w-full",
                formatting.isBold && "font-bold",
                formatting.isItalic && "italic",
                `text-${formatting.alignment}`,
                {
                  'text-sm': formatting.fontSize === 'small',
                  'text-base': formatting.fontSize === 'medium',
                  'text-lg': formatting.fontSize === 'large'
                }
              )}
              required
            />
          </div>
          {/* Rest of the existing code */}
        </div>
      </div>
    </Modal>
  );