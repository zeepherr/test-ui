import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

const themes = [
  {
    label: "Light",
    value: "light",
  },
  {
    label: "Dark",
    value: "dark",
  },
  {
    label: "System",
    value: "system",
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border p-1">
      {themes.map((item) => (
        <Button
          key={item.value}
          type="button"
          size="sm"
          variant={theme === item.value ? "default" : "ghost"}
          onClick={() => setTheme(item.value)}
          aria-pressed={theme === item.value}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
