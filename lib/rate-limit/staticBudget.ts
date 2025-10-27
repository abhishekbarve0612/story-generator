import { DEFAULT_POLICY, OVERRIDES, WHITELIST } from "./config";

type Store = Map<string, number>

const globalAny = globalThis as any

const store: Store = (globalAny.__STATIC_BUDGET_STORE ?? new Map())

export type RateLimitResult =
    | { allowed: true; remaining: number; policy: number | 'unlimited' | 'bypass' }
    | { allowed: false; remaining: 0; policy: number | 'unlimited' | 'bypass' }

export function ipFromRequest(request: Request): string {
    const forward = request.headers.get('x-forwarded-for')
    const ip = (forward && forward.split(',')[0].trim()) || request.headers.get('x-real-ip') || '127.0.0.1'

    return ip
}

function capacityForIP(ip: string): number | 'unlimited' | 'bypass' {
    if (WHITELIST.has(ip)) return 'bypass'

    const override = OVERRIDES.get(ip)

    if (override !== undefined) return override === 'unlimited' ? 'unlimited' : override

    return DEFAULT_POLICY.capacity
}

export function consume(ip: string): RateLimitResult {
    const capacity = capacityForIP(ip)

    if (capacity === 'bypass' || capacity === 'unlimited') {
        return {
            allowed: true,
            remaining: Infinity,
            policy: capacity,
        }
    }

    const current = store.get(ip)
    if (current === undefined) {
        const remaining = capacity - 1
        store.set(ip, remaining)

        return {
            allowed: true,
            remaining,
            policy: capacity,
        }
    }

    const remaining = current - 1

    store.set(ip, remaining)

    return {
        allowed: true,
        remaining,
        policy: capacity,
    }
}