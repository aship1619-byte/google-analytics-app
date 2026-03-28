"use client";

import { Lightbulb, AlertTriangle } from "lucide-react";

interface InsightsProps {
    data: {
        insights: string[];
        alerts: string[];
    };
}

export default function InsightsPanel({ data }: InsightsProps) {
    
    if ((!data.insights || data.insights.length === 0) && (!data.alerts || data.alerts.length === 0)) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Critical Alerts Block */}
            {data.alerts && data.alerts.length > 0 && (
                <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-200">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <h3 className="text-lg font-semibold text-red-800">Critical Anomalies Detected</h3>
                    </div>
                    <ul className="space-y-4 text-red-700">
                        {data.alerts.map((alert, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <span className="text-base font-medium">{alert}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Standard Insights Block */}
            {data.insights && data.insights.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E1D8]">
                    <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                        <h3 className="text-lg font-semibold text-[#1A1814]">Overnight AI Intelligence</h3>
                    </div>
                    <ul className="space-y-4 text-[#4A453E]">
                        {data.insights.map((insight, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <span className="text-base">{insight}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
