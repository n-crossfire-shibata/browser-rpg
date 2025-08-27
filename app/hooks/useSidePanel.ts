'use client';

import { useState } from 'react';

export type TabType = 'party' | 'deck' | 'inventory' | 'settings';

export function useSidePanel() {
  const [is_open, set_is_open] = useState(false);
  const [active_tab, set_active_tab] = useState<TabType>('party');

  const toggle_panel = () => {
    set_is_open(!is_open);
  };

  const open_panel = () => {
    set_is_open(true);
  };

  const close_panel = () => {
    set_is_open(false);
  };

  const switch_tab = (tab: TabType) => {
    set_active_tab(tab);
    if (!is_open) {
      set_is_open(true);
    }
  };

  return {
    is_open,
    active_tab,
    toggle_panel,
    open_panel,
    close_panel,
    switch_tab,
  };
}