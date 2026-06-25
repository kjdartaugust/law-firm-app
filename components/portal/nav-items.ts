import {
  LayoutDashboard, Briefcase, FileText, CalendarClock,
  Receipt, MessagesSquare, Users, ShieldCheck, type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '@/lib/types';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const baseNav: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cases', label: 'Cases', icon: Briefcase },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/appointments', label: 'Appointments', icon: CalendarClock },
  { href: '/billing', label: 'Billing', icon: Receipt },
  { href: '/messages', label: 'Messages', icon: MessagesSquare },
];

/** Primary nav for a given role (excludes the admin entry). */
export function getNav(role: UserRole): NavItem[] {
  const nav = [...baseNav];
  if (role === 'lawyer' || role === 'admin') {
    nav.push({ href: '/attorneys', label: 'Directory', icon: Users });
  }
  return nav;
}

export const adminNavItem: NavItem = { href: '/admin', label: 'Admin Dashboard', icon: ShieldCheck };
