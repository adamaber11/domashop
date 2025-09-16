'use client';

import { useCurrency } from '@/context/currency-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export function CurrencySelector() {
  const { currencies, selectedCurrency, setSelectedCurrency, loading } = useCurrency();

  if (loading) {
    return <Skeleton className="h-9 w-24 rounded-md" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Globe className="h-4 w-4 me-2" />
          {selectedCurrency.code}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={selectedCurrency.code}
          onValueChange={(code) => {
            const newCurrency = currencies.find((c) => c.code === code);
            if (newCurrency) {
              setSelectedCurrency(newCurrency);
            }
          }}
        >
          {currencies.map((currency) => (
            <DropdownMenuRadioItem key={currency.code} value={currency.code}>
              {currency.name} ({currency.code})
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
