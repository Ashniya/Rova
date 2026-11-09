import React from 'react';
import { AlertCircle, ArrowRight, Sparkles, RefreshCw, Gift } from 'lucide-react';

interface RecoveryBannerProps {
  disruption: {
    id: string;
    disruptionType: string;
    reason: string;
    recoveryOptions?: Array<{
      id: string;
      alternativeTripId: string;
      compensationOffered: string;
      notes: string;
    }>;
  };
  onSelectAlternative?: (altTripId: string) => void;
}

export const RecoveryBanner: React.FC<RecoveryBannerProps> = ({
  disruption,
  onSelectAlternative,
}) => {
  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-emerald-500/10 border-2 border-amber-300/80 rounded-3xl p-5 sm:p-6 mb-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/25">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider">
                ROVA JOURNEY RECOVERY ENGINE ACTIVE
              </span>
              <span className="text-xs font-bold text-slate-700">
                Notice: {disruption.disruptionType}
              </span>
            </div>
            <p className="text-sm font-black text-slate-900 mt-1">
              {disruption.reason}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              We have automatically matched alternative express departures with priority seat allocation.
            </p>
          </div>
        </div>
      </div>

      {disruption.recoveryOptions && disruption.recoveryOptions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-amber-200/60 grid grid-cols-1 md:grid-cols-2 gap-3">
          {disruption.recoveryOptions.map((opt) => (
            <div
              key={opt.id}
              className="bg-white/90 backdrop-blur rounded-2xl p-4 border border-amber-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700">
                  <Gift className="w-3.5 h-3.5 text-brand-600" />
                  <span>Compensation: {opt.compensationOffered}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{opt.notes}</p>
              </div>
              {onSelectAlternative && opt.alternativeTripId !== 'REFUND_VOUCHER' && (
                <button
                  type="button"
                  onClick={() => onSelectAlternative(opt.alternativeTripId)}
                  className="mt-3 flex items-center justify-center gap-1.5 py-2 px-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all self-start"
                >
                  <span>Accept Re-route</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecoveryBanner;
