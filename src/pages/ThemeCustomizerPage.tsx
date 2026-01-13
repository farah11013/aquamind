import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Palette, Check, RotateCcw, Sparkles } from 'lucide-react';
import { useTheme, presetThemes, type Theme, type ThemeColors } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

const ColorInput = ({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
}) => {
  const hslToHex = (hsl: string): string => {
    const [h, s, l] = hsl.split(' ').map(v => parseFloat(v));
    const hDecimal = h / 360;
    const sDecimal = s / 100;
    const lDecimal = l / 100;
    
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r: number, g: number, b: number;
    if (sDecimal === 0) {
      r = g = b = lDecimal;
    } else {
      const q = lDecimal < 0.5 ? lDecimal * (1 + sDecimal) : lDecimal + sDecimal - lDecimal * sDecimal;
      const p = 2 * lDecimal - q;
      r = hue2rgb(p, q, hDecimal + 1/3);
      g = hue2rgb(p, q, hDecimal);
      b = hue2rgb(p, q, hDecimal - 1/3);
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const hexToHsl = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const hexValue = hslToHex(value);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2">
        <input
          type="color"
          value={hexValue}
          onChange={(e) => onChange(hexToHsl(e.target.value))}
          className="h-10 w-20 rounded border border-border cursor-pointer"
        />
        <div className="flex-1 px-3 py-2 text-sm border border-border rounded bg-muted">
          {value}
        </div>
      </div>
    </div>
  );
};

export default function ThemeCustomizerPage() {
  const { currentTheme, customTheme, isDark, setTheme, setCustomTheme, toggleDarkMode, resetTheme } = useTheme();
  const { toast } = useToast();
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);

  const activeTheme = customTheme || presetThemes[currentTheme];

  const handlePresetSelect = (themeKey: string) => {
    setTheme(themeKey);
    setEditingTheme(null);
    toast({
      title: 'Theme applied',
      description: `${presetThemes[themeKey].name} theme has been applied`,
    });
  };

  const handleStartCustomize = () => {
    setEditingTheme(activeTheme);
  };

  const handleColorChange = (mode: 'light' | 'dark', key: keyof ThemeColors, value: string) => {
    if (!editingTheme) return;
    
    setEditingTheme({
      ...editingTheme,
      [mode]: {
        ...editingTheme[mode],
        [key]: value,
      },
    });
  };

  const handleSaveCustomTheme = () => {
    if (!editingTheme) return;
    
    setCustomTheme(editingTheme);
    toast({
      title: 'Custom theme saved',
      description: 'Your custom theme has been applied',
    });
  };

  const handleReset = () => {
    resetTheme();
    setEditingTheme(null);
    toast({
      title: 'Theme reset',
      description: 'Theme has been reset to default Ocean Blue',
    });
  };

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4">
            <span className="gradient-text">Theme Customizer</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Personalize your BlueWave experience with preset themes or create your own custom color scheme
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Current Theme Info */}
          <Card className="xl:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Current Theme
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {currentTheme === 'custom' ? 'Custom Theme' : activeTheme.name}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={toggleDarkMode}
                  >
                    {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
                {Object.entries(isDark ? activeTheme.dark : activeTheme.light).slice(0, 8).map(([key, value]) => (
                  <div key={key} className="flex flex-col items-center gap-2">
                    <div
                      className="w-16 h-16 rounded-lg border-2 border-border shadow-sm"
                      style={{ backgroundColor: `hsl(${value})` }}
                    />
                    <span className="text-xs text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Preset Themes</TabsTrigger>
            <TabsTrigger value="custom">Custom Theme</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.entries(presetThemes).map(([key, theme]) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    currentTheme === key && !customTheme ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handlePresetSelect(key)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{theme.name}</CardTitle>
                      {currentTheme === key && !customTheme && (
                        <Badge variant="default" className="flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Active
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {Object.entries(theme.light).slice(0, 4).map(([colorKey, value]) => (
                        <div
                          key={colorKey}
                          className="h-12 rounded border border-border"
                          style={{ backgroundColor: `hsl(${value})` }}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(theme.dark).slice(0, 4).map(([colorKey, value]) => (
                        <div
                          key={colorKey}
                          className="h-12 rounded border border-border"
                          style={{ backgroundColor: `hsl(${value})` }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                      Light & Dark Mode Preview
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            {!editingTheme ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Create Custom Theme
                  </CardTitle>
                  <CardDescription>
                    Start with the current theme and customize colors to your preference
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleStartCustomize} size="lg">
                    <Palette className="h-4 w-4 mr-2" />
                    Start Customizing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Customize Colors</CardTitle>
                        <CardDescription>
                          Adjust colors for both light and dark modes
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveCustomTheme}>
                          <Check className="h-4 w-4 mr-2" />
                          Save & Apply
                        </Button>
                        <Button variant="outline" onClick={() => setEditingTheme(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="light" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="light">☀️ Light Mode</TabsTrigger>
                        <TabsTrigger value="dark">🌙 Dark Mode</TabsTrigger>
                      </TabsList>

                      <TabsContent value="light" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {Object.entries(editingTheme.light).map(([key, value]) => (
                            <ColorInput
                              key={key}
                              label={key.replace(/([A-Z])/g, ' $1').trim()}
                              value={value}
                              onChange={(newValue) => handleColorChange('light', key as keyof ThemeColors, newValue)}
                            />
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="dark" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {Object.entries(editingTheme.dark).map(([key, value]) => (
                            <ColorInput
                              key={key}
                              label={key.replace(/([A-Z])/g, ' $1').trim()}
                              value={value}
                              onChange={(newValue) => handleColorChange('dark', key as keyof ThemeColors, newValue)}
                            />
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Preview Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>
                      See how your custom theme looks with sample components
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border border-border rounded-lg space-y-3">
                      <h3 className="text-lg font-semibold">Sample Components</h3>
                      <div className="flex gap-2">
                        <Button>Primary Button</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                      </div>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Sample Card</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            This is how cards will look with your custom theme.
                          </p>
                        </CardContent>
                      </Card>
                      <div className="flex gap-2">
                        <Badge>Default Badge</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
