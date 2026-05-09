import { DollarSign, TrendingUp, Calendar, Users, CheckCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function PoolCard({ pool, isFeatured = false }) {
    const {
        id,
        name,
        description,
        minimum_investment,
        maximum_investment,
        daily_return,
        duration_days,
        is_active,
        total_capacity,
        total_invested,
        commission_level_1,
        commission_level_2,
        commission_level_3,
        bonus_percent
    } = pool;

    const filledPercentage = total_capacity > 0 
        ? Math.min(100, (total_invested / total_capacity) * 100) 
        : 0;

    const calculateReturn = (amount) => {
        const daily = amount * (daily_return / 100);
        const total = daily * duration_days;
        return { daily, total };
    };

    const exampleReturn = calculateReturn(minimum_investment);

    return (
        <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl ${isFeatured ? 'ring-2 ring-blue-500' : ''}`}>
            {isFeatured && (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-bold">
                    ⭐ FEATURED POOL
                </div>
            )}
            
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{description}</p>
                    </div>
                    {is_active ? (
                        <span className="flex items-center text-green-600 text-sm font-medium">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Active
                        </span>
                    ) : (
                        <span className="text-red-600 text-sm font-medium">Inactive</span>
                    )}
                </div>

                {/* Investment Range */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-500">Investment Range</div>
                        <div className="text-sm font-medium text-gray-900">
                            ${minimum_investment.toLocaleString()} - ${maximum_investment.toLocaleString()}
                        </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            style={{ width: `${filledPercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>${total_invested.toLocaleString()} invested</span>
                        <span>${total_capacity.toLocaleString()} capacity</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">{daily_return}%</div>
                        <div className="text-xs text-gray-500">Daily Return</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-green-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">{duration_days}</div>
                        <div className="text-xs text-gray-500">Days</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <DollarSign className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">${exampleReturn.total.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Total Return*</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <Users className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">{commission_level_1}%</div>
                        <div className="text-xs text-gray-500">Level 1 Commission</div>
                    </div>
                </div>

                {/* Commission Levels */}
                <div className="mb-6">
                    <div className="text-sm font-medium text-gray-700 mb-2">Commission Levels</div>
                    <div className="flex justify-between text-sm">
                        <div className="text-center">
                            <div className="font-bold text-gray-900">Level 1</div>
                            <div className="text-green-600">{commission_level_1}%</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-gray-900">Level 2</div>
                            <div className="text-blue-600">{commission_level_2}%</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-gray-900">Level 3</div>
                            <div className="text-purple-600">{commission_level_3}%</div>
                        </div>
                        {bonus_percent > 0 && (
                            <div className="text-center">
                                <div className="font-bold text-gray-900">Bonus</div>
                                <div className="text-orange-600">{bonus_percent}%</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Example Calculation */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div className="text-sm font-medium text-gray-700 mb-2">Example Calculation</div>
                    <div className="text-sm text-gray-600">
                        Invest ${minimum_investment.toLocaleString()} for {duration_days} days
                    </div>
                    <div className="flex justify-between mt-2">
                        <div>
                            <div className="text-xs text-gray-500">Daily Profit</div>
                            <div className="font-bold text-green-600">${exampleReturn.daily.toFixed(2)}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">Total Profit</div>
                            <div className="font-bold text-green-600">${exampleReturn.total.toFixed(2)}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">ROI</div>
                            <div className="font-bold text-green-600">{((exampleReturn.total / minimum_investment) * 100).toFixed(1)}%</div>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <Link
                    href={`/dashboard/pools/${id}`}
                    className={`block w-full py-3 text-center font-semibold rounded-xl transition-all ${
                        is_active
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {is_active ? 'Invest Now' : 'Coming Soon'}
                </Link>

                <div className="text-xs text-gray-500 text-center mt-3">
                    *Example based on minimum investment. Returns may vary.
                </div>
            </div>
        </div>
    );
}