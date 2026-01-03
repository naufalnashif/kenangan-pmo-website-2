'use client';

import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { GachaPrizeOutput } from '@/ai/flows/gacha-flow';

export const RarityBadge = ({ rarity }: { rarity: GachaPrizeOutput['rarity'] }) => {
    const rarityStyles = {
        Common: 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-200',
        Rare: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-100',
        Epic: 'bg-gradient-to-r from-purple-200 to-pink-200 text-purple-900 border-purple-300 hover:bg-gradient-to-r',
        'Super Epic': 'bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 text-white border-amber-500 shadow-lg hover:bg-gradient-to-r',
    };
    return (
        <Badge className={cn("capitalize", rarityStyles[rarity])}>
            {rarity.replace(/ /g, '\u00A0')}
        </Badge>
    );
};
