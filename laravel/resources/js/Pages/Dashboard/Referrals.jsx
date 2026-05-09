import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { Link2, Copy, Share2, Users, TrendingUp } from 'lucide-react';

export default function Referrals() {
    const referralLink = 'https://dollorgrows.com/ref/abc123xyz';
    const referralStats = [
        { label: 'Total Referrals', value: '128', change: '+8 this month' },
        { label: 'Active Referrals', value: '89', change: '+5 this month' },
        { label: 'Total Commission', value: '$1,245.50', change: '+$245.50 this month' },
        { label: 'Pending Bonus', value: '$125.00', change: 'Available for withdrawal' },
    ];

    const referralTiers = [
        { level: 'Level 1', commission: '10%', referrals: 'Direct referrals' },
        { level: 'Level 2', commission: '5%', referrals: 'Second level referrals' },
        { level: 'Level 3', commission: '3%', referrals: 'Third level referrals' },
        { level: 'Level 4', commission: '1%', referrals: 'Fourth level referrals' },
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        alert('Referral link copied to clipboard!');
    };

    return (
        <DashboardLayout>
            <Head title="Referral Program" />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Referral Program</h1>
                        <p className="text-gray-600">Invite friends and earn commissions on their investments</p>
                    </div>
                    <button className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow">
                        <Share2 className="inline-block h-5 w-5 mr-2" />
                        Share Program
                    </button>
                </div>

                {/* Referral Link Card */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                        <Link2 className="h-6 w-6 text-blue-600 mr-3" />
                        <h2 className="text-xl font-bold text-gray-900">Your Personal Referral Link</h2>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200">
                            <code className="text-gray-800 break-all">{referralLink}</code>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-800 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                        >
                            <Copy className="h-5 w-5 mr-2" />
                            Copy Link
                        </button>
                    </div>
                    <p className="text-gray-600 text-sm mt-4">
                        Share this link with friends. You'll earn commissions on their deposits and investments.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {referralStats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-gray-500 text-sm mb-2">{stat.label}</div>
                            <div className="text-sm text-green-600">{stat.change}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Commission Tiers */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Commission Tiers</h2>
                        <div className="space-y-4">
                            {referralTiers.map((tier, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                                    <div className="flex items-center">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold mr-4">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{tier.level}</div>
                                            <div className="text-sm text-gray-500">{tier.referrals}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-green-600">{tier.commission}</div>
                                        <div className="text-sm text-gray-500">Commission</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">How It Works</h2>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold mr-4 flex-shrink-0">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Share Your Link</h3>
                                    <p className="text-gray-600 text-sm">Share your unique referral link with friends and family</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold mr-4 flex-shrink-0">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">They Sign Up</h3>
                                    <p className="text-gray-600 text-sm">Your referrals sign up using your link and make their first deposit</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold mr-4 flex-shrink-0">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Earn Commissions</h3>
                                    <p className="text-gray-600 text-sm">Earn commissions on all their investments across multiple levels</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}