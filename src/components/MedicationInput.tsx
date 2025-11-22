import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { medicationMaster } from "../data/medicationMaster";
import { Medication } from "../types";
import { Plus, Search } from "lucide-react";

interface MedicationInputProps {
  onAdd: (medication: Medication) => void;
}

export function MedicationInput({
  onAdd,
}: MedicationInputProps) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [type, setType] = useState<
    "prescription" | "otc" | "supplement"
  >("prescription");
  const [currentlyTaking, setCurrentlyTaking] = useState(true);
  const [ingredient, setIngredient] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input
  const suggestions = useMemo(() => {
    if (name.trim().length === 0) return [];

    const searchTerm = name.toLowerCase().trim();
    return medicationMaster
      .filter(
        (med) =>
          med.type === type &&
          (med.name.toLowerCase().includes(searchTerm) ||
            (med.ingredient &&
              med.ingredient
                .toLowerCase()
                .includes(searchTerm))),
      )
      .slice(0, 8); // Show up to 8 suggestions
  }, [name, type]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    // Check if supplement and extract ingredient
    let finalIngredient = ingredient;
    if (type === "supplement" && !ingredient) {
      const found = medicationMaster.find(
        (med) => med.name === name && med.type === "supplement",
      );
      if (found?.ingredient) {
        finalIngredient = found.ingredient;
      }
    }

    const medication: Medication = {
      id: Date.now().toString(),
      name: name.trim(),
      dosage: dosage.trim() || undefined,
      type,
      currentlyTaking,
      ingredient: finalIngredient || undefined,
    };

    onAdd(medication);

    // Reset form
    setName("");
    setDosage("");
    setIngredient("");
    setCurrentlyTaking(true);
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (
    suggestion: (typeof medicationMaster)[0],
  ) => {
    setName(suggestion.name);
    if (suggestion.ingredient) {
      setIngredient(suggestion.ingredient);
    }
    setShowSuggestions(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Plus className="size-4 sm:size-5 shrink-0" />
          薬・サプリメントの登録
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 sm:space-y-4"
        >
          {/* Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="type">種類</Label>
            <Select
              value={type}
              onValueChange={(value: any) => {
                setType(value);
                setName("");
                setIngredient("");
              }}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prescription">
                  処方薬
                </SelectItem>
                <SelectItem value="otc">市販薬</SelectItem>
                <SelectItem value="supplement">
                  サプリメント
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Name Input with Autocomplete */}
          <div
            className="space-y-2 relative"
            ref={containerRef}
          >
            <Label htmlFor="name">
              {type === "supplement"
                ? "サプリメント名"
                : "薬剤名"}
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="relative">
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={
                  type === "supplement"
                    ? "サプリメント名を入力"
                    : "薬剤名を入力"
                }
                required
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                <div className="px-3 py-2 bg-gray-50 border-b text-xs text-gray-600">
                  {suggestions.length}件の候補
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      handleSelectSuggestion(suggestion)
                    }
                    className="w-full text-left px-3 sm:px-4 py-2.5 hover:bg-blue-50 border-b last:border-b-0 transition-colors"
                  >
                    <div className="text-sm">
                      {suggestion.name}
                    </div>
                    {suggestion.ingredient && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        主成分: {suggestion.ingredient}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* No suggestions found */}
            {showSuggestions &&
              name.trim().length > 0 &&
              suggestions.length === 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10 mt-1">
                  <div className="px-3 sm:px-4 py-3 text-sm text-gray-500 text-center">
                    該当する薬剤が見つかりませんでした
                  </div>
                </div>
              )}
          </div>

          {/* Ingredient for Supplements */}
          {type === "supplement" && (
            <div className="space-y-2">
              <Label htmlFor="ingredient">
                主成分
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="ingredient"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                placeholder="例: ビタミンK、セントジョーンズワート"
                required={type === "supplement"}
              />
              <p className="text-xs text-gray-500">
                ※ サプリメントの場合、主成分の入力が必要です
              </p>
            </div>
          )}

          {/* Dosage */}
          <div className="space-y-2">
            <Label htmlFor="dosage">用量（任意）</Label>
            <Input
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="例: 5mg、1錠"
            />
          </div>

          {/* Currently Taking */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="currently-taking"
              checked={currentlyTaking}
              onCheckedChange={(checked) =>
                setCurrentlyTaking(checked === true)
              }
            />
            <Label
              htmlFor="currently-taking"
              className="cursor-pointer text-sm sm:text-base"
            >
              現在服用中
            </Label>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            <Plus className="size-4 mr-2" />
            登録する
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}