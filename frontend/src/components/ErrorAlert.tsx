import React from 'react';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';
import { API_BASE_URL } from '../api/client';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry }) => {
  return (
    <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-6 backdrop-blur text-slate-200 shadow-xl space-y-4">
      <div className="flex items-start space-x-3">
        <div className="rounded-lg bg-rose-500/20 p-2 text-rose-400 mt-0.5">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-semibold text-rose-300">
            Analytics Data Connection Notice
          </h4>
          <p className="text-sm text-slate-300 font-mono break-all">{message}</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4 font-mono text-xs text-slate-400 space-y-2">
        <div className="flex items-center text-slate-300 font-medium">
          <Terminal className="h-3.5 w-3.5 mr-1.5 text-brand-400" />
          Troubleshooting API connection to <span className="text-slate-100 ml-1">{API_BASE_URL}</span>:
        </div>
        <p className="text-slate-500 pl-5">
          If the FastAPI backend is not yet running, open a terminal in the project root and run:
        </p>
        <div className="pl-5 text-emerald-400 select-all font-semibold">
          uvicorn backend.main:app --reload --port 8000
        </div>
      </div>

      {onRetry && (
        <div className="flex justify-end pt-1">
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 rounded-lg border border-rose-500/30 bg-rose-500/20 px-3.5 py-2 text-xs font-medium text-rose-200 transition-colors hover:bg-rose-500/30 hover:border-rose-500/50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}
    </div>
  );
};
