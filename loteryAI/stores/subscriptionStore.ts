import { create } from 'zustand';

interface SubscriptionDetails {
  plan: string;
  renewalDate: string;
}

interface SubscriptionState {
  isSubscribed: boolean;
  subscriptionDetails: SubscriptionDetails | null;
  setSubscription: (details: SubscriptionDetails) => void;
  cancelSubscription: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  isSubscribed: true, // set to false
  subscriptionDetails: null,
  setSubscription: (details) =>
    set({
      isSubscribed: true,
      subscriptionDetails: details,
    }),
  cancelSubscription: () =>
    set({
      isSubscribed: false,
      subscriptionDetails: null,
    }),
}));