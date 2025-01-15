import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";

export function AvatarSettings() {
  const { user, updateUser } = useAuth();
  const [isAnimated, setIsAnimated] = useState(user?.isAnimatedAvatar || false);
  const [animation, setAnimation] = useState(user?.avatarAnimation || 'pulse');
  const [cardStyle, setCardStyle] = useState(user?.avatarStyle || 'minimal');

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${user.id}/avatar-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          isAnimatedAvatar: isAnimated,
          avatarAnimation: animation,
          avatarStyle: cardStyle
        })
      });

      if (!response.ok) throw new Error('Failed to update avatar settings');
      
      const data = await response.json();
      updateUser(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Avatar Customization</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Animated Avatar</span>
          <Switch 
            checked={isAnimated}
            onCheckedChange={setIsAnimated}
          />
        </div>

        {isAnimated && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Animation Style</label>
              <Select
                value={animation}
                onValueChange={setAnimation}
                options={[
                  { value: 'pulse', label: 'Pulse' },
                  { value: 'bounce', label: 'Bounce' },
                  { value: 'rotate', label: 'Rotate' }
                ]}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm mb-2">Card Style</label>
          <Select
            value={cardStyle}
            onValueChange={setCardStyle}
            options={[
              { value: 'minimal', label: 'Minimal' },
              { value: 'glass', label: 'Glass' },
              { value: 'artistic', label: 'Artistic' }
            ]}
          />
        </div>

        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </Card>
  );
}