import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Tv, Users } from "lucide-react";

export const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Live Status */}
      <Card className="bg-red-900/50 border-red-700 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tv className="text-yellow-400" />
            開獎實況
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-red-200">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            LIVE 直播中
          </div>
          <div className="mt-2 text-xs text-red-300">
            連結至官方頻道同步播出
          </div>
        </CardContent>
      </Card>

      {/* Witness Info */}
      <Card className="bg-red-900/50 border-red-700 text-white flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
             <CheckCircle2 className="text-green-400" />
            公正見證
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">律師見證</p>
              <p className="text-xs text-red-200">陳大文 律師</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">會計師見證</p>
              <p className="text-xs text-red-200">林小美 會計師</p>
            </div>
          </div>

          <div className="pt-4 border-t border-red-800">
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              符合公益彩券規範
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* App Download Placeholder */}
      <Card className="bg-white text-black mt-auto">
        <CardContent className="p-4 flex gap-4 items-center">
             <div className="h-16 w-16 bg-slate-900 rounded-md flex items-center justify-center text-white text-xs text-center p-1">
                QR Code
             </div>
             <div>
                 <p className="font-bold text-sm">下載官方 APP</p>
                 <p className="text-xs text-slate-500">即時查詢中獎號碼</p>
             </div>
        </CardContent>
      </Card>
    </div>
  );
};
