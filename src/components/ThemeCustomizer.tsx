import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Paintbrush, Sparkles } from "lucide-react";

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export function ThemeCustomizer() {
  const { user, updateUser } = useAuth();
  const [seasonalEnabled, setSeasonalEnabled] = useState(user?.seasonalThemeEnabled || false);
  const [colors, setColors] = useState<ColorScheme>(
    user?.themeSettings?.colors || {
      primary: "#000000",
      secondary: "#666666",
      accent: "#4F46E5",
      background: "#FFFFFF"
    }
  );

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${user?.id}/theme`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          seasonalThemeEnabled: seasonalEnabled,
          themeSettings: {
            colors
          }
        })
      });

      if (!response.ok) throw new Error('Failed to update theme settings');
      
      const data = await response.json();
      updateUser(data);

      // Apply theme colors
      document.documentElement.style.setProperty('--user-primary', colors.primary);
      document.documentElement.style.setProperty('--user-secondary', colors.secondary);
      document.documentElement.style.setProperty('--user-accent', colors.accent);
      document.documentElement.style.setProperty('--user-background', colors.background);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month === 11 || month === 0) return 'winter'; // December-January
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  };

  const getSeasonalTheme = () => {
    const season = getCurrentSeason();
    const themes = {
      winter: {
        primary: '#1a365d',
        secondary: '#718096',
        accent: '#90cdf4',
        background: '#ebf8ff'
      },
      spring: {
        primary: '#2f855a',
        secondary: '#68d391',
        accent: '#f0fff4',
        background: '#ffffff'
      },
      // Add more seasonal themes
    };
    return themes[season as keyof typeof themes];
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Theme Customization</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Seasonal Theme</Label>
            <p className="text-sm text-muted-foreground">
              Enable special themes for different seasons
            </p>
          </div>
          <Switch 
            checked={seasonalEnabled}
            onCheckedChange={(checked) => {
              setSeasonalEnabled(checked);
              if (checked) {
                setColors(getSeasonalTheme());
              }
            }}
          />
        </div>

        {!seasonalEnabled && (
          <div className="space-y-4">
            <div>
              <Label>Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                  className="w-12 h-12 p-1"
                />
                <Input
                  type="text"
                  value={colors.primary}
                  onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            {/* Repeat for secondary, accent, and background colors */}
          </div>
        )}

        <Button onClick={handleSave} className="w-full">
          {seasonalEnabled ? (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Apply Seasonal Theme
            </>
          ) : (
            <>
              <Paintbrush className="w-4 h-4 mr-2" />
              Save Custom Colors
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}