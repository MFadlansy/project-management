import { Head, Link, router } from '@inertiajs/react';
import React, { PropsWithChildren, ReactNode, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const ApplicationLogoWithText: React.FC<{className?: string; textClassName?: string}> = ({className, textClassName}) => (
    <div className="flex items-center space-x-2">
        <svg
            className={`${className || 'mx-auto w-16 h-16 text-blue-500 mb-3 animate-bounce-slow'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-9a1 1 0 012 0v4a1 1 0 01-2 0V11zm-3-1a1 1 0 012 0v5a1 1 0 01-2 0V10zm6 0a1 1 0 012 0v5a1 1 0 01-2 0V10zM8 8a1 1 0 011-1h6a1 1 0 011 1v1a1 1 0 01-2 0V9h-4v1a1 1 0 01-2 0V8z" />
        </svg>
        <span className={`${textClassName || 'text-white font-semibold text-xl'}`}>PM System</span>
    </div>
);

const ApplicationIcon: React.FC<{className?: string}> = ({className}) => (
    <svg
        className={`${className || 'h-9 w-9 text-gray-800'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-9a1 10 012 0v4a1 10 01-2 0V11zm-3-1a1 10 012 0v5a1 10 01-2 0V10zm6 0a1 10 012 0v5a1 10 01-2 0V10zM8 8a1 10 011-1h6a1 10 011 1v1a1 10 01-2 0V9h-4v1a1 10 01-2 0V8z" />
    </svg>
);


const NavLink: React.FC<{ href: string; active?: boolean; children: ReactNode }> = ({ href, active, children }) => (
    <Link href={href} className={`block py-2 px-4 rounded-md ${active ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
        {children}
    </Link>
);

interface DropdownProps {
    children: ReactNode;
}

interface DropdownTriggerProps {
    children: ReactNode;
}

interface DropdownContentProps {
    children: ReactNode;
    align?: 'left' | 'right';
}

const DropdownLink: React.FC<{ children: ReactNode; href?: string; method?: string; as?: string; onClick?: () => void }> = ({ children, href, onClick, as, method }) => {
    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            onClick();
        }
        if (href && !as) {
        }
    };

    if (as === 'button') {
        return (
            <button
                onClick={handleClick}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
                {children}
            </button>
        );
    }

    return (
        <Link href={href || '#'} onClick={handleClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            {children}
        </Link>
    );
};


const Dropdown: React.FC<DropdownProps> & {
    Trigger: React.FC<DropdownTriggerProps>;
    Content: React.FC<DropdownContentProps>;
    Link: React.FC<any>;
} = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    const childrenArray = React.Children.toArray(children);
    const trigger = childrenArray.find(child => (child as React.ReactElement).type === Dropdown.Trigger);
    const content = childrenArray.find(child => (child as React.ReactElement).type === Dropdown.Content);

    const clonedTrigger = trigger ? React.cloneElement(trigger as React.ReactElement, { onClick: toggleOpen }) : null;

    return (
        <div className="relative">
            {clonedTrigger}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1"
                     onClick={closeDropdown}
                >
                    {content}
                </div>
            )}
        </div>
    );
};

Dropdown.Trigger = ({ children, onClick }: DropdownTriggerProps & { onClick?: () => void }) => {
    return React.cloneElement(children as React.ReactElement, { onClick });
};
Dropdown.Content = ({ children }: DropdownContentProps) => <>{children}</>;
Dropdown.Link = DropdownLink;


export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { user, loading, hasRole, can, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
                Memuat aplikasi...
            </div>
        );
    }
    if (!user) {
        router.visit('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                ></div>
            )}

            <aside
                className={`bg-gray-800 text-white w-64 flex-shrink-0 transition-transform duration-300 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40`}
            >
                <div className="h-16 flex items-center justify-center border-b border-gray-700">
                    <Link href="/dashboard">
                        <ApplicationLogoWithText
                            className="h-7 w-7 text-gray-200"
                            textClassName="text-white font-semibold text-xl"
                        />
                    </Link>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                        Dashboard
                    </NavLink>

                    {hasRole('admin') && (
                        <NavLink href={route('user.index')} active={route().current('user.index')}>
                            Manajemen Pengguna
                        </NavLink>
                    )}

                    {(hasRole('admin') || hasRole('project_manager') || hasRole('team_member')) && (
                        <NavLink href={route('projects.index')} active={route().current('projects.index')}>
                            Proyek
                        </NavLink>
                    )}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-100 shadow-sm">
                    <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                        >
                            <span className="sr-only">Toggle sidebar</span>
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                {isSidebarOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>

                        {header && (
                            <div className="flex-1 flex items-center ml-4 md:ml-0">
                                {header}
                            </div>
                        )}

                        <div className="flex items-center">
                            <div className="relative ml-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                        >
                                            {user?.name}
                                            <svg
                                                className="-me-0.5 ms-2 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            as="button"
                                            onClick={logout}
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}