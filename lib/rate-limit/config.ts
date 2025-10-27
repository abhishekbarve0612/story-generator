export type StaticPolicy = {
    capacity: number
}

export const DEFAULT_POLICY: StaticPolicy = {
    capacity: 20
}

export const WHITELIST = new Set<string>([
    "127.0.0.1",
    "localhost",
])

export const OVERRIDES = new Map<string, StaticPolicy['capacity'] | 'unlimited'>([
    ["127.0.0.1", 1000],
    ["localhost", 1000],
])

function parseEnvList(name: string): string[] {
    const value = process.env[name]
    return value ? value.split(',').map(s => s.trim()).filter(Boolean) : []
}

function parseOverridesFromEnv(name: string) {
    try {
        return JSON.parse(process.env[name] ?? '{}') as Record<string, number | 'unlimited'>
    } catch {
        return {}
    }
}

for (const ip of parseEnvList('RATE_LIMIT_WHITELIST')) {
    WHITELIST.add(ip)
}

for (const [ip, capacity] of Object.entries(parseOverridesFromEnv('RATE_LIMIT_OVERRIDES'))) {
    OVERRIDES.set(ip, capacity)
}
