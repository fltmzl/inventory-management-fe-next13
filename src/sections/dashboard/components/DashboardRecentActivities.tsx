import { ISODateToLocal } from "@/utils/dateTime";
import { formatToRupiah } from "@/utils/formatToRupiah";
import React from "react";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";

type Props = {
  activities: DashboardRecentActivity[];
};

export default function DashboardRecentActivities({ activities }: Props) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-background p-8 rounded-2xl flex items-center justify-center h-[360px]">
        <p className="text-gray-400">Tidak ada aktivitas terbaru</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-5">Aktivitas Terkini</h1>
      <div className="bg-background p-6 rounded-2xl h-[300px] overflow-y-auto">
        <div className="flex flex-col gap-4">
          {activities.map((act) => {
            const isMasuk = act.tipe === "MASUK";

            return (
              <div key={act.id} className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-full flex-shrink-0 ${
                    isMasuk
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                  }`}
                >
                  {isMasuk ? (
                    <FiArrowDownLeft size={20} />
                  ) : (
                    <FiArrowUpRight size={20} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-semibold text-sm truncate">
                      {isMasuk ? "Barang Masuk" : "Barang Keluar"} ({act.id})
                    </p>
                    <p className="text-xs text-gray-500 flex-shrink-0">
                      {ISODateToLocal(act.tanggal)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {act.keterangan}
                  </p>
                  <p
                    className={`text-sm font-bold mt-1 ${
                      isMasuk ? "text-blue-500" : "text-emerald-500"
                    }`}
                  >
                    {isMasuk ? "+" : "-"} Rp{formatToRupiah(act.hargaTotal)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
