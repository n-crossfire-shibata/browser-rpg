'use client';

import { useGame } from '@/app/context/GameContext';
import SidePanel from '@/app/components/SidePanel';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state } = useGame();

  return (
    <>
      {children}
      <SidePanel party_members={state.party.members} />
    </>
  );
}