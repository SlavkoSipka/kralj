import { supabase } from './supabase';

export type UserRole = 'admin' | 'vendor' | 'user';

export interface UserRoleData {
  id: number;
  auth_id: string;
  role: UserRole;
  user_id?: number;
  vendor_id?: number;
  active: boolean;
  // Populated data
  user?: any; // Data from user table
  vendor?: any; // Data from vendor table
}

// Login za sve tipove korisnika
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Preuzmi role data
  const roleData = await getUserRole(data.user.id);
  
  if (!roleData || !roleData.active) {
    await supabase.auth.signOut();
    throw new Error('Pristup nije dozvoljen');
  }

  return { user: data.user, roleData };
}

// Logout
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Preuzmi role data sa related entities
export async function getUserRole(authId: string): Promise<UserRoleData | null> {
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      *,
      user:user_id (*),
      vendor:vendor_id (*)
    `)
    .eq('auth_id', authId)
    .single();

  if (error) return null;
  return data;
}

// Proveri trenutnog korisnika
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const roleData = await getUserRole(user.id);
  if (!roleData) return null;

  return { user, roleData };
}

// Proveri da li je korisnik određene role
export function hasRole(roleData: UserRoleData | null, role: UserRole): boolean {
  return roleData?.role === role && roleData?.active === true;
}

// Helper funkcije
export function isAdmin(roleData: UserRoleData | null): boolean {
  return hasRole(roleData, 'admin');
}

export function isVendor(roleData: UserRoleData | null): boolean {
  return hasRole(roleData, 'vendor');
}

export function isUser(roleData: UserRoleData | null): boolean {
  return hasRole(roleData, 'user');
}

// Auth state listener
export function onAuthStateChange(callback: (authenticated: boolean) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(!!session);
  });
}

