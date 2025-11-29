import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Medication } from '../types';
import { Pill, Trash2, Package, Leaf } from 'lucide-react';

interface MedicationListProps {
  medications: Medication[];
  onDelete: (id: string) => void;
}

const typeConfig = {
  prescription: { label: '処方薬', icon: Pill, color: 'bg-blue-100 text-blue-700' },
  otc: { label: '市販薬', icon: Package, color: 'bg-green-100 text-green-700' },
  supplement: { label: 'サプリ', icon: Leaf, color: 'bg-amber-100 text-amber-700' },
};

export function MedicationList({ medications, onDelete }: MedicationListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">登録済みリスト ({medications.length}件)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {medications.map((med) => {
            const config = typeConfig[med.type];
            const Icon = config.icon;

            return (
              <div
                key={med.id}
                className="flex items-start sm:items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
              >
                <Icon className="size-4 sm:size-5 text-gray-600 shrink-0 mt-0.5 sm:mt-0" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm sm:text-base truncate">{med.name}</span>
                    <Badge className={`${config.color} text-xs`}>
                      {config.label}
                    </Badge>
                    {!med.currentlyTaking && (
                      <Badge variant="outline" className="text-xs">
                        服用停止
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-2 mt-1 text-xs sm:text-sm text-gray-600">
                    {med.dosage && <span>{med.dosage}</span>}
                    {med.ingredient && (
                      <span className="text-amber-700">
                        主成分: {med.ingredient}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(med.id)}
                  className="shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity h-8 w-8 sm:h-auto sm:w-auto p-1 sm:p-2"
                >
                  <Trash2 className="size-4 text-red-600" />
                  <span className="sr-only">削除</span>
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}