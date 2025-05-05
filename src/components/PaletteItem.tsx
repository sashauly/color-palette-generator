import { Palette } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch } from "@/store/store";
import { toggleUsedPalette } from "@/store/paletteSlice";

interface PaletteItemProps {
  palette: Palette;
}

const PaletteItem = ({ palette }: PaletteItemProps) => {
  const dispatch = useAppDispatch();

  const handleToggleUsed = () => {
    dispatch(toggleUsedPalette(palette.id));
  };

  return (
    <li
      className={`
        flex items-center p-2 
        color-palette-item
        cursor-pointer
        border rounded-lg overflow-hidden
        ${palette.used ? "border-primary/50" : "border-border"}
      `}
    >
      <Checkbox
        id={`palette-${palette.id}`}
        checked={palette.used}
        onCheckedChange={handleToggleUsed}
        className="h-5 w-5 mr-3"
      />

      <label
        htmlFor={`palette-${palette.id}`}
        className="flex-1 flex items-center cursor-pointer"
      >
        <div className="flex gap-1 w-full">
          {palette.colors.map((color, idx) => (
            <div
              key={`${palette.id}-${idx}`}
              className="color-swatch flex-1 rounded-md border border-gray-200 dark:border-gray-700"
              style={{
                backgroundColor: color.value,
                height: "60px",
              }}
              title={color.value}
            />
          ))}
        </div>
      </label>
    </li>
  );
};

export default PaletteItem;
