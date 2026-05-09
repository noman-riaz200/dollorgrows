import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, TrendingUp as TrendingUpIcon } from 'lucide-react';

export default function StatCard({ 
    title, 
    value, 
    change, 
    icon: Icon,
    color = 'blue',
    loading = false 
}) {
    const isPositive = change && change.startsWith('+');
    
    const colorClasses = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', iconBg: 'bg-blue-500' },
        green: { bg: 'bg-green-100', text: 'text-green-600', iconBg: 'bg-green-500' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600', iconBg: 'bg-purple-500' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-600', iconBg: 'bg-orange-500' },
        red: { bg: 'bg-red-100', text: 'text-red-600', iconBg: 'bg-red-500' },
    };

    const { bg, text, iconBg } = colorClasses[color] || colorClasses.blue;

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
                    <div className="h-6 w-20 rounded bg-gray-200"></div>
                </div>
                <div className="h-8 w-24 rounded bg-gray-200 mb-2"></div>
                <div className="h-4 w-32 rounded bg-gray-200"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${bg}`}>
                    <Icon className={`h-6 w-6 ${text}`} />
                </div>
                {change && (
                    <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {change}
                    </div>
                )}
            </div>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            <div className="text-gray-500 text-sm">{title}</div>
            
            {change && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                        {isPositive ? (
                            <>
                                <TrendingUpIcon className="h-3 w-3 mr-1 text-green-500" />
                                <span>Increased from last period</span>
                            </>
                        ) : (
                            <>
                                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                                <span>Decreased from last period</span>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}