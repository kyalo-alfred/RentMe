'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function AuthNav() {
    const { user, logout, loading } = useAuth();

    if (loading) {
        return null; // or a loading skeleton
    }

    return (
        <div className="flex items-center gap-4">
            {user ? (
                <>
                    <span className="text-sm text-gray-600">
                        Welcome, {user.first_name || user.username}!
                    </span>
                    <Link href="/profile">
                        <Button variant="outline" size="sm" className="border-black">
                            Profile
                        </Button>
                    </Link>
                    <Button
                        onClick={logout}
                        size="sm"
                        className="bg-black text-white hover:bg-gray-800"
                    >
                        Logout
                    </Button>
                </>
            ) : (
                <>
                    <Link href="/signin">
                        <Button variant="outline" size="sm" className="border-black">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                            Sign Up
                        </Button>
                    </Link>
                </>
            )}
        </div>
    );
}
