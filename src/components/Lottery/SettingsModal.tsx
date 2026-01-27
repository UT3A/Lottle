import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Settings, Upload, Trash2, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface SettingsModalProps {
  onPoolUpdate: (pool: string[]) => void;
  currentPoolSize: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onPoolUpdate,
  currentPoolSize,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [csvContent, setCsvContent] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvContent(text);
      };
      reader.readAsText(file);
    }
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCsvContent(e.target.value);
    setFileName(null);
  };

  const handleSave = () => {
    // Simple CSV parsing: split by newlines or commas, trim whitespace, remove empty
    const items = csvContent
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    onPoolUpdate(items);
    setIsOpen(false);
  };

  const handleResetToDefault = () => {
    // Reset to empty array (app will handle default 1-39 logic if pool is empty)
    onPoolUpdate([]);
    setCsvContent("");
    setFileName(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 text-white border-none">
          <Settings className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle>設定資料來源</DialogTitle>
          <DialogDescription className="text-slate-400">
            上傳 CSV 檔案或手動輸入抽獎名單。若為空，則預設為 1-39 號隨機數字。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="csv-upload" className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-slate-600 rounded-md p-4 hover:bg-slate-800 transition-colors">
              <Upload className="h-5 w-5 text-slate-400" />
              <span className="text-sm text-slate-300">
                {fileName ? `已選擇: ${fileName}` : "點擊上傳 CSV 檔案"}
              </span>
              <Input
                id="csv-upload"
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={handleFileUpload}
              />
            </Label>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="manual-input">或手動輸入 (以逗號或換行分隔)</Label>
            <Textarea
              id="manual-input"
              placeholder="例如: 王小明, 李大同, 張三..."
              value={csvContent}
              onChange={handleManualInput}
              className="bg-slate-800 border-slate-600 text-white h-32"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>目前清單數量: {itemsCount(csvContent)}</span>
            <span>當前生效數量: {currentPoolSize > 0 ? currentPoolSize : "(預設 1-39)"}</span>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between gap-2">
           <Button variant="destructive" onClick={handleResetToDefault} className="gap-2">
            <Trash2 className="h-4 w-4" /> 重置為預設
          </Button>
          <Button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
            儲存設定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper to count potential items
function itemsCount(text: string) {
  return text
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0).length;
}
