import { useState, useEffect } from 'react';
import {
  ChhathDailyGreetingState,
  getChhathDailyGreetingState,
} from '../utils/chhathDaySchedule';

/**
 * React hook that tracks the active Chhath Puja day and daily greeting
 * synchronized to India Standard Time (Asia/Kolkata, UTC+5:30).
 * Updates every second so the greeting automatically flips at 00:00:00 AM IST.
 */
export function useChhathDailyGreeting(): ChhathDailyGreetingState {
  const [state, setState] = useState<ChhathDailyGreetingState>(() =>
    getChhathDailyGreetingState()
  );

  useEffect(() => {
    const sync = () => {
      setState(getChhathDailyGreetingState(Date.now()));
    };

    sync();
    const interval = setInterval(sync, 1000);
    return () => clearInterval(interval);
  }, []);

  return state;
}
