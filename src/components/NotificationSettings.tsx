import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast'; // Fix the import

interface NotificationPreferences {
  emailLikes: boolean;
  emailComments: boolean;
  emailFollows: boolean;
  pushLikes: boolean;
  pushComments: boolean;
  pushFollows: false;
}

export function NotificationSettings() {
  const { user } = useAuth();
  const { toast } = useToast(); // Now correctly imported
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailLikes: false,
    emailComments: false,
    emailFollows: false,
    pushLikes: false,
    pushComments: false,
    pushFollows: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3001/api/notifications/preferences', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch preferences');
        
        const data = await response.json();
        setPreferences(data);
      } catch (error) {
        console.error('Error fetching preferences:', error);
        toast({
          title: "Error",
          description: "Failed to load notification preferences",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [user, toast]);

  const handlePreferenceChange = async (key: keyof NotificationPreferences, value: boolean) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [key]: value })
      });

      if (!response.ok) throw new Error('Failed to update preferences');

      setPreferences(prev => ({ ...prev, [key]: value }));
      toast({
        title: "Success",
        description: "Notification preferences updated"
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notification Settings</h2>
        <Button 
          variant="outline" 
          disabled={isLoading}
          onClick={() => {
            if (window.Notification?.permission !== 'granted') {
              Notification.requestPermission();
            }
          }}
        >
          Enable Push Notifications
        </Button>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Email Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-likes">Likes on your posts</Label>
              <Switch 
                id="email-likes"
                checked={preferences.emailLikes}
                onCheckedChange={(checked) => handlePreferenceChange('emailLikes', checked)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-comments">Comments on your posts</Label>
              <Switch 
                id="email-comments"
                checked={preferences.emailComments}
                onCheckedChange={(checked) => handlePreferenceChange('emailComments', checked)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-follows">New followers</Label>
              <Switch 
                id="email-follows"
                checked={preferences.emailFollows}
                onCheckedChange={(checked) => handlePreferenceChange('emailFollows', checked)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Push Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-likes">Likes on your posts</Label>
              <Switch 
                id="push-likes"
                checked={preferences.pushLikes}
                onCheckedChange={(checked) => handlePreferenceChange('pushLikes', checked)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-comments">Comments on your posts</Label>
              <Switch 
                id="push-comments"
                checked={preferences.pushComments}
                onCheckedChange={(checked) => handlePreferenceChange('pushComments', checked)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-follows">New followers</Label>
              <Switch 
                id="push-follows"
                checked={preferences.pushFollows}
                onCheckedChange={(checked) => handlePreferenceChange('pushFollows', checked)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}