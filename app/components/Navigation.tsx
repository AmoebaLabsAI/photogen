import Link from 'next/link'

export function Navigation() {
    return (
        <nav className="...">
            {/* ... (existing navigation items) */}
            <Link href="/fine-tune" className="...">
                Fine-tune
            </Link>
        </nav>
    )
}